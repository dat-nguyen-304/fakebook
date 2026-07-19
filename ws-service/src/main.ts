import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      // Bind TCP to all interfaces so other pods (notification-service,
      // user-service) can reach it on k8s. NestJS default (localhost:3002)
      // only accepted same-host connections.
      host: process.env.WS_TCP_HOST || '0.0.0.0',
      port: parseInt(process.env.WS_TCP_PORT || '3002', 10)
    }
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
