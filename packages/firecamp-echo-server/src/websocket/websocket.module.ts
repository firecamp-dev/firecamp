import { Module } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketGateway],
})
export class WebSocketModule {}
