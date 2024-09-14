// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.20.3
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

/**
 * npm i ts-proto
 * npx protoc --plugin=protoc-gen-ts_proto=.\\node_modules\\.bin\\protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
 */

export enum Gender {
  MALE = 0,
  FEMALE = 1,
  UNRECOGNIZED = -1,
}

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  isOnline: boolean;
  biography: string;
  gender: Gender;
  avatar: string;
  cover: string;
  work: string;
  school: string;
  hometown: string;
  living: string;
  followers: number;
  lastOnline: number;
  createdDate: number;
  updatedDate: number;
}

export interface Empty {
}

export interface Users {
  users: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User | undefined;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: Users | undefined;
}

export interface PaginationDto {
  page: number;
  skip: number;
}

export interface UpdateUserRequest {
  userId: string;
  updateUserDto: UpdateUserDto | undefined;
}

export interface UpdateUserDto {
  password?: string | undefined;
  fullName?: string | undefined;
  biography?: string | undefined;
  gender?: Gender | undefined;
  work?: string | undefined;
  school?: string | undefined;
  hometown?: string | undefined;
  living?: string | undefined;
}

export interface UpdateUserImageRequest {
  userId: string;
  updateUserImageDto: UpdateUserImageDto | undefined;
}

export interface UpdateUserImageDto {
  url: string;
  type: string;
}

export interface FindOneUserDto {
  id: string;
}

export interface CreateUserDto {
  username: string;
  fullName: string;
  gender: Gender;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserDto): Observable<UserResponse>;

  login(request: LoginDto): Observable<UserResponse>;

  findAllUsers(request: Empty): Observable<UsersResponse>;

  findOneUser(request: FindOneUserDto): Observable<UserResponse>;

  updateUser(request: UpdateUserRequest): Observable<UserResponse>;

  updateUserImage(request: UpdateUserImageRequest): Observable<UserResponse>;
}

export interface UserServiceController {
  createUser(request: CreateUserDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  login(request: LoginDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  findAllUsers(request: Empty): Promise<UsersResponse> | Observable<UsersResponse> | UsersResponse;

  findOneUser(request: FindOneUserDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateUser(request: UpdateUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateUserImage(request: UpdateUserImageRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "login",
      "findAllUsers",
      "findOneUser",
      "updateUser",
      "updateUserImage",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
