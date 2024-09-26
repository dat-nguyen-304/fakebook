import { CreateUserDto, LoginDto, UpdateUserDto, UpdateUserImageDto, UserResponse } from '@proto/user';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import * as argon from 'argon2';
import formattedResponse from './response.format';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent, FriendAcceptEvent, FriendRequestEvent, UpdateUserEvent } from './notification.event';

@Injectable()
export class UserService {
  private driver: Driver;

  constructor(
    private readonly configService: ConfigService,
    @Inject('WS_SERVICE') private readonly wsClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientKafka
  ) {
    this.driver = neo4j.driver(
      this.configService.get('NEO4J_HOST'),
      neo4j.auth.basic(this.configService.get('NEO4J_USERNAME'), this.configService.get('NEO4J_PASSWORD'))
    );
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

  async findAll() {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER) RETURN user;');
      const users = result.records.map(record => record.get('user').properties);
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
      return formattedResponse('success', undefined, records[0].get(0).properties);
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
      return formattedResponse('success', undefined, records[0].get(0).properties);
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
      if (type === 'avatar') this.notificationClient.emit('update_user', new UpdateUserEvent(userId, null, url));
      return formattedResponse('success', undefined, records[0].get('u').properties);
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

      const users = result.records.map(record => record.get('user').properties);
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
