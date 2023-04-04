import mitt from 'mitt';
import {
  ESocketIOClientVersion,
  EFirecampAgent,
  ISocketIOEmitter,
  EArgumentBodyType,
} from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import * as bodyParser from './body-parser';
import {
  ILog,
  ELogTypes,
  ELogColors,
  ELogEvents,
  CustomLogTypes,
  EConnectionStatus,
} from './types';
import { IExecutorInterface, TExecutorOptions } from './executor.interface';
import ConfigGenerator from './config-generator';

// TODO: Update logic to emit the event with and without args
// TODO: Review logic to handle listener with and without args

// Fetch firecamp agent
const firecampAgent = _misc.firecampAgent();

const {
  Connecting,
  Connect,
  ConnectError,
  ConnectTimeout,
  SocketError,
  Disconnect,
  Reconnect,
  ReconnectAttempt,
  Reconnecting,
  ReconnectError,
  ReconnectFailed,
} = EConnectionStatus;

export default class Executor implements IExecutorInterface {
  #io: any;
  socket: any;
  #intervals: any;
  #sentLogCount: number;
  #receivedLogCount: number;
  #systemLogCount: number;
  #connectionId: string;
  #connection: any;
  eventEmitter: any;
  #pinging: boolean;

  /**
   * Maintain the active listeners list
   * To prevent duplicate adding on socket reconnect
   */
  #activeListeners = new Map();

