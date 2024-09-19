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
import { UpdateUserImageDto } from './user.dto';
import { JwtGuard } from '@src/auth/guard';

@Controller('user')
@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getAll() {
    return this.userService.getAll();
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
}
