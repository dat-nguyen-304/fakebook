import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './auth.service';
import { CreateUserDto, LoginDto } from './auth.entity';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('signin')
    login(@Body() loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') token: string) {
        return this.userService.refresh(token);
    }
}
