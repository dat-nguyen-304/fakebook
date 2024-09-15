import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserServiceClient, USER_SERVICE_NAME, UpdateUserDto, UpdateUserRequest } from '@proto/user';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { KafkaService } from './kafka.service';

@Injectable()
export class UserService implements OnModuleInit {
  private grpcService: UserServiceClient;

  constructor(
    @Inject('user') private client: ClientGrpc,
    private kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.grpcService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updateUserRequest: UpdateUserRequest = { updateUserDto, userId };
    const response = await lastValueFrom(this.grpcService.updateUser(updateUserRequest));
    if (!response.success) throw new BadRequestException(response.message);
    return response.data;
  }

  async updateImage(userId: string, image: Express.Multer.File, type: string) {
    this.kafkaService.sendImageUploadMessage({ file: image.buffer.toString('base64'), userId, type });
    return `Uploading ${type} ...`;
  }
}
