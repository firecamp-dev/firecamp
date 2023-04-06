import mitt from 'mitt';
import {
  EFirecampAgent,
  EMessageBodyType,
  IWebSocketMessage,
} from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import { ConnectionStatus, StatusCodes } from './constants';
import * as bodyParser from './body-parser';
import { ILog, ELogEvents, ELogTypes, ELogColors } from './types';
import { TExecutorOptions, IExecutor } from './executor.interface';
import ConfigGenerator from './config-generator';

const { Danger, Success } = ELogColors;
const { Receive, Send, System, Upgrade } = ELogTypes;

// Fetch the app agent
const firecampAgent: EFirecampAgent = _misc.firecampAgent();

export default class Executor implements IExecutor {
  #WebSocket: any;
  #socket: any;
  #intervals: any;
  #sentLogCount: number;
  #receivedLogCount: number;
  #systemLogCount: number;
  #connectionId: string;
  #connection: any;
  #eventEmitter: any;
  #pinging: boolean;
  #connected: boolean;

  constructor(options: TExecutorOptions) {
    this.#WebSocket = options.WebSocket;
    this.#socket = null;
    this.#intervals = {};
    this.#sentLogCount = 0;
    this.#receivedLogCount = 0;
    this.#systemLogCount = 0;
    this.#connectionId = options.connection.id;
    this.#eventEmitter = mitt();
    this.#pinging = false;
    this.#connected = false;

    const { address, protocols, clientOptions } = new ConfigGenerator(
      options
    ).prepare();

    this.#connection = {
      address,
      protocols,
      clientOptions,
      reconnect: {
        enable: options?.config?.reconnect || false,
        timeout: options?.config?.reconnect || 3000,
        attempts: options?.config?.reconnectAttempts || 3,
      },
    };
  }

  connect(): any {
    const { address, protocols, clientOptions } = this.#connection;

    try {
      this.#socket = new this.#WebSocket(address, protocols, clientOptions);
      const title: string = ConnectionStatus[0].description;
      const log: ILog = this.#log.success(
        ConnectionStatus[0].state,
        title,
        System
      );
      this.#emitLog(log, ELogEvents.onConnecting);

      if (firecampAgent === EFirecampAgent.Desktop) {
        this.#socket.on('pong', async (arg) => {
          const log = this.#log.success('Pong', '', Receive, {
            value: arg.toString(),
            __meta: { type: 'text', typedArrayView: '' },
          });
          this.#emitLog(log);
        });

        this.#socket.on('upgrade', (response) => {
          const value = `// On Upgrade receive headers \n ${JSON.stringify(
            response.headers,
            null,
            4
          )}`;
          const log = this.#log.success('On Upgrade', value, Receive, {
            value,
            __meta: { type: 'json' },
          });
          this.#emitLog(log);

          // Send log to set cookie
          const logH = this.#log.success(Upgrade, '', Upgrade, {
            value: response.headers,
            __meta: { type: 'json' },
          });
          this.#emitLog(logH);
        });
      }

      // An event listener to be called when the connection is established.
      this.#socket.onopen = (event: any) => {
        if (event.target.readyState === 1) {
          this.#connected = true;

          const title = ConnectionStatus[event.target.readyState].description;
          const log = this.#log.success(
            ConnectionStatus[event.target.readyState].state,
            title,
            System
          );
          this.#emitLog(log, ELogEvents.onOpen);
          this.#emitLog(log);

          // Start pinging if ping enable
          if (
            firecampAgent == EFirecampAgent.Desktop &&
            clientOptions &&
            clientOptions.ping &&
            clientOptions.pingInterval
          ) {
            this.ping(clientOptions.pingInterval);
          }
        } else {
          this.#connected = false;
          const title = ConnectionStatus[event.target.readyState].description;
          const log = this.#log.success(
            ConnectionStatus[event.target.readyState].state,
            title,
            System
          );
          this.#emitLog(log);
        }
      };

      this.#socket.onmessage = async (event: any) => {
        const message = await bodyParser.parseReceivedMessage(event.data);
        const log = this.#log.success('', 'Message Received', Receive, message);
        if (
          (firecampAgent && Buffer.isBuffer(event?.data)) ||
          (event?.data instanceof ArrayBuffer && event?.data.byteLength > 0) ||
          event?.data instanceof Blob
        )
          log.__meta['length'] = Object.values(
            this.#calculateMessageSize(event?.data?.byteLength)
          ).join(' ');
        else {
          log.__meta['length'] = event?.data?.length;
        }
        this.#emitLog(log);
      };

      // An event listener to be called when connection is closed.
      this.#socket.onclose = (event: any) => {
        this.#connected = false;

        let title: string;
        if (event.target.readyState === 3 && event.wasClean) {
          if (!event.reason) {
            title = `${event.code}: ${
              StatusCodes[event.code] ? StatusCodes[event.code].description : ''
            }`;
          } else {
            title = `${event.code}: ${event.reason}`;
          }
          const log = this.#log.danger(
            ConnectionStatus[4].state,
            title,
            System
          );
          if (this.#pinging) this.stopPinging();
          this.#emitLog(log, ELogEvents.onClose);
          this.#emitLog(log);
          this.#unsubscribe();
        } else {
          if (!event.reason) {
            title = `${event.code}: ${
              StatusCodes[event.code] ? StatusCodes[event.code].description : ''
            }`;
          } else {
            title = `${event.code}: ${event.reason}`;
          }
          const log = this.#log.danger(
            ConnectionStatus[event.target.readyState].state,
            title,
            System
          );
          this.#emitLog(log, ELogEvents.onClose);
          this.#emitLog(log);

          if (this.#connection.reconnect.enable) {
            const title = ConnectionStatus[6].description;
            const log = this.#log.danger(
              ConnectionStatus[6].state,
              title,
              System
            );
            this.#emitLog(log, ELogEvents.onOpen);
            this.#reconnect();
          }
        }
      };

      // An event listener to be called when an error occurs.
      this.#socket.onerror = (event: any) => {
        this.#connected = false;
        const title = `${ConnectionStatus[5].state}: ${
          event.message || ConnectionStatus[5].description
        }`;
        const log = this.#log.danger(ConnectionStatus[5].state, title, System);
        this.#emitLog(log, ELogEvents.onConnecting);
        this.#emitLog(log);
      };
      return this;
    } catch (e) {
      this.#connected = false;
      const title = `${ConnectionStatus[5].state}: ${
        e.message || ConnectionStatus[5].description
      }`;
      const log = this.#log.danger(ConnectionStatus[5].state, title, System);
      this.#emitLog(log);
    }
  }

  onOpen(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onOpen}`,
      (log: ILog) => cb(log)
    );
  }

  onClose(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onClose}`,
      (log: ILog) => cb(log)
    );
  }

  onConnecting(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onConnecting}`,
      (log: ILog) => cb(log)
    );
  }

  logs(cb: (log: ILog) => void): void {
    this.#eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.common}`,
      (log: ILog) => cb(log)
    );
  }

  #unsubscribe(): void {
    this.#connected = false;
    this.#eventEmitter.all.clear();
  }

  disconnect(code: number, reason?: string): void {
    this.#connected = false;
    if (!code) this.#socket.close(1000, StatusCodes[1000].description);
    else this.#socket.close(code, reason);
  }

  connected(): boolean {
    return this.#connected;
  }

  readyState(): number {
    return this.#socket?.readyState;
  }

  async send(message: Partial<IWebSocketMessage>): Promise<void> {
    if (message?.__meta) {
      const log = this.#log.success('', 'Message Sent', Send, message);
      const msg = await bodyParser.parseMessage(message);
      if (
        [
          EMessageBodyType.ArrayBuffer,
          EMessageBodyType.ArrayBufferView,
          EMessageBodyType.File,
        ].includes(message.__meta.type)
      )
        log.__meta.length = Object.values(
          this.#calculateMessageSize(msg?.byteLength)
        ).join(' ');
      else log.__meta['length'] = msg?.length;
      this.#emitLog(log);
      this.#socket.send(msg);
    } else {
      const log = this.#log.success('', 'Message Sent', Send);
      this.#emitLog(log);
      this.#socket.send();
    }
  }

  ping(interval: number): void {
    if (!this.#connected) return;
    this.#pinging = true;
    const log = this.#log.success('Pinging', '', Success);
    this.#emitLog(log);
    if (interval) {
      this.#intervals.PING = setInterval(() => {
        const log = this.#log.success('', 'Ping', Send, '');
        this.#emitLog(log);
        this.#socket.ping('Pinging');
      }, interval);
    } else {
      const log = this.#log.success('', 'Ping', Send);
      this.#emitLog(log);
      this.#socket.ping('Pinging');
    }
  }

  stopPinging(): void {
    const log = this.#log.danger('', 'Pinging Stopped', System);
    this.#emitLog(log);
    this.#pinging = false;
    clearInterval(this.#intervals.PING);
  }

  /**
   * Return `response data` value with unit
   * @param size - size of response data returned from the rest service
   * @returns {{unit: string, value: *}}
   */
  #calculateMessageSize(size: number): { value: any; unit: string } {
    let finalSize: { value: any; unit: string };
    if (typeof size === 'number') {
      if (size < 1024) {
        finalSize = {
          value: size,
          unit: 'B',
        };
      } else if (size < 1048576) {
        finalSize = {
          value: size / 1024,
          unit: 'Kb',
        };
      } else if (size < 1073741824) {
        finalSize = {
          value: size / 1e6,
          unit: 'Mb',
        };
      } else {
        finalSize = {
          value: size / 1e9,
          unit: 'Gb',
        };
      }
      if (finalSize.value) {
        finalSize.value = finalSize.value.toFixed(2);
        if (
          typeof finalSize.value === 'string' &&
          finalSize.value.includes('.00')
        ) {
          finalSize.value = finalSize.value.substring(
            0,
            finalSize.value.length - 3
          );
        }
      }
    } else {
      size = Number(size);
      if (isNaN(size)) {
        finalSize = { value: size, unit: '-' };
      } else {
        finalSize = { value: size, unit: 'B' };
      }
    }
    return finalSize;
  }

  #log = {
    prepare: (title: string, message: any, __meta: any): ILog => {
      if (!__meta.timestamp) __meta.timestamp = Date.now();
      /** the event name in ws will be the same as 'title' to match the standard with socket.io event */
      if (!__meta.event) __meta.event = title;
      const __ref = { id: '' };
      if (__meta.type) {
        switch (__meta.type) {
          case Send:
            __ref.id = `${ELogTypes.Send}-${++this.#sentLogCount}`;
            break;
          case Receive:
            __ref.id = `${ELogTypes.Receive}-${++this.#receivedLogCount}`;
            break;
          default:
            __ref.id = `${ELogTypes.System}-${++this.#systemLogCount}`;
            break;
        }
      }
      return {
        title,
        message,
        __meta,
        __ref,
      };
    },
    success: (
      event: string,
      title: string,
      type: any,
      message: any = null
    ): ILog => {
      return this.#log.prepare(title, message, {
        event,
        type,
        color: Success,
      });
    },
    danger: (
      event: string,
      title: string,
      type: any,
      message: any = null
    ): ILog => {
      return this.#log.prepare(title, message, {
        event,
        type,
        color: Danger,
      });
    },
  };

  #emitLog(log: ILog, event = ELogEvents.common): void {
    this.#eventEmitter.emit(`${this.#connectionId}-${event}`, log);
  }

  #reconnect(): void {
    const { attempts, timeout } = this.#connection.reconnect;
    if (attempts) {
      const title = ConnectionStatus[7].description;
      const log = this.#log.danger(ConnectionStatus[7].state, title, System);
      this.#emitLog(log, ELogEvents.onConnecting);
      setTimeout(() => {
        this.connect();
        this.#connection.reconnect.attempts--;
      }, timeout);
    } else {
      const title = ConnectionStatus[9].description;
      const log = this.#log.danger(ConnectionStatus[9].state, title, System);
      this.#emitLog(log);
    }
  }
}