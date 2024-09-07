import { CreateUserDto, LoginDto, UpdateUserDto, UserResponse } from '@proto/auth';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  private readonly driver: Driver;

  constructor(private readonly configService: ConfigService) {
    this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
  }

  async findByUsername(username: string) {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER {username : $username}) RETURN user;', {
        username
      });
      if (result.records.length === 0) return null;
      return result.records[0].get(0).properties;
    } catch (error) {
      console.log({ error });
    } finally {
      session.close();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const session = this.driver.session();
    try {
      const checkUser = await this.findByUsername(createUserDto.username);
      if (checkUser)
        return {
          success: false,
          message: 'Username already exists',
          data: null
        };
      const addedResult = await session.run(
        'CREATE (user: USER {id: $uuid, username: $username, fullName: $fullName, password: $password, gender: $gender, createdDate: timestamp(), updatedDate: timestamp()}) RETURN user;',
        {
          uuid: randomUUID(),
          username: createUserDto.username,
          fullName: createUserDto.fullName,
          gender: createUserDto.gender,
          password: await argon.hash(createUserDto.password)
        }
      );

      const newUser = addedResult.records[0].get(0).properties;
      delete newUser.password;
      return {
        message: 'Success',
        success: true,
        data: newUser
      };
    } catch (error) {
      console.log({ error });
      session.close();
    } finally {
      session.close();
    }
  }

  async login(loginDto: LoginDto) {
    const session = this.driver.session();
    try {
      const user = await this.findByUsername(loginDto.username);
      if (!user)
        return {
          success: false,
          message: 'Username does not exist',
          data: null
        };

      const pwMatches = await argon.verify(user.password, loginDto.password);
      if (!pwMatches)
        return {
          success: false,
          message: 'Password is incorrect',
          data: null
        };

      delete user.password;
      return {
        success: true,
        message: 'success',
        data: user
      };
    } catch (error) {
      console.log({ error });
    } finally {
      session.close();
    }
  }

  findAll() {
    return {
      data: null,
      success: true,
      message: 'Coming soon ...'
    };
  }

  async findOne(id: string) {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER {id : $id}) RETURN user;', { id });
      if (result.records.length === 0) return null;
      return result.records[0].get(0).properties;
    } catch (error) {
      console.log({ error });
    } finally {
      session.close();
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return {
      data: null,
      success: true,
      message: 'Coming soon ...'
    };
  }
}
