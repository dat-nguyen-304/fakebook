import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from '@src/app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      // Bind gRPC to all interfaces so other pods can reach it on k8s.
      // The NestJS default (localhost:5000) only accepted same-host connections.
      url: process.env.GRPC_URL || '0.0.0.0:5000',
      package: 'user',
      protoPath: join(__dirname, '../../proto/user.proto')
    }
  });
  await app.listen();
}
bootstrap();
