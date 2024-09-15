import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@proto/user';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { KafkaAdminService } from '@kafka/kafka-admin.service';
import { KafkaService } from '@kafka/kafka.service';
import { ImageService } from '@image/image.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'user',
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../proto/user.proto')
        }
      }
    ])
  ],
  providers: [KafkaAdminService, KafkaService, CloudinaryService, ImageService]
})
export class AppModule {}
