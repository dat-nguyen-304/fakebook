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
      session.close();
      if (result.records.length === 0) return null;
      return result.records[0].get(0).properties;
    } catch (error) {
      console.log({ error });
      session.close();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const session = this.driver.session();
    try {
      const checkUser = await this.findByUsername(createUserDto.username);
      if (checkUser) {
        return {
          user: null,
          status: {
            message: 'Username already exist',
            success: false
          }
        };
      } else {
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
        console.log(createUserDto);
        session.close();
        const newUser = addedResult.records[0].get(0).properties;
        delete newUser.password;
        return {
          user: newUser,
          status: {
            success: true,
            message: 'Success'
          }
        };
      }
    } catch (error) {
      console.log({ error });
      session.close();
    }
  }

  async login(loginDto: LoginDto) {
    const session = this.driver.session();
    try {
      const user = await this.findByUsername(loginDto.username);
      if (!user) {
        return {
          user: null,
          status: {
            success: false,
            message: 'Username does not exist'
          }
        };
      } else {
        const pwMatches = await argon.verify(user.password, loginDto.password);
        if (!pwMatches) {
          return {
            user: null,
            status: {
              success: false,
              message: 'Password is incorrect'
            }
          };
        } else {
          delete user.password;
          return {
            user,
            status: {
              success: true,
              message: 'Success'
            }
          };
        }
      }
    } catch (error) {
      console.log({ error });
      session.close();
    }
    return {
      user: null,
      status: {
        success: true,
        message: 'Success'
      }
    };
  }

  findAll() {
    return {
      users: null,
      status: {
        success: true,
        message: 'Success'
      }
    };
  }

  async findOne(id: string) {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (user:USER {id : $id}) RETURN user;', { id });
      session.close();
      if (result.records.length === 0) return null;
      return result.records[0].get(0).properties;
    } catch (error) {
      console.log({ error });
      session.close();
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return {
      user: null,
      status: {
        success: true,
        message: 'Success'
      }
    };
  }
}
