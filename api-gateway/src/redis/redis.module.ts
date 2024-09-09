import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
