import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from '@image/image.service';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { KafkaAdminService } from '@kafka/kafka.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [ImageService, KafkaAdminService, CloudinaryService]
})
export class AppModule {}
