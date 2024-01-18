import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, UserServiceClient, USER_SERVICE_NAME, LoginDto } from '../../proto/auth';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserServiceClient;

    constructor(@Inject('user') private client: ClientGrpc) {}

    onModuleInit() {
        this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    create(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    login(loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }
}
