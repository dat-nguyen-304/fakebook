import { Injectable } from '@nestjs/common';

/**
 * Holds the service's readiness state as a single shared flag. UserService flips
 * it to ready once the Neo4j schema init succeeds; HealthController reads it for
 * the k8s readiness probe. Kept as its own provider so the two don't depend on
 * each other directly.
 */
@Injectable()
export class HealthService {
  private ready = false;

  markReady() {
    this.ready = true;
  }

  isReady() {
    return this.ready;
  }
}
