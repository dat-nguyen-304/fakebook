import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, UserServiceClient, USER_SERVICE_NAME, LoginDto } from '@proto/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject('user') private client: ClientGrpc,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const response = await lastValueFrom(this.userService.login(loginDto));
    const user = response.user;
    if (!user) throw new BadRequestException('Can not find user');
    const tokens = await this.signToken(user.id, user.username, user.fullName);
    return tokens;
  }

  async refresh(refreshToken: string) {
    const { id, username, fullName } = await this.jwt.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET')
    });
    const response = await lastValueFrom(this.userService.findOneUser({ id }));
    if (!response) throw new BadRequestException('Can not find user');
    const tokens = await this.signToken(id, username, fullName);
    return tokens;
  }

  async signToken(id: string, username: string, fullName: string) {
    const payload = { id, username, fullName };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '15d',
      secret: this.config.get('JWT_REFRESH_SECRET')
    });

    return { accessToken, refreshToken };
  }
}
