import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from '@src/app.module';
import { join } from 'path';

async function bootstrap() {
  // Hybrid app: an HTTP server (for k8s liveness/readiness probes) alongside the
  // gRPC microservice (the actual API). Previously gRPC-only via
  // createMicroservice, which left no HTTP surface for probes.
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      // Bind gRPC to all interfaces so other pods can reach it on k8s.
      // The NestJS default (localhost:5000) only accepted same-host connections.
      url: process.env.GRPC_URL || '0.0.0.0:5000',
      package: 'user',
      protoPath: join(__dirname, '../../proto/user.proto')
    }
  });

  await app.startAllMicroservices();
  // HTTP is served only for /health/live and /health/ready. Bind 0.0.0.0 so
  // kubelet can reach it on the pod IP.
  await app.listen(process.env.HEALTH_PORT || 5001, '0.0.0.0');
}
bootstrap();
