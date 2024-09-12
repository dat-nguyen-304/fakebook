import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UpdateUserDto,
  UpdateUserRequest,
  UpdateUserImageRequest
} from '@proto/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ImageService } from '@src/image/image.service';
import { UpdateUserImageDto } from '@proto/auth';

@Injectable()
export class UserService implements OnModuleInit {
  private grpcService: UserServiceClient;

  constructor(
    @Inject('user') private client: ClientGrpc,
    private imageService: ImageService
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

  async updateImage(userId: string, image: Express.Multer.File) {
    const result = await this.imageService.uploadImage(image);
    const updateUserImageDto: UpdateUserImageDto = { url: result.secure_url, type: 'avatar' };
    const updateUserImageRequest: UpdateUserImageRequest = { userId, updateUserImageDto };
    const response = await lastValueFrom(this.grpcService.updateUserImage(updateUserImageRequest));
    if (!response.success) throw new BadRequestException(response.message);
    return response.data;
  }
}
