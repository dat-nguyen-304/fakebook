/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

/**
 * npm i ts-proto
 * protoc --plugin=protoc-gen-ts_proto=.\\node_modules\\.bin\\protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
 */

export interface Status {
    success: boolean;
    message: string;
}

export interface UserResponse {
    status: Status | undefined;
    user: User | undefined;
}

export interface UsersResponse {
    status: Status | undefined;
    users: Users | undefined;
}

export interface TokenResponse {
    status: Status | undefined;
    accessToken: string;
    refreshToken: string;
}

export interface PaginationDto {
    page: number;
    skip: number;
}

export interface UpdateUserDto {
    id: string;
    age: number;
    password: string;
    fullName: string;
}

export interface FindOneUserDto {
    id: string;
}

export interface Empty {}

export interface Users {
    users: User[];
}

export interface CreateUserDto {
    username: string;
    password: string;
    fullName: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    password: string;
    fullName: string;
    age: number;
    isOnline: boolean;
    lastOnline: number;
    createdDate: number;
    updatedDate: number;
}

export const USER_PACKAGE_NAME = 'user';

export interface UserServiceClient {
    createUser(request: CreateUserDto): Observable<UserResponse>;

    login(request: LoginDto): Observable<TokenResponse>;

    findAllUsers(request: Empty): Observable<UsersResponse>;

    findOneUser(request: FindOneUserDto): Observable<UserResponse>;

    updateUser(request: UpdateUserDto): Observable<UserResponse>;
}

export interface UserServiceController {
    createUser(request: CreateUserDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

    login(request: LoginDto): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

    findAllUsers(request: Empty): Promise<UsersResponse> | Observable<UsersResponse> | UsersResponse;

    findOneUser(request: FindOneUserDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

    updateUser(request: UpdateUserDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
}

export function UserServiceControllerMethods() {
    return function (constructor: Function) {
        const grpcMethods: string[] = ['createUser', 'login', 'findAllUsers', 'findOneUser', 'updateUser'];
        for (const method of grpcMethods) {
            const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            GrpcMethod('UserService', method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods: string[] = [];
        for (const method of grpcStreamMethods) {
            const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            GrpcStreamMethod('UserService', method)(constructor.prototype[method], method, descriptor);
        }
    };
}

export const USER_SERVICE_NAME = 'UserService';
