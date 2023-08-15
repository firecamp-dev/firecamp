## Socket.IO Client Executor

**API**

- connect
- emit
- emitWithAck
- addListener
- addListeners
- removeListener
- removeListeners
- removeAllListeners
- clearInterval
- clearIntervals
- ping
- emitLog
- onOpen
- onClose
- onConnecting
- logs

**Connection Status**

- io.socket.disconnected
- io.socket.connected

## API

## **connect**

- API use to connect to the server


**Syntax**

```JavaScript
import { Executor } from "@firecamp/socket.io-executor"

const executor = new Executor({
  io: any
  url: IUrl
  connection: ISocketIOConnection
  config?: ISocketIOConfig
  certificates?: ICertificate[]
})

let io;

try {
  io = executor.connect()
} catch (e) {
  // display the error
} finally {

}
```

## **emit**

- API use for emitting data

**Options**

- eventName: 'event_name'
- args: [ { payload, meta: { type, typedArrayView } } ]
- interval: Number // optional

**Syntax**

```JavaScript
const io = executor.connect()

const args = ['Hey!', { 'name': 'jane' }, Buffer.from([4, 3, 3]]
const interval = 3000

// Without interval
io.emit('test', args)

// With interval
io.emit('test', args, interval)
```

## **emitWithAck**

- API use for emitting data

**Options**

- eventName: 'event_name'
- args: [ { payload, meta: { type, typedArrayView } } ]
- interval: number // optional

**Syntax**

```JavaScript
const io = executor.connect()

const args = ['Hey!', { 'name': 'jane' }, Buffer.from([4, 3, 3]]
const interval = 4000

// Without interval
io.emitWithAck('test', args)

// With interval
io.emitWithAck('test', args, interval)
```

## **addListener**

- API use to add listener

**Options**

- eventName: 'event_name'

**Syntax**

```JavaScript
const io = executor.connect()

io.addListener('test')
```

## **addListeners**

- API use to add multiple listeners

**Options**

- eventNames: ['event_name']

**Syntax**

```JavaScript
const io = executor.connect(url, options)

const eventNames = ['test', 'msg']

io.addListeners(eventNames)
```

## **removeListener**

- API use to remove listener

**Options**

- eventName: 'event_name'

**Syntax**

```JavaScript
const io = executor.connect(url, options)

io.removeListener('test')
```

## **removeListeners**

- API use to remove multiple listeners

**Options**

- eventNames: ['event_names']

**Syntax**

```JavaScript
const io = executor.connect(url, options)

io.removeListeners(['test', 'msg'])
```

## **removeAllListeners**

- API use to remove all listeners

**Options**

- None

**Syntax**

```JavaScript
const io = executor.connect(url, options)

io.removeAllListeners()
```

## **clearInterval**

API use to stop emitting the data on particular interval

**Options**

- eventID

**Syntax**

```JavaScript
const io = executor.connect(url, options)

const interval = 4000

// With interval
io.emitWithAck('test', args, interval)

io.clearInterval(eventID)
```

## **clearIntervals**

API use to stop all intervals

**Options**

- None

**Syntax**

```JavaScript
io.clearIntervals()
```

## **logs**

- API use to event listener arguments
- Also use to listen emitter acknowledgment arguments

**Options**

- function

**Return**

```JavaScript
{
  title: 'Title of the Log card',
  message: 'Message to display in Log card.',
  meta: {
    id,
    event,
    timestamp,
    type: ["r", "d", "ack"],
    color: ["success", "danger"],
    ackRef
  }
}
```

**Syntax**

```JavaScript
const io = executor.connect(url, options)

fn(arg) {}

io.logs(fn)
```

## **ping**

API use to ping to the server

**Options**

- interval // optional

**Syntax**

```JavaScript
const io = executor.connect(url, options)

const interval = 4000

// Without interval
io.ping()

// With interval
io.ping(interval)
```
