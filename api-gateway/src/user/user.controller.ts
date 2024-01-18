import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './user.entity';

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
}
