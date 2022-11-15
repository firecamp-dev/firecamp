import mitt from 'mitt'
import { EFirecampAgent, EMessageBodyType, IWebSocketMessage } from '@firecamp/types'
import {
  ConnectionStatus,
  ELogEvents,
  ELogTypes,
  ELogColors,
  StatusCodes
} from './constants'
import * as bodyParser from './body-parser'
import { ILog } from './types'
import { TExecutorOptions, IExecutor } from './executor.interface'
import ConfigGenerator from './config-generator'
import { _misc } from '@firecamp/utils'

// Fetch the app agent
const firecampAgent: EFirecampAgent = _misc.firecampAgent()

export default class Executor implements IExecutor {

  #WebSocket: any
  #socket: any
  #intervals: any
  #mitterLogCount: number
  #listenerLogCount: number
  #systemLogCount: number
  #connectionId: string
  #connection: any
  #eventEmitter: any
  #pinging: boolean
  #connected: boolean

  constructor(options: TExecutorOptions) {
    this.#WebSocket = options.WebSocket
    this.#socket = null
    this.#intervals = {}
    this.#mitterLogCount = 0
    this.#listenerLogCount = 0
    this.#systemLogCount = 0
    this.#connectionId = options.connection.id
    this.#eventEmitter = mitt()
    this.#pinging = false
    this.#connected = false

    const { address, protocols, clientOptions } = new ConfigGenerator(options).prepare()

    this.#connection = {
      address,
      protocols,
      clientOptions,
      reconnect: {
        enable: options?.config?.reconnect || false,
        timeout: options?.config?.reconnect || 3000,
        attempts: options?.config?.reconnect_attempts || 3
      }
    }
  }

  connect(): any {
    const { address, protocols, clientOptions } = this.#connection

    try {
      this.#socket = new this.#WebSocket(
        address,
        protocols,
        clientOptions
      )

      let title: string = ConnectionStatus[0].description
      let log: ILog = this.#log(title, '', {
        event: ConnectionStatus[0].state,
        type: ELogTypes.SYSTEM,
        color: ELogColors.SUCCESS
      })

      this.#emitLog(log, ELogEvents.onConnecting)

      if (firecampAgent === EFirecampAgent.desktop) {
        this.#socket.on('pong', async arg => {
          log = this.#log(
            'Pong',
            { payload: arg.toString(), meta: { type: 'text', envelope: '' } },
            {
              type: ELogTypes.RECEIVE
            }
          )
          this.#emitLog(log)
        })

        this.#socket.on('upgrade', response => {
          log = this.#log(
            'On Upgrade',
            {
              payload: `// On Upgrade receive headers \n ${JSON.stringify(
                response.headers,
                null,
                4
              )}`,
              meta: { type: 'json', envelope: '' }
            },
            {
              type: ELogTypes.RECEIVE
            }
          )
          this.#emitLog(log)

          // Send log to set cookie
          log = this.#log(
            ELogTypes.UPGRADE,
            {
              payload: response.headers,
              meta: { type: 'json', envelope: '' }
            },
            {
              type: ELogTypes.UPGRADE
            }
          )

          this.#emitLog(log)
        })
      }

      // An event listener to be called when the connection is established.
      this.#socket.onopen = (event: any) => {
        if (event.target.readyState === 1) {
          this.#connected = true

          title = ConnectionStatus[event.target.readyState].description
          log = this.#log(title, '', {
            event: ConnectionStatus[event.target.readyState].state,
            type: ELogTypes.SYSTEM,
            color: ELogColors.SUCCESS
          })
          this.#emitLog(log, ELogEvents.onOpen)
          this.#emitLog(log)

          // Start pinging if ping enable
          if (
            firecampAgent === EFirecampAgent.desktop &&
            clientOptions &&
            clientOptions.ping &&
            clientOptions.pingInterval
          ) {
            this.ping(clientOptions.pingInterval)
          }
        } else {
          this.#connected = false

          title = ConnectionStatus[event.target.readyState].description
          log = this.#log(title, '', {
            event: ConnectionStatus[event.target.readyState].state,
            type: ELogTypes.SYSTEM,
            color: ELogColors.SUCCESS
          })
          this.#emitLog(log)
        }
      }

      this.#socket.onmessage = async (event: any) => {
        const body = await bodyParser.parseReceivedMessage(event.data)

        log = this.#log('Message Received', body, {
          type: ELogTypes.RECEIVE
        })

        if (
          (firecampAgent && Buffer.isBuffer(event?.data))
          || (event?.data instanceof ArrayBuffer && event?.data.byteLength > 0)
          || event?.data instanceof Blob
        )
          log.meta['length'] = Object.values(this.#calculateMessageSize(event?.data?.byteLength)).join(' ')
        else {
          log.meta['length'] = event?.data?.length
        }

        this.#emitLog(log)
      }

      // An event listener to be called when connection is closed.
      this.#socket.onclose = (event: any) => {
        this.#connected = false

        if (event.target.readyState === 3 && event.wasClean) {
          if (!event.reason) {
            title = `${event.code}: ${StatusCodes[event.code] ? StatusCodes[event.code].description : ''
              }`
          } else {
            title = `${event.code}: ${event.reason}`
          }

          log = this.#log(title, '', {
            event: ConnectionStatus[4].state,
            type: ELogTypes.SYSTEM,
            color: ELogColors.DANGER
          })

          if (this.#pinging) this.stopPinging()

          this.#emitLog(log, ELogEvents.onClose)
          this.#emitLog(log)
          this.#unsubscribe()
        } else {
          if (!event.reason) {
            title = `${event.code}: ${StatusCodes[event.code] ? StatusCodes[event.code].description : ''
              }`
          } else {
            title = `${event.code}: ${event.reason}`
          }

          log = this.#log(title, '', {
            event: ConnectionStatus[event.target.readyState].state,
            type: ELogTypes.SYSTEM,
            color: ELogColors.DANGER
          })
          this.#emitLog(log, ELogEvents.onClose)
          this.#emitLog(log)

          if (this.#connection.reconnect.enable) {
            title = ConnectionStatus[6].description
            log = this.#log(title, '', {
              event: ConnectionStatus[6].state,
              type: ELogTypes.SYSTEM,
              color: ELogColors.DANGER
            })
            this.#emitLog(log, ELogEvents.onOpen)
            this.#reconnect()
          }
        }
      }

      // An event listener to be called when an error occurs.
      this.#socket.onerror = (event: any) => {
        this.#connected = false

        title = `${ConnectionStatus[5].state}: ${event.message ||
          ConnectionStatus[5].description}`
        log = this.#log(title, '', {
          event: ConnectionStatus[5].state,
          type: ELogTypes.SYSTEM,
          color: ELogColors.DANGER
        })
        this.#emitLog(log, ELogEvents.onConnecting)
        this.#emitLog(log)
      }

      return this
    } catch (error) {
      this.#connected = false

      const title = `${ConnectionStatus[5].state}: ${error.message ||
        ConnectionStatus[5].description}`
      const log = this.#log(title, '', {
        event: ConnectionStatus[5].state,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })
      this.#emitLog(log)
    }
  }

  onOpen(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(`${this.#connectionId}-${ELogEvents.onOpen}`, (log: ILog) => cb(log))
  }

  onClose(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(`${this.#connectionId}-${ELogEvents.onClose}`, (log: ILog) => cb(log))
  }

  onConnecting(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(`${this.#connectionId}-${ELogEvents.onConnecting}`, (log: ILog) => cb(log))
  }

  logs(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(`${this.#connectionId}-${ELogEvents.common}`, (log: ILog) => cb(log))
  }

  #unsubscribe(): void {
    this.#connected = false

    this.#eventEmitter.all.clear()
  }

  disconnect(code: number, reason?: string): void {
    this.#connected = false

    if (!code) this.#socket.close(1000, StatusCodes[1000].description)
    else this.#socket.close(code, reason)
  }

  connected(): boolean {
    return this.#connected
  }

  readyState(): number {
    return this.#socket?.readyState
  }

  async send(message?: IWebSocketMessage): Promise<void> {
    if (message) {
      const log = this.#log('Message Sent', message, { type: ELogTypes.SEND })

      const body = await bodyParser.parseMessage(message)

      if ([EMessageBodyType.ArrayBuffer, EMessageBodyType.ArrayBufferView, EMessageBodyType.File].includes(message.meta.type))
        log.meta.length = Object.values(this.#calculateMessageSize(body?.byteLength)).join(' ')
      else log.meta['length'] = body?.length

      this.#emitLog(log)

      this.#socket.send(body)
    } else {
      const log = this.#log('Message Sent', '', { type: ELogTypes.SEND })

      this.#emitLog(log)

      this.#socket.send()
    }
  }

  ping(interval: number): void {
    if (!this.#connected) return

    this.#pinging = true

    let log = this.#log('Pinging', [], {
      type: ELogTypes.SYSTEM,
      color: ELogColors.SUCCESS
    })

    this.#emitLog(log)

    if (interval) {
      this.#intervals.PING = setInterval(() => {
        log = this.#log(
          'Ping',
          { meta: { type: 'text', envelope: '' }, payload: 'Pinging' },
          {
            type: ELogTypes.SEND
          }
        )

        this.#emitLog(log)

        this.#socket.ping('Pinging')
      }, interval)
    } else {
      log = this.#log(
        'Ping',
        { meta: { type: 'text', envelope: '' }, payload: 'Pinging' },
        {
          type: ELogTypes.SEND
        }
      )

      this.#emitLog(log)

      this.#socket.ping('Pinging')
    }
  }

  stopPinging(): void {
    const log = this.#log('Pinging Stopped', [], {
      type: ELogTypes.SYSTEM,
      color: ELogColors.DANGER
    })

    this.#emitLog(log)

    this.#pinging = false

    clearInterval(this.#intervals.PING)
  }

  /**
 * Return `response data` value with unit
 * @param size - size of response data returned from the rest service
 * @returns {{unit: string, value: *}}
 */
  #calculateMessageSize(size: number): { value: any, unit: string } {
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

  #log(title: string, message: any, meta: any): ILog {
    if (!meta.timestamp) meta.timestamp = Date.now()

    // In normal EMIT/LISTEN event name will be a title so assign that
    // same title as event in meta as standard usage at frontend if needed
    if (!meta.event) meta.event = title
    if (meta.type) {
      switch (meta.type) {
        case ELogTypes.SEND:
          meta.id = `${ELogTypes.SEND}-${++this.#mitterLogCount}`
          break
        case ELogTypes.RECEIVE:
          meta.id = `${ELogTypes.RECEIVE}-${++this.#listenerLogCount}`
          break
        default:
          meta.id = `${ELogTypes.SYSTEM}-${++this.#systemLogCount}`
          break
      }
    }

    return {
      title, message, meta
    }
  }

  #emitLog(log: ILog, event = ELogEvents.common): void {        
    this.#eventEmitter.emit(`${this.#connectionId}-${event}`, log)
  }

  #reconnect(): void {
    const { attempts, timeout } = this.#connection.reconnect

    let title
    let log

    if (attempts) {
      title = ConnectionStatus[7].description

      log = this.#log(title, '', {
        event: ConnectionStatus[7].state,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })

      this.#emitLog(log, ELogEvents.onConnecting)

      setTimeout(() => {
        this.connect()
        this.#connection.reconnect.attempts--
      }, timeout)
    } else {
      title = ConnectionStatus[9].description

      log = this.#log(title, '', {
        event: ConnectionStatus[9].state,
        type: ELogTypes.SYSTEM,
        color: ELogColors.DANGER
      })

      this.#emitLog(log)
    }
  }
}

export * from './executor.interface'

export * from './types'