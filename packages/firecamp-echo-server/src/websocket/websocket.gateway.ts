import {
  //   SubscribeMessage,
  //   WsResponse,
  WebSocketGateway as WsGateWay,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit
} from '@nestjs/websockets';

import Ws, { Server } from 'ws';

@WsGateWay(8080, { path: '/raw' })
export class WebSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(ws: Ws) {
    ws.send('ws(echo): connected')
    ws.on('message', (m) => {
      // console.log(m.toString('utf8'), 'm.', typeof m,)
      ws.send(m.toString('utf8'))
    })
  }

  /**
   * {
      "event": "echo",
      "data": "The echo server"
    }
   */
  // @SubscribeMessage('events')
  // onEvent(client: any, data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }
}
