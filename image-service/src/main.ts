import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        // Env-driven so the same image points at the in-cluster `kafka` Service
        // on k8s and localhost in local dev.
        brokers: [
          process.env.KAFKA_BROKER_1 || 'localhost:9092',
          process.env.KAFKA_BROKER_2 || 'localhost:9093'
        ]
      }
    }
  });

  await app.listen();
}
bootstrap();
