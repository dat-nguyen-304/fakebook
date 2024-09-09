import { Module } from '@nestjs/common';
import { UserModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [UserModule, RedisModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: []
})
export class AppModule {}
