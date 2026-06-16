import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
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
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.userService.getAll(Number(page) || 0, Number(limit) || 0);
  }

  @Get('me')
  getMe(@GetUser() user: TokenPayload) {
    return this.userService.getUser(user.id);
  }

  @Patch(':id')
  update(@Param('id') userId: string, @GetUser() user: TokenPayload, @Body() updateUserDto: UpdateUserDto) {
    this.assertSelf(userId, user);
    return this.userService.update(user.id, updateUserDto);
  }

  @Post('/image/:id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async updateImage(
    @Param('id') userId: string,
    @GetUser() user: TokenPayload,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserImage: UpdateUserImageDto //used for post newfeeds
  ) {
    this.assertSelf(userId, user);
    return this.userService.updateImage(user.id, image, updateUserImage.type);
  }

  @Get('/friend-suggestions/:id')
  async getFriendSuggestions(@Param('id') userId: string, @GetUser() user: TokenPayload) {
    this.assertSelf(userId, user);
    return this.userService.getFriendSuggestions(user.id);
  }

  @Post('/send-friend-request/:id')
  async sendFriendRequest(
    @Param('id') userId: string,
    @GetUser() user: TokenPayload,
    @Body() body: AddFriendRequestDto
  ) {
    this.assertSelf(userId, user);
    return this.userService.sendFriendRequest(user.id, body.friendId);
  }

  @Post('/accept-friend-request/:id')
  async acceptFriendRequest(
    @Param('id') userId: string,
    @GetUser() user: TokenPayload,
    @Body() body: AddFriendRequestDto
  ) {
    this.assertSelf(userId, user);
    return this.userService.acceptFriendRequest(user.id, body.friendId);
  }

  @Post('/decline-friend-request/:id')
  async declineFriendRequest(
    @Param('id') userId: string,
    @GetUser() user: TokenPayload,
    @Body() body: AddFriendRequestDto
  ) {
    this.assertSelf(userId, user);
    return this.userService.declineFriendRequest(user.id, body.friendId);
  }

  // The actor is always the authenticated user (JWT). The path `:id` is the
  // claimed actor/resource owner; reject any request where it does not match
  // the JWT identity to prevent IDOR (acting as another user via the URL).
  private assertSelf(targetId: string, user: TokenPayload) {
    if (targetId !== user.id) {
      throw new ForbiddenException('You can only perform this action as yourself');
    }
  }
}
