import { Module } from '@nestjs/common';
import { UserModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: []
})
export class AppModule {}
