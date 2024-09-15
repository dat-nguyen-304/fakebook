import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserServiceClient, USER_SERVICE_NAME, UpdateUserImageDto } from '@proto/user';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ImageService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('user') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async updateUserImage(userId: string, updateUserImageDto: UpdateUserImageDto) {
    try {
      await lastValueFrom(this.userService.updateUserImage({ userId, updateUserImageDto }));
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new RpcException('Failed to update user avatar');
    }
  }
}
