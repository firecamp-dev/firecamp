Handle the WebSocket request client connection

## <ins>To-Dos</ins>
- [x] Update the inputs of connection by predefined types
- [x] New listeners added: onopen, onclose, onreconnect, logs
- [x] listeners deprecated: subscribe, connectionState
- [ ] All inputs env. variables parsed before pass to the executor
- [x] How to manage certificates
- [ ] How to manage cookies
- [ ] How to manage send message for file. check for `file.readAsArrayBuffer(ws_message)`
- [ ] How to manage query params connection wise

## <ins>Notes</ins>
- do subscribe all listeners before connect
  - onopen
  - onclose
  - onreconnect
  - logs
- destroy executor instance when connection close in front-end

## <ins>Usage</ins>

### <ins>How to open connection</ins>
```ts
import Executor from '@firecamp/ws-executor'

// Just for reference, from where types will be derived
import { IUrl, IWebSocketConfig, IWebSocketConnection } from '@firecamp/types'

const executor: IExecutor = new Executor(options: TExecutorOptions)

// Fired when connection open
executor.onopen(() => {
  // Set logic to show connection is open in UI
})

// Fired when connection close
executor.onclose(() => {
  // Set logic to show connection is close in UI
})

// Fired when auto reconnecting
executor.onreconnect(() => {
  // Set logic to show reconnecting in UI
})

// Request to open a client connection
executor.connect()

// WebSocket log
interface ILog {
  title: string
  message: IMessage
  meta: {
      uuid: string
      event: string
      timestamp: number
      type: "R" | "S" | "ACK" | "SYS"
      color: "success" | "danger"
      ackRef: any
  }
}

// Receives the connection logs
executor.logs((log: ILog) => {
    // Render the log according to the connection UUID
})
```

### <ins>Close the connection</ins>
```ts
// Disconnect the client connection
executor.disconnect(code: number, reason: string)
```

### <ins>Send the message</ins>
```ts
// Send the message 
executor.send(message: IWebSocketMessage)
```
