import { Body, Controller, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UpdateUserDto } from '@proto/auth';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  create(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }
}