  constructor(options: TExecutorOptions) {
    this.#io = options.io;
    this.socket = null;
    this.#intervals = {};
    this.#sentLogCount = 0;
    this.#receivedLogCount = 0;
    this.#systemLogCount = 0;
    this.#connectionId = options.connection.id;
    this.eventEmitter = mitt();

    const { address, clientOptions } = new ConfigGenerator(options).prepare();
    this.#connection = {
      address,
      clientOptions,
    };
    this.#pinging = false;
  }

  log(title: string, message: any, __meta: any): ILog {
    if (!__meta.timestamp) __meta.timestamp = Date.now();

    // In normal EMIT/LISTEN event name will be a title so assign that
    // same title as event in meta as standard usage at frontend if needed
    if (!__meta.event) __meta.event = title;
    const __ref = { id: '' };
    if (__meta.type) {
      switch (__meta.type) {
        case ELogTypes.Send:
          const sCount = ++this.#sentLogCount;
          __ref.id = `${ELogTypes.Send}-${sCount}`;
          title = `Emit on: ${title}, ID: ${sCount}`;
          break;
        case ELogTypes.Receive:
          const rCount = ++this.#receivedLogCount;
          __ref.id = `${ELogTypes.Receive}-${rCount}`;
          title = `Listen on: ${title}, ID: ${rCount}`;
          break;
        case ELogTypes.Ack:
          const aCount = __meta.id;
          __ref.id = `${ELogTypes.Ack}-${aCount}`;
          title = `Ack on: ${title}, ID: ${aCount}`;
          break;
        default:
          const sysCount = ++this.#systemLogCount;
          __ref.id = `${ELogTypes.System}-${sysCount}`;
          break;
      }
    }
    return {
      title,
      message,
      __meta,
      __ref,
    };
  }

  addListener(eventName: string): void {
    // Check if listener already exist
    if (!this.#activeListeners.has(eventName)) {
      this.#activeListeners.set(eventName, '');
    } else return;

    // TODO: Parse eventName via env. variable
    let title = `Listening on event: ${event}`;
    let meta = {
      type: ELogTypes.System,
      color: ELogColors.Success,
      event: CustomLogTypes.ListenOn,
    };

    let log = this.log(title, '', meta);

    this.emitLog(log);

    // @deprecated in socket.io-client@3.0.0
    // Fired when a pong is received from the server.
    if (eventName === 'PONG') {
      this.socket.on(eventName, () => {
        log = this.log(
          eventName,
          [
            {
              value: 'Pinging',
              __meta: {
                type: 'text',
                typedArrayView: '',
              },
            },
          ],
          {
            type: ELogTypes.Receive,
          }
        );

        this.emitLog(log);
      });
    } else {
      this.socket.on(eventName, async (...args: Array<any>) => {
        log = this.log(eventName, [], {
          type: ELogTypes.Receive,
        });

        const body = await bodyParser.parseListenerData(args);

        if (body?.length === 0)
          body.push({
            payload: '',
          });

        log.message = body;

        // Calculate the length of the argument and add into the log
        args.forEach((arg, index) => {
          console.log({
            arg,
            type: typeof arg,
            byteLength: arg?.byteLength,
            length: arg.length,
          });
          if (
            [
              EArgumentBodyType.ArrayBuffer,
              EArgumentBodyType.ArrayBufferView,
              EArgumentBodyType.File,
            ].includes(body[index].meta.type)
          )
            log.message[index].meta.length = Object.values(
              this.calculateMessageSize(arg?.byteLength)
            ).join(' ');
          else log.message[index].meta.length = arg?.length;
        });

        this.emitLog(log);
      });
    }
  }

  /**
   * Return `response data` value with unit
   * @param size - size of response data returned from the rest service
   * @returns {{unit: string, value: *}}
   */
  calculateMessageSize(size: number): { value: any; unit: string } {
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

  addListeners(eventNames: Array<string>): void {
    eventNames.map((event) => {
      this.addListener(event);
    });
  }

  removeListener(eventName: string): void {
    const title = `Listen off: ${eventName}`;
    const log = this.log(title, '', {
      type: ELogTypes.System,
      color: ELogColors.Danger,
      event: CustomLogTypes.ListenOff,
    });
    this.emitLog(log);
    this.socket.off(eventName);

    // Remove listener event from the active listeners list
    this.#activeListeners.delete(eventName);
  }

  removeListeners(eventNames: Array<string> = []): void {
    if (Array.isArray(eventNames)) {
      for (let i = 0; i < eventNames.length; i += 1) {
        this.removeListener(eventNames[i]);
      }
    }
  }

  removeAllListeners(): void {
    // send logs of removed listeners
    for (const element of this.#activeListeners) {
      const title = `Listen off: ${element[0]}`;
      const log = this.log(title, '', {
        type: ELogTypes.System,
        color: ELogColors.Danger,
        event: CustomLogTypes.ListenOff,
      });
      this.emitLog(log);
    }

    // Remove all event listeners from socket instance
    this.socket.removeAllListeners();

    // Remove list of active listeners of a specific connection
    this.#activeListeners.clear();
  }

  emitLog(log: ILog, event = ELogEvents.common): void {
    this.eventEmitter.emit(`${this.#connectionId}-${event}`, log);
  }

  onOpen(cb: (log: ILog) => void): void {
    this.eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onOpen}`,
      (log: ILog) => cb(log)
    );
  }

  onClose(cb: (log: ILog) => void): void {
    this.eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onClose}`,
      (log: ILog) => cb(log)
    );
  }

  onConnecting(cb: (log: ILog) => void): void {
    this.eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.onConnecting}`,
      (log: ILog) => cb(log)
    );
  }

  logs(cb: (log: ILog) => void): void {
    this.eventEmitter.on(
      `${this.#connectionId}-${ELogEvents.common}`,
      (log: ILog) => cb(log)
    );
  }

  async prepareEmitPayload(
    eventName: string,
    args: ISocketIOEmitter['value']
  ): Promise<any> {
    let log: any;

    if (args?.length > 0)
      log = this.log(eventName, args, {
        type: ELogTypes.Send,
      });
    else
      log = this.log(
        eventName,
        [
          {
            payload: '',
          },
        ],
        {
          type: ELogTypes.Send,
        }
      );

    //@ts-ignore //TODO: check type here
    const body = await bodyParser.parseEmitterArguments(args);

    args.forEach((arg, index) => {
      if (
        [
          EArgumentBodyType.ArrayBuffer,
          EArgumentBodyType.ArrayBufferView,
          EArgumentBodyType.File,
        ].includes(arg.__meta.type)
      )
        log.message[index].meta.length = Object.values(
          //@ts-ignore
          this.calculateMessageSize(body[index]?.byteLength)
        ).join(' ');
      else log.message[index].meta.length = body[index]?.body.toString().length;
    });

    this.emitLog(log);

    return { event: eventName, body, logId: log.meta.id };
  }

  async emit(
    eventName: string,
    args: ISocketIOEmitter['value']
  ): Promise<void> {
    try {
      const { event, body } = await this.prepareEmitPayload(eventName, args);

      if (event === 'message') {
        // Send args with socket.send if event = message
        // @reference: https://socket.io/docs/client-api/#socket-send-%E2%80%A6args-ack
        if (body?.length > 0) this.socket.send(...body);
        else this.socket.send();
      } else {
        if (body?.length > 0) this.socket.emit(event, ...body);
        else this.socket.emit(event);
      }
      return Promise.resolve();
    } catch (error) {
      const title =
        typeof error === 'string' ? error : error.message || SocketError;
      const log = this.log(title, '', {
        event: SocketError,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      });
      this.emitLog(log);
    }
  }

  async emitWithAck(
    eventName: string,
    args: ISocketIOEmitter['value']
  ): Promise<void> {
    try {
      const { event, body, logId } = await this.prepareEmitPayload(
        eventName,
        args
      );

      // Send args with socket.send if event = message
      // Reference: https://socket.io/docs/client-api/#socket-send-%E2%80%A6args-ack
      if (event === 'message') {
        if (body?.length > 0) {
          this.socket.send(...body, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs);

            if (ackBody?.length === 0)
              ackBody.push({
                payload: '',
              });

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.Ack,
              id: logId,
            });

            this.emitLog(ackLog);
          });
        } else {
          this.socket.send(async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs);
            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.Ack,
              id: logId,
            });

            if (ackBody?.length === 0)
              ackBody.push({
                payload: '',
              });

            this.emitLog(ackLog);
          });
        }
      } else {
        if (body?.length > 0) {
          this.socket.emit(event, ...body, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs);

            if (ackBody?.length === 0)
              ackBody.push({
                payload: '',
              });

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.Ack,
              id: logId,
            });

            this.emitLog(ackLog);
          });
        } else {
          this.socket.emit(event, async (...ackArgs: Array<any>) => {
            const ackBody = await bodyParser.parseListenerData(ackArgs);

            if (ackBody?.length === 0)
              ackBody.push({
                payload: '',
              });

            const ackLog = this.log(event, ackBody, {
              type: ELogTypes.Ack,
              id: logId,
            });

            this.emitLog(ackLog);
          });
        }
      }
    } catch (error) {
      const title =
        typeof error === 'string' ? error : error.message || SocketError;
      const log = this.log(title, '', {
        event: SocketError,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      });
      this.emitLog(log);
    }
  }

  ping(interval: number): void {
    this.#pinging = true;

    let log = this.log('Pinging', [], {
      type: ELogTypes.System,
      color: ELogColors.Success,
    });

    this.emitLog(log);

    // Start pining if connection is open
    if (this.socket && !this.socket.connected) {
      log = this.log("Can't Ping, Connection is not open yet", [], {
        type: ELogTypes.System,
        color: ELogColors.Danger,
      });
      this.emitLog(log);
      return;
    }

    if (interval) {
      this.#intervals.PING = setInterval(() => {
        log = this.log(
          'PING',
          [
            {
              value: 'Pinging',
              __meta: {
                type: 'text',
                typedArrayView: '',
              },
            },
          ],
          {
            type: ELogTypes.Send,
          }
        );

        this.emitLog(log);

        if (this.#connection.config.version === 'v2') this.socket.emit('PING');

        if (this.#connection.config.version !== 'v2')
          this.socket.emit('PING', () => {
            log = this.log(
              'PONG',
              [
                {
                  payload: 'Pinging',
                  meta: {
                    type: 'text',
                    typedArrayView: '',
                  },
                },
              ],
              {
                type: ELogTypes.Receive,
              }
            );
            this.emitLog(log);
          });
      }, interval);
    }
  }

  stopPinging(): void {
    const log = this.log('Pinging Stopped', [], {
      type: ELogTypes.System,
      color: ELogColors.Danger,
    });
    this.emitLog(log);
    this.#pinging = false;
    clearInterval(this.#intervals.PING);
  }

  connect(): any {
    try {
      const { address, clientOptions } = this.#connection;
      switch (clientOptions.version) {
        // Create instance of socket.io-client@2.4.0
        case ESocketIOClientVersion.v2:
          this.socket = this.#io.v2(address, clientOptions);

          break;
        // Create instance of socket.io-client@3.1.0
        case ESocketIOClientVersion.v3:
          this.socket = this.#io.v3(address, clientOptions);

          break;
        // Create instance of socket.io-client@4.1.3
        case ESocketIOClientVersion.v4:
          this.socket = this.#io.v4(address, clientOptions);

          break;

        default:
        // Create instance of socket.io-client@2.4.0
        case ESocketIOClientVersion.v2:
          this.socket = this.#io.v2(address, clientOptions);

          break;
      }

      const title = 'Socket has been created. The connection is not yet open.';
      const log = this.log(title, '', {
        event: Connecting,
        type: ELogTypes.System,
        color: ELogColors.Success,
      });

      // this.emitLog(log, ELogEvents.onConnecting)
      this.emitLog(log);

      // Fired upon connection to the Namespace (including a successful reconnection).
      this.socket.on(Connect, () => {
        const title = 'Socket connected successfully';
        const log = this.log(title, '', {
          event: Connect,
          type: ELogTypes.System,
          color: ELogColors.Success,
        });

        this.emitLog(log, ELogEvents.onOpen);
        this.emitLog(log);

        // Start pinging if ping enable
        if (
          firecampAgent == EFirecampAgent.Desktop &&
          clientOptions &&
          clientOptions.ping &&
          clientOptions.pingInterval
        ) {
          this.ping(clientOptions.pingInterval);
        }
      });

      // Fired when an namespace middleware error occurs.
      this.socket.on(ConnectError, (error: Error) => {
        const title = error instanceof Error ? error.message : error;
        const log = this.log(title, '', {
          event: ConnectError,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });
        this.emitLog(log);
      });

      // @deprecated in socket.io-client@2.4.0
      // Fired upon a connection timeout.
      this.socket.io.on(ConnectTimeout, (timeout: number) => {
        const title = `Connection timeout(${timeout})`;
        const log = this.log(title, '', {
          event: ConnectTimeout,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });
        this.emitLog(log);
      });

      // Previously listen using the socket instance directly
      // Fired upon a connection error.
      this.socket.io.on(SocketError, (error: Error) => {
        const title = error instanceof Error ? error.message : error;
        const log = this.log(title, '', {
          event: SocketError,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });
        this.emitLog(log);
      });

      // Fired upon disconnection.
      this.socket.on(Disconnect, (reason: string) => {
        const title = reason;
        const log = this.log(title, '', {
          event: Disconnect,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });

        if (this.#pinging) this.stopPinging();

        this.emitLog(log, ELogEvents.onClose);
        this.emitLog(log);

        if (!clientOptions.reconnection) this.unsubscribe();
      });

      // Previously listen using the socket instance directly
      // Fired upon a successful reconnection.
      this.socket.io.on(Reconnect, (attemptNumber: number) => {
        const title = `Attempt number(${attemptNumber})`;
        const log = this.log(title, '', {
          event: Reconnect,
          type: ELogTypes.System,
          color: ELogColors.Warning,
        });
        this.emitLog(log, ELogEvents.onConnecting);
        this.emitLog(log);
      });

      // Previously listen using the socket instance directly
      // Fired upon an attempt to reconnect.
      this.socket.io.on(ReconnectAttempt, (attemptNumber) => {
        const title = `Attempt number(${attemptNumber})`;
        const log = this.log(title, '', {
          event: ReconnectAttempt,
          type: ELogTypes.System,
          color: ELogColors.Warning,
        });
        this.emitLog(log);
      });

      // @deprecated in socket.io-client@3.0.0
      // Fired upon an attempt to reconnect.
      this.socket.io.on(Reconnecting, (attemptNumber) => {
        const title = `Attempt number(${attemptNumber})`;
        const log = this.log(title, '', {
          event: Reconnecting,
          type: ELogTypes.System,
          color: ELogColors.Warning,
        });
        this.emitLog(log, ELogEvents.onConnecting);
        this.emitLog(log);
      });

      // Previously listen using the socket instance directly
      // Fired upon a reconnection attempt error.
      this.socket.io.on(ReconnectError, (error) => {
        const title = error instanceof Error ? error.message : error;
        const log = this.log(title, '', {
          event: ReconnectError,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });
        this.emitLog(log);
      });

      // Previously listen using the socket instance directly
      // Fired when couldn’t reconnect within reconnectionAttempts.
      this.socket.io.on(ReconnectFailed, () => {
        const title =
          "The client couldn't reconnect within reconnection attempts";
        const log = this.log(title, '', {
          event: ReconnectFailed,
          type: ELogTypes.System,
          color: ELogColors.Danger,
        });
        this.emitLog(log);
        this.unsubscribe();
      });

      return this;
    } catch (error) {
      const title =
        error instanceof Error ? error.message : error || SocketError;
      const log = this.log(title, '', {
        event: SocketError,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      });
      this.emitLog(log);
      this.unsubscribe();
    }
  }

  close(): void {
    // disconnect the socket client
    if (this.socket.connected) this.socket.disconnect();

    // send the log
    const title = `${Disconnect}`;
    const log = this.log(title, '', {
      event: Disconnect,
      type: ELogTypes.System,
      color: ELogColors.Danger,
    });

    this.emitLog(log);
    this.unsubscribe();
  }

  unsubscribe(): void {
    this.eventEmitter.all.clear();
  }

  socketID(): string {
    return this.socket.id;
  }

  connected(): boolean {
    return this.socket.connected;
  }
}
