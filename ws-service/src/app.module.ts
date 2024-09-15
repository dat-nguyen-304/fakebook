import { Module } from '@nestjs/common';
import { WsModule } from './ws.module';
import { WsController } from './ws.controller';

@Module({
  imports: [WsModule],
  controllers: [WsController]
})
export class AppModule {}
