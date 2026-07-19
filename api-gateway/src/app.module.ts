import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, HealthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
