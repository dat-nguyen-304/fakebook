import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserServiceClient, USER_SERVICE_NAME, UpdateUserDto, UpdateUserRequest } from '@proto/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private service: UserServiceClient;

  constructor(@Inject('user') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updateUserRequest: UpdateUserRequest = { updateUserDto, userId };
    const response = await lastValueFrom(this.service.updateUser(updateUserRequest));
    if (!response.success) throw new BadRequestException(response.message);
    return response.data;
  }
}
