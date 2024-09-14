import { CreateUserDto, LoginDto, UpdateUserDto, UpdateUserImageDto, UserResponse } from '@proto/auth';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import * as argon from 'argon2';
import formattedResponse from './response.format';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private driver: Driver;

  constructor(
    private readonly configService: ConfigService,
    @Inject('WS_SERVICE') private readonly wsClient: ClientProxy
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
      if (!foundUser.success)
        return {
          success: false,
          message: 'Username already exists',
          data: null
        };
      const addedResult = await session.run(
        `
          CREATE (user: USER 
          {id: $uuid, username: $username, fullName: $fullName, password: $password, gender: $gender, 
          createdDate: timestamp(), updatedDate: timestamp()}) 
          RETURN user;
        `,
        {
          uuid: randomUUID(),
          username: createUserDto.username,
          fullName: createUserDto.fullName,
          gender: createUserDto.gender,
          password: await argon.hash(createUserDto.password)
        }
      );

      const records = addedResult.records;
      if (!records.length) return formattedResponse('fail');

      const newUser = records[0].get(0).properties;
      delete newUser.password;
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

  findAll() {
    return formattedResponse('success', 'Coming soon...', null);
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
      this.wsClient.emit('imageReady', { userId, imageUrl: url });
      return formattedResponse('success', undefined, records[0].get('u').properties);
    } catch (error) {
      console.error({ error });
      return formattedResponse('fail');
    } finally {
      await session.close();
    }
  }
}
