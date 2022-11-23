import mitt from 'mitt'
import * as bodyParser from './body-parser'
import {
  CustomLogTypes,
  ConnectionStatus,
  EArgumentType,
  ELogEvents,
  ELogTypes,
  ELogColors
} from './constants'
import { IEmitterArgument, ILog } from './types'
import { IExecutorInterface, TExecutorOptions } from './executor.interface'
import ConfigGenerator from './config-generator'
import { ESocketIOClientVersion, EFirecampAgent } from '@firecamp/types'
import { _misc } from '@firecamp/utils'

// TODO: Update logic to emit the event with and without args
// TODO: Review logic to handle listener with and without args

// Fetch firecamp agent
const firecampAgent = _misc.firecampAgent()

const {
  CONNECTING,
  CONNECT,
  CONNECT_ERROR,
  CONNECT_TIMEOUT,
  ERROR,
  DISCONNECT,
  RECONNECT,
  RECONNECT_ATTEMPT,
  RECONNECTING,
  RECONNECT_ERROR,
  RECONNECT_FAILED
} = ConnectionStatus

export default class Executor implements IExecutorInterface {

  #io: any
  socket: any
  #intervals: any
  #emitterLogCount: number
  #listenerLogCount: number
  #systemLogCount: number
  #connectionId: string
  #connection: any
  eventEmitter: any
  #pinging: boolean

  /**
   * Maintain the active listeners list
   * To prevent duplicate adding on socket reconnect
   */
  #activeListeners = new Map()

  constructor(options: TExecutorOptions) {
    this.#io = options.io
    this.socket = null
    this.#intervals = {}
    this.#emitterLogCount = 0
    this.#listenerLogCount = 0
    this.#systemLogCount = 0
    this.#connectionId = options.connection.id
    this.eventEmitter = mitt()

    const { address, clientOptions } = new ConfigGenerator(options).prepare()

    this.#connection = {
      address,
      clientOptions
    }

