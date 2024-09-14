import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from '@proto/auth';
import { join } from 'path';
import { KafkaService } from './kafka.service';

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
    ])
  ],
  providers: [UserService, KafkaService],
  controllers: [UserController]
})
export class UserModule {}
