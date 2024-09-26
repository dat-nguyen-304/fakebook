import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UpdateUserDto } from '@proto/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AddFriendRequestDto, UpdateUserImageDto } from './user.dto';
import { JwtGuard } from '@src/auth/guard';
import { GetUser } from '@src/decorators';
import { TokenPayload } from '@auth/token.service';

@Controller('user')
@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getAll() {
    return this.userService.getAll();
  }

  @Get('me')
  getMe(@GetUser() user: TokenPayload) {
    return this.userService.getUser(user.id);
  }

  @Patch(':id')
  update(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Post('/image/:id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async updateImage(
    @Param('id') userId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserImage: UpdateUserImageDto //used for post newfeeds
  ) {
    return this.userService.updateImage(userId, image, updateUserImage.type);
  }

  @Get('/friend-suggestions/:id')
  async getFriendSuggestions(@Param('id') userId: string) {
    return this.userService.getFriendSuggestions(userId);
  }

  @Post('/send-friend-request/:id')
  async sendFriendRequest(@Param('id') userId: string, @Body() body: AddFriendRequestDto) {
    return this.userService.sendFriendRequest(userId, body.friendId);
  }

  @Post('/accept-friend-request/:id')
  async acceptFriendRequest(@Param('id') userId: string, @Body() body: AddFriendRequestDto) {
    return this.userService.acceptFriendRequest(userId, body.friendId);
  }

  @Post('/decline-friend-request/:id')
  async declineFriendRequest(@Param('id') userId: string, @Body() body: AddFriendRequestDto) {
    return this.userService.declineFriendRequest(userId, body.friendId);
  }
}
