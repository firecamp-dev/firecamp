import { Module } from '@nestjs/common';
import { SocketIoV4Gateway } from './socket-io-v4.gateway';

@Module({
  providers: [SocketIoV4Gateway],
})
export class SocketIoModule { }
