import { Controller } from '@nestjs/common';
import { UserService } from '@user/user.service';
import {
  UserServiceController,
  CreateUserDto,
  UserServiceControllerMethods,
  FindOneUserDto,
  LoginDto,
  PaginationDto,
  UpdateUserRequest,
  UpdateUserImageRequest,
  SendFriendRequestDto,
  GetFriendSuggestionsDto,
  AcceptFriendRequestDto,
  DeclineFriendRequestDto
} from '@proto/user';

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

  findAllUsers(paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  findOneUser(findOneUserDto: FindOneUserDto) {
    return this.userService.findOne(findOneUserDto.id);
  }

  updateUser({ userId, updateUserDto }: UpdateUserRequest) {
    return this.userService.update(userId, updateUserDto);
  }

  updateUserImage({ userId, updateUserImageDto }: UpdateUserImageRequest) {
    return this.userService.updateImage(userId, updateUserImageDto);
  }

  getFriendSuggestions({ userId }: GetFriendSuggestionsDto) {
    return this.userService.getFriendSuggestions(userId);
  }

  sendFriendRequest({ senderId, receiverId }: SendFriendRequestDto) {
    return this.userService.sendFriendRequest(senderId, receiverId);
  }

  acceptFriendRequest({ senderId, receiverId }: AcceptFriendRequestDto) {
    return this.userService.acceptFriendRequest(senderId, receiverId);
  }

  declineFriendRequest({ senderId, receiverId }: DeclineFriendRequestDto) {
    return this.userService.declineFriendRequest(senderId, receiverId);
  }
}
