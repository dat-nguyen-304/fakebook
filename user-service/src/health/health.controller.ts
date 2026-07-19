import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

/**
 * HTTP endpoints that exist ONLY for k8s probes. user-service is otherwise a
 * pure gRPC service; NestFactory.create makes it a hybrid app so kubelet has an
 * HTTP surface to hit.
 */
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  // Liveness: shallow — 200 as long as the process runs. It must NEVER check a
  // dependency (Neo4j), otherwise a Neo4j outage would restart-loop the pod.
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  // Readiness: 200 only after the Neo4j schema init has succeeded, so k8s keeps
  // the pod out of the Service until it can actually serve requests.
  @Get('ready')
  ready() {
    if (!this.health.isReady()) {
      throw new ServiceUnavailableException({ status: 'not-ready' });
    }
    return { status: 'ready' };
  }
}
