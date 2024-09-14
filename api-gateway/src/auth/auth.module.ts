import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@proto/auth';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/strategy/index';
import { TokenService } from '@auth/token.service';
import { RedisService } from '@auth/redis.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'user',
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/auth.proto')
        }
      }
    ]),
    JwtModule.register({})
  ],
  providers: [AuthService, JwtStrategy, TokenService, RedisService],
  controllers: [AuthController]
})
export class AuthModule {}