    this.#pinging = false

  }

  log(title: string, message: any, meta: any): ILog {
    if (!meta.timestamp) meta.timestamp = Date.now()

    // In normal EMIT/LISTEN event name will be a title so assign that
    // same title as event in meta as standard usage at frontend if needed
    if (!meta.event) meta.event = title
    if (meta.type) {
      switch (meta.type) {
        case ELogTypes.SEND:
          meta.id = `${ELogTypes.SEND}-${meta.id}`
          title = `Emit on: ${title}, ID: ${meta.id}`
          break
        case ELogTypes.RECEIVE:
          meta.id = `${ELogTypes.RECEIVE}-${meta.id}`
          title = `Listen on: ${title}, ID: ${meta.id}`
          break
        case ELogTypes.ACK:
          meta.id = `${ELogTypes.ACK}-${meta.id}`
          title = `Ack on: ${title}, ID: ${meta.id}`
          break
        default:
          meta.id = `${ELogTypes.SYSTEM}-${++this.#systemLogCount}`
          break
      }
    }
    return {
      title,
      message,
      meta
    }
  }

  addListener(eventName: string): void {

    // Check if listener already exist
    if (!this.#activeListeners.has(eventName)) {
      this.#activeListeners.set(eventName, '')
    } else return

    // TODO: Parse eventName via env. variable
    let title = `Listening on event: ${event}`
    let meta = {
      type: ELogTypes.SYSTEM,
      color: ELogColors.SUCCESS,
      event: CustomLogTypes.LISTEN_ON
    }

    let log = this.log(title, '', meta)

    this.emitLog(log)

    // @deprecated in socket.io-client@3.0.0
    // Fired when a pong is received from the server.
    if (eventName === 'PONG') {
      this.socket.on(eventName, () => {
        log = this.log(eventName, [{
          body: 'Pinging',
          meta: {
            type: 'text',
            envelope: ''
          }
        }], {
          type: ELogTypes.RECEIVE,
          id: ++this.#listenerLogCount
        })

        this.emitLog(log)
      })
    } else {
      this.socket.on(eventName, async (...args: Array<any>) => {
        log = this.log(eventName, [], {
          type: ELogTypes.RECEIVE,
          id: ++this.#listenerLogCount
        })

        const body = await bodyParser.parseListenerData(args)

        if (body?.length === 0)
          body.push({
            payload: ''
          })

        log.message = body

        // Calculate the length of the argument and add into the log
        args.forEach((arg, index) => {
          console.log({ arg, type: typeof arg, byteLength: arg?.byteLength, length: arg.length })
          if ([EArgumentType.ARRAY_BUFFER, EArgumentType.ARRAY_BUFFER_VIEW, EArgumentType.FILE].includes(body[index].meta.type))
            log.message[index].meta.length = Object.values(this.calculateMessageSize(arg?.byteLength)).join(' ')
          else log.message[index].meta.length = arg?.length
        })

        this.emitLog(log)
      })
    }
  }

  /**
   * Return `response data` value with unit
   * @param size - size of response data returned from the rest service
   * @returns {{unit: string, value: *}}
   */
  calculateMessageSize(size: number): { value: any, unit: string } {
    let finalSize: { value: any, unit: string }

    if (typeof size === 'number') {
      if (size < 1024) {
        finalSize = {
          value: size,
          unit: 'B'
        }
      } else if (size < 1048576) {
        finalSize = {
          value: size / 1024,
          unit: 'Kb'
        }
      } else if (size < 1073741824) {
        finalSize = {
          value: size / 1e6,
          unit: 'Mb'
        }
      } else {
        finalSize = {
          value: size / 1e9,
          unit: 'Gb'
        }
      }

      if (finalSize.value) {
        finalSize.value = finalSize.value.toFixed(2)

        if (
          typeof finalSize.value === 'string' &&
          finalSize.value.includes('.00')
        ) {
          finalSize.value = finalSize.value.substring(
            0,
            finalSize.value.length - 3
          )
        }
      }
    } else {
      size = Number(size)

      if (isNaN(size)) {
        finalSize = { value: size, unit: '-' }
      } else {
        finalSize = { value: size, unit: 'B' }
      }
    }

    return finalSize
  }

  addListeners(eventNames: Array<string>): void {
    eventNames.map(event => {
      this.addListener(event)
    })
  }

  removeListener(eventName: string): void {
    const title = `Listen off: ${eventName}`
    const log = this.log(title, '', {
      type: ELogTypes.SYSTEM,
      color: ELogColors.DANGER,
      event: CustomLogTypes.LISTEN_OFF
    })
    this.emitLog(log)
    this.socket.off(eventName)

    // Remove listener event from the active listeners list
    this.#activeListeners.delete(eventName)
  }

  removeListeners(eventNames: Array<string> = []): void {
    if (Array.isArray(eventNames)) {
      for (let i = 0; i < eventNames.length; i += 1) {
        this.removeListener(eventNames[i])
      }
    }
  }

  removeAllListeners(): void {
    // send logs of removed listeners
    for (const element of this.#activeListeners) {
      const title = `Listen off: ${element[0]}`
      const log = this.log(title, '', {
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER,
        event: CustomLogTypes.LISTEN_OFF
      })
      this.emitLog(log)
    }

    // Remove all event listeners from socket instance
    this.socket.removeAllListeners()

    // Remove list of active listeners of a specific connection
    this.#activeListeners.clear()
  }

  emitLog(log: ILog, event = ELogEvents.common): void {
    this.eventEmitter.emit(`${this.#connectionId}-${event}`, log)
  }

  onOpen(cb: (log: ILog) => void): void {
    this.eventEmitter.on(`${this.#connectionId}-${ELogEvents.onOpen}`, (log: ILog) => cb(log))
  }

  onClose(cb: (log: ILog) => void): void {
    this.eventEmitter.on(`${this.#connectionId}-${ELogEvents.onClose}`, (log: ILog) => cb(log))
  }

  onConnecting(cb: (log: ILog) => void): void {
    this.eventEmitter.on(`${this.#connectionId}-${ELogEvents.onConnecting}`, (log: ILog) => cb(log))
  }

  logs(cb: (log: ILog) => void): void {
    this.eventEmitter.on(`${this.#connectionId}-${ELogEvents.common}`, (log: ILog) => cb(log))
  }

  async prepareEmitPayload(eventName: string, args: Array<IEmitterArgument>): Promise<any> {
    let log: any

    if (args?.length > 0)
      log = this.log(eventName, args, {
        type: ELogTypes.SEND,
        id: this.#emitterLogCount++
      })
    else
      log = this.log(eventName, [{
        payload: ''
      }], {
        type: ELogTypes.SEND,
        id: this.#emitterLogCount++
      })

    const body = await bodyParser.parseEmitterArguments(args)

    args.forEach((arg, index) => {
      if ([EArgumentType.ARRAY_BUFFER, EArgumentType.ARRAY_BUFFER_VIEW, EArgumentType.FILE].includes(arg.meta.type))
        log.message[index].meta.length = Object.values(this.calculateMessageSize(body[index]?.byteLength)).join(' ')
      else log.message[index].meta.length = body[index]?.length
    })

    this.emitLog(log)

    return { event: eventName, body, logId: log.meta.id }
  }

  async emit(eventName: string, args: Array<IEmitterArgument>): Promise<void> {
    try {
      const { event, body } = await this.prepareEmitPayload(eventName, args)

      if (event === 'message') {
        // Send args with socket.send if event = message
        // @reference: https://socket.io/docs/client-api/#socket-send-%E2%80%A6args-ack
        if (body?.length > 0)
          this.socket.send(...body)
        else this.socket.send()
      } else {
        if (body?.length > 0)
          this.socket.emit(event, ...body)
        else this.socket.emit(event)
      }

      return Promise.resolve()
    } catch (error) {
      const title = typeof error === 'string' ? error : error.message || ERROR
      const log = this.log(title, '', {
        event: ERROR,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })
      this.emitLog(log)
    }
  }

  async emitWithAck(eventName: string, args: Array<IEmitterArgument>): Promise<void> {
    try {
      const { event, body, logId } = await this.prepareEmitPayload(
        eventName,
        args
      )

      // Send args with socket.send if event = message
      // Reference: https://socket.io/docs/client-api/#socket-send-%E2%80%A6args-ack
      if (event === 'message') {
        if (body?.length > 0) {
          this.socket.send(...body, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs)

            if (ackBody?.length === 0)
              ackBody.push({
                payload: ''
              })

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.ACK,
              id: logId
            })

            this.emitLog(ackLog)
          })
        }
        else {
          this.socket.send(async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs)
            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.ACK,
              id: logId
            })

            if (ackBody?.length === 0)
              ackBody.push({
                payload: ''
              })

            this.emitLog(ackLog)
          })
        }
      } else {
        if (body?.length > 0) {
          this.socket.emit(event, ...body, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs)

            if (ackBody?.length === 0)
              ackBody.push({
                payload: ''
              })

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.ACK,
              id: logId
            })

            this.emitLog(ackLog)
          })
        } else {
          this.socket.emit(event, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs)

            if (ackBody?.length === 0)
              ackBody.push({
                payload: ''
              })

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.ACK,
              id: logId
            })

            this.emitLog(ackLog)
          })
        }
      }
    } catch (error) {
      const title = typeof error === 'string' ? error : error.message || ERROR
      const log = this.log(title, '', {
        event: ERROR,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })
      this.emitLog(log)
    }
  }

  ping(interval: number): void {
    this.#pinging = true

    let log = this.log('Pinging', [], {
      type: ELogTypes.SYSTEM,
      color: ELogColors.SUCCESS
    })

    this.emitLog(log)

    // Start pining if connection is open
    if (this.socket && !this.socket.connected) {
      log = this.log("Can't Ping, Connection is not open yet", [], {
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })

      this.emitLog(log)

      return
    }

    if (interval) {
      this.#intervals.PING = setInterval(() => {
        log = this.log(
          'PING',
          [
            {
              payload: 'Pinging',
              meta: {
                type: 'text',
                envelope: ''
              }
            }
          ],
          {
            type: ELogTypes.SEND,
            id: ++this.#emitterLogCount
          }
        )

        this.emitLog(log)

        if (this.#connection.config.version === 'v2') this.socket.emit('PING')

        if (this.#connection.config.version !== 'v2')
          this.socket.emit('PING', () => {
            log = this.log('PONG', [{
              payload: 'Pinging',
              meta: {
                type: 'text',
                envelope: ''
              }
            }], {
              type: ELogTypes.RECEIVE,
              id: ++this.#listenerLogCount
            })

            this.emitLog(log)
          })
      }, interval)
    }
  }

  stopPinging(): void {
    const log = this.log('Pinging Stopped', [], {
      type: ELogTypes.SYSTEM,
      color: ELogColors.DANGER
    })

    this.emitLog(log)

    this.#pinging = false

    clearInterval(this.#intervals.PING)
  }

  connect(): any {
    try {
      const { address, clientOptions } = this.#connection

      switch (clientOptions.version) {
        // Create instance of socket.io-client@2.4.0
        case ESocketIOClientVersion.v2: this.socket = this.#io.v2(address, clientOptions)

          break
        // Create instance of socket.io-client@3.1.0
        case ESocketIOClientVersion.v3: this.socket = this.#io.v3(address, clientOptions)

          break
        // Create instance of socket.io-client@4.1.3
        case ESocketIOClientVersion.v4: this.socket = this.#io.v4(address, clientOptions)

          break

        default:
        // Create instance of socket.io-client@2.4.0
        case ESocketIOClientVersion.v2: this.socket = this.#io.v2(address, clientOptions)

          break
      }

      const title = 'Socket has been created. The connection is not yet open.'
      const log = this.log(title, '', {
        event: CONNECTING,
        type: ELogTypes.SYSTEM,
        color: ELogColors.SUCCESS
      })

      // this.emitLog(log, ELogEvents.onConnecting)
      this.emitLog(log)

      // Fired upon connection to the Namespace (including a successful reconnection).
      this.socket.on(CONNECT, () => {
        const title = 'Socket connected successfully'
        const log = this.log(title, '', {
          event: CONNECT,
          type: ELogTypes.SYSTEM,
          color: ELogColors.SUCCESS
        })

        this.emitLog(log, ELogEvents.onOpen)
        this.emitLog(log)

        // Start pinging if ping enable
        if (
          firecampAgent === EFirecampAgent.desktop &&
          clientOptions &&
          clientOptions.ping &&
          clientOptions.pingInterval
        ) {
          this.ping(clientOptions.pingInterval)
        }
      })

      // Fired when an namespace middleware error occurs.
      this.socket.on(CONNECT_ERROR, (error: Error) => {
        const title = error instanceof Error ? error.message : error
        const log = this.log(title, '', {
          event: CONNECT_ERROR,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.emitLog(log)
      })

      // @deprecated in socket.io-client@2.4.0
      // Fired upon a connection timeout.
      this.socket.io.on(CONNECT_TIMEOUT, (timeout: number) => {
        const title = `Connection timeout(${timeout})`
        const log = this.log(title, '', {
          event: CONNECT_TIMEOUT,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.emitLog(log)
      })

      // Previously listen using the socket instance directly
      // Fired upon a connection error.
      this.socket.io.on(ERROR, (error: Error) => {
        const title = error instanceof Error ? error.message : error
        const log = this.log(title, '', {
          event: ERROR,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.emitLog(log)
      })

      // Fired upon disconnection.
      this.socket.on(DISCONNECT, (reason: string) => {
        const title = reason
        const log = this.log(title, '', {
          event: DISCONNECT,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })

        if (this.#pinging) this.stopPinging()

        this.emitLog(log, ELogEvents.onClose)
        this.emitLog(log)

        if (!clientOptions.reconnection) this.unsubscribe()
      })

      // Previously listen using the socket instance directly
      // Fired upon a successful reconnection.
      this.socket.io.on(RECONNECT, (attemptNumber: number) => {
        const title = `Attempt number(${attemptNumber})`
        const log = this.log(title, '', {
          event: RECONNECT,
          type: ELogTypes.SYSTEM,
          color: ELogColors.WARNING
        })
        this.emitLog(log, ELogEvents.onConnecting)
        this.emitLog(log)
      })

      // Previously listen using the socket instance directly
      // Fired upon an attempt to reconnect.
      this.socket.io.on(RECONNECT_ATTEMPT, attemptNumber => {
        const title = `Attempt number(${attemptNumber})`
        const log = this.log(title, '', {
          event: RECONNECT_ATTEMPT,
          type: ELogTypes.SYSTEM,
          color: ELogColors.WARNING
        })
        this.emitLog(log)
      })

      // @deprecated in socket.io-client@3.0.0
      // Fired upon an attempt to reconnect.
      this.socket.io.on(RECONNECTING, attemptNumber => {
        const title = `Attempt number(${attemptNumber})`
        const log = this.log(title, '', {
          event: RECONNECTING,
          type: ELogTypes.SYSTEM,
          color: ELogColors.WARNING
        })
        this.emitLog(log, ELogEvents.onConnecting)
        this.emitLog(log)
      })

      // Previously listen using the socket instance directly
      // Fired upon a reconnection attempt error.
      this.socket.io.on(RECONNECT_ERROR, error => {
        const title = error instanceof Error ? error.message : error
        const log = this.log(title, '', {
          event: RECONNECT_ERROR,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.emitLog(log)
      })

      // Previously listen using the socket instance directly
      // Fired when couldn’t reconnect within reconnectionAttempts.
      this.socket.io.on(RECONNECT_FAILED, () => {
        const title =
          "The client couldn't reconnect within reconnection attempts"
        const log = this.log(title, '', {
          event: RECONNECT_FAILED,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.emitLog(log)
        this.unsubscribe()
      })

      return this
    } catch (error) {
      const title = error instanceof Error ? error.message : error || ERROR
      const log = this.log(title, '', {
        event: ERROR,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })
      this.emitLog(log)
      this.unsubscribe()
    }
  }

  close(): void {
    // disconnect the socket client
    if (this.socket.connected)
      this.socket.disconnect()

    // send the log
    const title = `${DISCONNECT}`
    const log = this.log(title, '', {
      event: DISCONNECT,
      type: ELogTypes.SYSTEM,
      color: ELogColors.DANGER
    })

    this.emitLog(log)
    this.unsubscribe()
  }

  unsubscribe(): void {
    this.eventEmitter.all.clear()
  }

  socketID(): string {
    return this.socket.id
  }

  connected(): boolean {
    return this.socket.connected
  }
}

export * from './executor.interface'

export * from './types'

export * from './constants'