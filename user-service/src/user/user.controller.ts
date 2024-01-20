import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
    UserServiceController,
    CreateUserDto,
    UpdateUserDto,
    UserServiceControllerMethods,
    FindOneUserDto,
    LoginDto
} from '@/proto/auth';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
    constructor(private readonly userService: UserService) {}
    createUser(createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    login(loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    findAllUsers() {
        return this.userService.findAll();
    }

    findOneUser(findOneUserDto: FindOneUserDto) {
        return this.userService.findOne(findOneUserDto.id);
    }

    updateUser(updateUserDto: UpdateUserDto) {
        return this.userService.update(updateUserDto.id, updateUserDto);
    }
}
