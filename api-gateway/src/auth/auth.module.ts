import { Module } from '@nestjs/common';
import { UserController } from '@auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from '@auth/auth.service';
import { USER_PACKAGE_NAME } from '@proto/auth';
import { JwtStrategy } from '@auth/strategy/index';
import { RedisModule } from '@redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from '@src/redis/redis.service';

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
    JwtModule.register({})
  ],
  providers: [UserService, JwtStrategy, RedisService],
  controllers: [UserController]
})
export class UserModule {}
