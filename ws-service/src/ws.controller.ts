import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WsGateway } from './ws.gateway';

@Controller()
export class WsController {
  constructor(private readonly wsGateway: WsGateway) {}

  @EventPattern('imageReady')
  handleImageReady(@Payload() data: { userId: string; imageUrl: string; type: string }) {
    console.log('Received imageReady event:', data);
    this.wsGateway.notifyImageReady(data.userId, data.imageUrl, data.type);
  }
}
