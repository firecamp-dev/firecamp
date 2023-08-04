import {
  // SubscribeMessage,
  // MessageBody,
  // ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io-v4';

@WebSocketGateway(8084, { cors: true, transports: ['websocket', 'polling'] })
export class SocketIoV4Gateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log('connection connected')
    client.on('*', (data) => {
      console.log(data)
    })
    client.onAny((event, ...args) => {
      const [cb, ..._args] = args.reverse();
      // console.log(`got incoming ${event}`, _args);
      if (typeof cb == 'function') {
        cb(..._args);
        client.emit(event, ..._args)
      }
      else {
        client.emit(event, ...args)
      }
    });

    // client.onAnyOutgoing((event, ...args) => {
    //   console.log(`got ${event}`);
    // });
  }

  // @SubscribeMessage('events')
  // doStuff(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   console.log(data);
  //   return { event: 'events', data };
  // }

  // @SubscribeMessage('*')
  // echoMessage(@MessageBody() data: any) {
  //   console.log(data);
  //   return { event: 'events', data };
  //   return data;
  // }
}
