import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto, LoginDto, User } from '@proto/auth';
import { AttachTokensInterceptor } from '@handlers/attach-token.interceptor';
import { JwtGuard } from './guard';
import { GetUser } from '@src/decorators';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.AuthService.create(createUserDto);
  }

  @Post('signin')
  @UseInterceptors(AttachTokensInterceptor)
  login(@Body() loginDto: LoginDto) {
    return this.AuthService.login(loginDto);
  }

  @Post('refresh')
  @UseInterceptors(AttachTokensInterceptor)
  refresh(@Body('refreshToken') token: string) {
    return this.AuthService.refresh(token);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }
}
