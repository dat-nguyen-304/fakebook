import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern } from '@nestjs/microservices';
import { ICreateUser, IUpdateUser } from './user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('create-user')
  createUser(data: ICreateUser) {
    this.userService.createUser(data);
  }

  @EventPattern('update-user')
  updateUser(data: IUpdateUser) {
    this.userService.updateUser(data);
  }
}
