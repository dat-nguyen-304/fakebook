import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, UserServiceClient, USER_SERVICE_NAME, LoginDto } from '@proto/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RedisService } from '@src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject('user') private client: ClientGrpc,
    private jwt: JwtService,
    private redis: RedisService,
    private config: ConfigService
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async create(createUserDto: CreateUserDto) {
    const response = await lastValueFrom(this.userService.createUser(createUserDto));
    if (!response.success) throw new BadRequestException(response.message);
    return response.data;
  }

  async login(loginDto: LoginDto) {
    const response = await lastValueFrom(this.userService.login(loginDto));
    const user = response.data;
    if (!user) throw new BadRequestException(response.message);
    const tokens = await this.signToken(user.id, user.username, user.fullName);
    this.redis.storeToken(tokens);
    return tokens;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Not found refresh token');
    const { id, username, fullName } = await this.jwt.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET')
    });
    const isValidRefreshToken = await this.redis.isValidToken(refreshToken, 'refresh');
    if (!isValidRefreshToken) {
      await this.redis.deleteAllTokensForUser(id);
      throw new BadRequestException('Your session is invalidated due to an anomaly');
    }
    return await this.signToken(id, username, fullName);
  }

  async signToken(id: string, username: string, fullName: string) {
    const payload = { id, username, fullName };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET')
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET')
    });

    return { accessToken, refreshToken };
  }
}
