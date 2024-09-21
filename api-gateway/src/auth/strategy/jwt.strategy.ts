import { Strategy as CustomStrategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from '@auth/redis.service';
import { TokenService } from '@auth/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(CustomStrategy, 'jwt') {
  constructor(
    private redisService: RedisService,
    private token: TokenService
  ) {
    super();
  }

  error(err: Error): void {
    console.log(err.message);
  }

  async validate(req: Request) {
    const token = req.cookies?.accessToken;
    if (!token) throw new UnauthorizedException('Token is invalid or has been revoked');
    const isTokenValid = await this.redisService.isValidToken(token, 'access');
    if (!isTokenValid) throw new UnauthorizedException('Token is invalid or has been revoked');
    return await this.token.decodeToken(token);
  }
}
