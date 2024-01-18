import {
    CreateUserDto,
    LoginDto,
    PaginationDto,
    UpdateUserDto,
    User,
    UserResponse,
    Users,
    UsersResponse
} from '@/proto/auth';
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    private readonly driver: Driver;

    constructor(private readonly configService: ConfigService) {
        this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponse> {
        const session = this.driver.session();
        try {
            const user = await session.run('MATCH (user:USER {username : $username}) RETURN user;', {
                username: createUserDto.username
            });
            if (user.records.length !== 0) {
                session.close();
                return {
                    user: null,
                    status: {
                        message: 'username is already exist',
                        success: false
                    }
                };
            } else {
                const addedResult = await session.run(
                    'CREATE (user: USER {id: $uuid, username: $username, fullName: $fullName, password: $password, createdDate: timestamp(), updatedDate: timestamp()}) RETURN user;',
                    {
                        uuid: randomUUID(),
                        username: createUserDto.username,
                        fullName: createUserDto.fullName,
                        password: await argon.hash(createUserDto.password)
                    }
                );
                let newUser = addedResult.records[0].get(0).properties;
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

    login(loginDto: LoginDto) {
        return {
            accessToken: null,
            refreshToken: null,
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

    findOne(id: string) {
        return {
            user: null,
            status: {
                success: true,
                message: 'Success'
            }
        };
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
