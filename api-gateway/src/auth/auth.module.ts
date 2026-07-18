import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@proto/user';
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
          // Where to reach the user-service gRPC server. On k8s this is the
          // Service DNS name (user-service:5000); default keeps local dev working.
          url: process.env.USER_SERVICE_GRPC_URL || 'localhost:5000',
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/user.proto')
        }
      }
    ]),
    JwtModule.register({})
  ],
  providers: [AuthService, JwtStrategy, TokenService, RedisService],
  controllers: [AuthController]
})
export class AuthModule {}
