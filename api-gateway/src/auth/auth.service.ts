import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, UserServiceClient, USER_SERVICE_NAME, LoginDto } from '@proto/user';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RedisService } from '@auth/redis.service';
import { TokenService } from '@auth/token.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject('user') private client: ClientGrpc,
    private redis: RedisService,
    private token: TokenService
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async register(createUserDto: CreateUserDto) {
    const response = await lastValueFrom(this.userService.createUser(createUserDto));
    if (!response.success) throw new BadRequestException(response.message);
    return response.data;
  }

  async login(loginDto: LoginDto) {
    const response = await lastValueFrom(this.userService.login(loginDto));
    const user = response.data;
    if (!user) throw new BadRequestException(response.message);
    const tokens = await this.token.signToken({ id: user.id, fullName: user.fullName });
    this.redis.storeToken(tokens);
    return tokens;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Not found refresh token');
    const { id, fullName } = await this.token.verifyRefreshToken(refreshToken);
    const isValidRefreshToken = await this.redis.isValidToken(refreshToken, 'refresh');

    if (!isValidRefreshToken) {
      await this.redis.deleteAllTokensForUser(id);
      throw new BadRequestException('Your session is invalidated due to an anomaly');
    }

    await this.redis.deleteToken(refreshToken, 'refresh');

    const tokens = await this.token.signToken({ id, fullName });
    this.redis.storeToken(tokens);
    return tokens;
  }

  async logout(accessToken: string, refreshToken: string) {
    await this.redis.deleteToken(accessToken, 'access');
    await this.redis.deleteToken(refreshToken, 'refresh');

    return 'Logged out successfully';
  }
}
