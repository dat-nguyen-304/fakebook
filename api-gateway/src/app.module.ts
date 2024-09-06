import { Module } from '@nestjs/common';
import { UserModule } from '@auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@db/data-source';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(dataSourceOptions), ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: []
})
export class AppModule {}
