import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        // Kafka brokers are env-driven so the same image points at the
        // in-cluster `kafka` Service on k8s and localhost in local dev.
        brokers: [
          process.env.KAFKA_BROKER_1 || 'localhost:9092',
          process.env.KAFKA_BROKER_2 || 'localhost:9093'
        ]
      },
      consumer: {
        groupId: 'notification-consumer'
      }
    }
  });
  await app.listen();
}
bootstrap();
