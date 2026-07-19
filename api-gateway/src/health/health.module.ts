import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { HealthController } from './health.controller';

// Imports AuthModule to reuse its RedisService (exported) for the readiness check.
@Module({
  imports: [AuthModule],
  controllers: [HealthController]
})
export class HealthModule {}
