import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from '@proto/user';
import { join } from 'path';
import { KafkaService } from './kafka.service';

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
    ])
  ],
  providers: [UserService, KafkaService],
  controllers: [UserController]
})
export class UserModule {}
