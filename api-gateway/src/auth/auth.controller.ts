import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@auth/auth.service';
import { CreateUserDto, LoginDto, User } from '@proto/auth';
import { AttachTokensInterceptor } from '@handlers/attach-token.interceptor';
import { JwtGuard } from './guard';
import { GetUser } from '@src/decorators';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('signin')
  @UseInterceptors(AttachTokensInterceptor)
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh')
  @UseInterceptors(AttachTokensInterceptor)
  refresh(@Body('refreshToken') token: string) {
    return this.userService.refresh(token);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }
}
