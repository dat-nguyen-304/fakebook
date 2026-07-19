import { CreateUserDto, LoginDto, PaginationDto, UpdateUserDto, UpdateUserImageDto, UserResponse } from '@proto/user';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import * as argon from 'argon2';
import formattedResponse from './response.format';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent, FriendAcceptEvent, FriendRequestEvent, UpdateUserEvent } from './notification.event';
import { HealthService } from '../health/health.service';

@Injectable()
export class UserService implements OnModuleInit {
  private driver: Driver;

  constructor(
    private readonly configService: ConfigService,
    @Inject('WS_SERVICE') private readonly wsClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientKafka,
    private readonly healthService: HealthService
  ) {
    this.driver = neo4j.driver(
      this.configService.get('NEO4J_HOST'),
      neo4j.auth.basic(this.configService.get('NEO4J_USERNAME'), this.configService.get('NEO4J_PASSWORD'))
    );
  }

  onModuleInit() {
    // Fire-and-forget so module init / the gRPC server don't block on Neo4j
    // being reachable at boot. Readiness stays false (probe fails, no traffic
    // routed) until the schema is in place. Fixes FAK-22, which swallowed the
    // first failure and reported healthy with no constraints created.
    this.initSchemaWithRetry();
  }

  /** Create constraints/indexes, retrying with capped exponential backoff until
   *  Neo4j is reachable, then flip the service to ready. */
  private async initSchemaWithRetry() {
    const MAX_DELAY_MS = 30_000;
    let attempt = 0;
    // Loop until success — liveness keeps the pod alive in the meantime, and
    // readiness gates traffic, so retrying forever (with a delay cap) is safe.
    while (true) {
      const session = this.driver.session();
      try {
        await session.run('CREATE CONSTRAINT user_username_unique IF NOT EXISTS FOR (u:USER) REQUIRE u.username IS UNIQUE');
        await session.run('CREATE INDEX user_id_index IF NOT EXISTS FOR (u:USER) ON (u.id)');
        this.healthService.markReady();
        console.log('Neo4j schema initialized; user-service is ready.');
        return;
      } catch (error) {
        attempt++;
        console.error(`Failed to initialize Neo4j schema (attempt ${attempt}):`, error?.message ?? error);
      } finally {
        await session.close();
      }
      const delay = Math.min(1000 * 2 ** (attempt - 1), MAX_DELAY_MS);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  /** Strip the argon2 `password` hash from a Neo4j node's properties before it leaves the service. */
  private sanitize(properties: Record<string, any>) {
    if (!properties) return properties;
    const { password, ...rest } = properties;
    return rest;
  }

  async findByUsername(username: string) {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER {username : $username}) RETURN user;', {
        username
      });
      if (result.records.length === 0) return formattedResponse('fail');
      return formattedResponse('success', undefined, result.records[0].get(0).properties);
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const session = this.driver.session();
    try {
      const foundUser = await this.findByUsername(createUserDto.username);
      if (foundUser.success)
        return {
          success: false,
          message: 'Username already exists',
          data: null
        };
      const addedResult = await session.run(
        `
          CREATE (user: USER 
          {id: $uuid, username: $username, fullName: $fullName, password: $password, gender: $gender, avatar: $avatar, cover: $cover,
          createdDate: timestamp(), updatedDate: timestamp()}) 
          RETURN user;
        `,
        {
          uuid: randomUUID(),
          username: createUserDto.username,
          fullName: createUserDto.fullName,
          gender: createUserDto.gender,
          password: await argon.hash(createUserDto.password),
          avatar: this.configService.get('DEFAULT_AVATAR_URL'),
          cover: this.configService.get('DEFAULT_COVER_URL')
        }
      );

      const records = addedResult.records;
      if (!records.length) return formattedResponse('fail');

      const newUser = records[0].get(0).properties;
      delete newUser.password;
      this.notificationClient.emit('create-user', new CreateUserEvent(newUser.id, newUser.fullName, newUser.avatar));
      return formattedResponse('success', undefined, newUser);
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async login(loginDto: LoginDto) {
    const session = this.driver.session();
    try {
      const foundUser = await this.findByUsername(loginDto.username);
      if (!foundUser.success) return formattedResponse('fail', 'Username does not exist');
      const user = foundUser.data;
      const pwMatches = await argon.verify(user.password, loginDto.password);
      if (!pwMatches) return formattedResponse('fail', 'Password is incorrect');

      delete user.password;
      return formattedResponse('success', undefined, user);
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async findAll(pagination?: PaginationDto) {
    const session = this.driver.session();
    try {
      const page = Math.max(1, pagination?.page || 1);
      const limit = Math.min(100, Math.max(1, pagination?.limit || 20));
      const skip = (page - 1) * limit;
      const result = await session.run(
        'MATCH (user:USER) RETURN user ORDER BY user.createdDate SKIP $skip LIMIT $limit;',
        { skip: neo4j.int(skip), limit: neo4j.int(limit) }
      );
      const users = result.records.map(record => this.sanitize(record.get('user').properties));
      return formattedResponse('success', undefined, users);
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async findOne(id: string) {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER {id : $id}) RETURN user;', { id });

      const records = result.records;
      if (records.length === 0) return formattedResponse('fail');
      return formattedResponse('success', undefined, this.sanitize(records[0].get(0).properties));
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const session = this.driver.session();
    const setClauses = Object.keys(updateUserDto)
      .map(key => `user.${key} = $${key}`)
      .join(', ');
    const query = `MATCH (user:USER {id: $id}) SET ${setClauses} RETURN user`;

    try {
      const result = await session.run(query, { id, ...updateUserDto });

      const records = result.records;
      if (records.length === 0) return formattedResponse('fail');
      if (updateUserDto.fullName)
        this.notificationClient.emit('update-user', new UpdateUserEvent(id, updateUserDto.fullName, null));
      return formattedResponse('success', undefined, this.sanitize(records[0].get(0).properties));
    } catch (error) {
      console.log({ error });
      return formattedResponse('fail');
    } finally {
      session.close();
    }
  }

  async updateImage(userId: string, updateUserImageDto: UpdateUserImageDto) {
    const { url, type } = updateUserImageDto;
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
          MATCH (u:USER {id: $userId})
          SET u.${type} = $url, u.updatedDate = timestamp()
          RETURN u
        `,
        { userId, url, type }
      );
      const records = result.records;
      if (records.length === 0) return formattedResponse('fail');
      this.wsClient.emit('image-ready', { userId, imageUrl: url, type });
      if (type === 'avatar') this.notificationClient.emit('update-user', new UpdateUserEvent(userId, null, url));
      return formattedResponse('success', undefined, this.sanitize(records[0].get('u').properties));
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }

  async getFriendSuggestions(userId: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
          MATCH (user:USER)
          WHERE user.id <> $userId
          AND NOT (user)-[:SENT_FRIEND_REQUEST]->(:USER {id: $userId})
          AND NOT (:USER {id: $userId})-[:SENT_FRIEND_REQUEST]->(user)
          AND NOT (user)-[:FRIEND]->(:USER {id: $userId})
          AND NOT (:USER {id: $userId})-[:FRIEND]->(user)
          RETURN user
        `,
        { userId }
      );

      const users = result.records.map(record => this.sanitize(record.get('user').properties));
      return formattedResponse('success', undefined, users);
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
          MATCH (sender:USER {id: $senderId}), (receiver:USER {id: $receiverId})
          OPTIONAL MATCH (sender)-[r:SENT_FRIEND_REQUEST]->(receiver)
          OPTIONAL MATCH (receiver)-[r2:SENT_FRIEND_REQUEST]->(sender)
          WITH sender, receiver, r, r2
          WHERE r IS NULL AND r2 IS NULL
          CREATE (sender)-[:SENT_FRIEND_REQUEST {sentTime: timestamp(), acceptedTime: null}]->(receiver)
          RETURN sender, receiver
        `,
        { senderId, receiverId }
      );

      const records = result.records;
      if (records.length === 0) return formattedResponse('fail', 'Friend request already exists');
      this.notificationClient.emit('create-notification', new FriendRequestEvent(senderId, receiverId));
      return formattedResponse('success');
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }

  async acceptFriendRequest(senderId: string, receiverId: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
          MATCH (sender:USER {id: $receiverId})-[r:SENT_FRIEND_REQUEST]->(receiver:USER {id: $senderId})
          WHERE r.acceptedTime IS NULL
          SET r.acceptedTime = timestamp()
          CREATE (sender)-[:FRIEND {since: timestamp()}]->(receiver)
          CREATE (receiver)-[:FRIEND {since: timestamp()}]->(sender)
          RETURN sender, receiver
        `,
        { senderId, receiverId }
      );

      const records = result.records;
      if (records.length === 0) return formattedResponse('fail', 'Friend request not found or already accepted');
      this.notificationClient.emit('create-notification', new FriendAcceptEvent(senderId, receiverId));
      return formattedResponse('success');
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }

  async declineFriendRequest(senderId: string, receiverId: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
          MATCH (sender:USER {id: $receiverId})-[r:SENT_FRIEND_REQUEST]->(receiver:USER {id: $senderId})
          WHERE r.acceptedTime IS NULL  
          SET r.declinedTime = timestamp()
          RETURN sender, receiver
        `,
        { senderId, receiverId }
      );

      const records = result.records;
      if (records.length === 0) return formattedResponse('fail', 'Friend request not found');
      return formattedResponse('success');
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }
}
