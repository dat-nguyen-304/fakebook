import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UpdateUserDto } from '@proto/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateUserImageDto } from './user.dto';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.updateImage(userId, image);
  }
}
