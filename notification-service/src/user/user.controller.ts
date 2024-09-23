import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('create_user')
  createUser(data: any) {
    this.userService.createUser(data);
  }

  @EventPattern('user_change')
  updateUser(data: any) {
    this.userService.updateUser(data);
  }
}
