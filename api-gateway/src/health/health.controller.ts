import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { RedisService } from '@auth/redis.service';

// Routes are under the global /api prefix -> /api/health/live, /api/health/ready.
@Controller('health')
export class HealthController {
  constructor(private readonly redis: RedisService) {}

  // Liveness: shallow — 200 while the HTTP server runs. Never checks a
  // dependency, or an outage would restart-loop the pod.
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  // Readiness: 200 only when Redis (the auth-critical dependency) is connected,
  // so k8s keeps this pod out of the Service while Redis is unreachable.
  @Get('ready')
  ready() {
    if (!this.redis.isReady()) {
      throw new ServiceUnavailableException({ status: 'not-ready' });
    }
    return { status: 'ready' };
  }
}
