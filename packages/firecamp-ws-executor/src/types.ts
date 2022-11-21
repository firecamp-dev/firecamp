import { EEnvelope, EMessageBodyType, IWebSocketMessage } from '@firecamp/types'

// WebSocket log
export interface ILog {
  title: string
  message: IWebSocketMessage
  meta: {
    id: string
    event: string
    timestamp: number
    type: "R" | "S" | "ACK" | "SYS"
    color: "success" | "danger"
    ackRef: any
    // Message length
    length: string
  }
}


// WebSocket received message
export interface IWebSocketResponseMessage {
  body: any
  meta: {
    type: EMessageBodyType
    envelope?: EEnvelope
  }
}