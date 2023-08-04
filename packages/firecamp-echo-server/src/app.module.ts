import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { WebSocketModule } from './websocket/websocket.module';
import { SocketIoModule } from './socket-io/socket-io.module';

@Module({
  imports: [
    RestModule,
    // SocketIoModule,
    WebSocketModule,
  ]
})
export class AppModule { }
