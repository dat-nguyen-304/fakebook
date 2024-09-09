import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthService } from '@auth/auth.service';
import { USER_PACKAGE_NAME } from '@proto/auth';
import { JwtStrategy } from '@auth/strategy/index';
import { RedisModule } from '@redis/redis.module';
import { TokenModule } from '@token/token.module';

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
    RedisModule,
    TokenModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
