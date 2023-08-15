import { ManagerOptions, SocketOptions } from 'socket.io-client-v4';
import _url from '@firecamp/url';
import {
  ESocketIOClientVersion,
  ICertificate,
  ISocketIOConfig,
  ISocketIOConnection,
  TPlainObject,
} from '@firecamp/types';
import { _string, _table } from '@firecamp/utils';
import SSLManager from './certificate-manager';
import { TExecutorOptions } from './executor.interface';

export default class ConfigGenerator {
  private parsedUrl: string = '';
  private clientOptions: Partial<ManagerOptions & SocketOptions> & {
    ping: boolean;
    pingInterval: number;
    version: ESocketIOClientVersion;
  } = {
    forceNew: false,
    path: '',
    transports: [],
    transportOptions: {
      polling: {
        extraHeaders: {},
      },
    },
    query: {},
    reconnection: false,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    rejectUnauthorized: false,
    timeout: 20000,
    ping: false,
    pingInterval: 3000,
    // option which indicate the version of the socket.io-client
    // library going to use at the time of connection
    version: ESocketIOClientVersion.v4,
  };

  constructor({
    url,
    config,
    connection,
    certificates = [],
  }: TExecutorOptions) {
    this.checkBooleanValues(config);
    this.checkNumberValues(config);
    this.setHeaders(connection);
    this.setQueryParams(connection);
    this.setAuth(config, connection);
    this.setTransports(connection);
    this.setConnectionConfig(config, connection);
    this.setPingInfo(connection);

    this.parsedUrl =
      _url.normalize(url.raw, ['http', 'ws']) + connection.namespace;
    this.setCACertificate(certificates || [], this.parsedUrl);
  }

  private checkBooleanValues(config: ISocketIOConfig) {
    const keys = ['rejectUnauthorized', 'reconnection'];
    keys.map((key) => {
      if (config.hasOwnProperty(key) && typeof config[key] === 'boolean') {
        this.clientOptions[key] = config[key];
      }
    });
  }

  private checkNumberValues(config: ISocketIOConfig) {
    const keys = [
      'timeout',
      'reconnectionAttempts',
      'reconnectionDelay',
      'reconnectionDelayMax',
    ];

    keys.map((key) => {
      if (config[key] && !isNaN(config[key])) {
        this.clientOptions[key] = config[key];
      }
    });
  }

  private setHeaders(connection: ISocketIOConnection) {
    const headers = _table.toObject(connection.headers || []) as TPlainObject;
    Object.assign(
      this.clientOptions.transportOptions?.['polling'].extraHeaders,
      headers
    );
  }

  private setQueryParams(connection: ISocketIOConnection) {
    this.clientOptions.query = _table.toObject(connection.queryParams || []);
  }

  // Set auth if socket.io-client lib. version >= 3.0.0
  private setAuth(config: ISocketIOConfig, connection) {
    if (
      [ESocketIOClientVersion.v3, ESocketIOClientVersion.v4].includes(
        config.version || ESocketIOClientVersion.v4
      )
    )
      this.clientOptions.auth = _table.toObject(connection.auth || []);
  }

  private setTransports(connection: ISocketIOConnection) {
    if (connection?.transports?.polling) {
      this.clientOptions.transports?.push('polling');
    }
    if (connection?.transports?.websocket) {
      this.clientOptions.transports?.push('websocket');
    }
  }

  private setConnectionConfig(config: ISocketIOConfig, connection) {
    if (!_string.isEmpty(connection.namespace)) {
      connection.namespace = connection.namespace;
    } else connection.namespace = '';

    if (typeof connection.forceNew === 'boolean') {
      this.clientOptions.forceNew = connection.forceNew;
    }

    if (!_string.isEmpty(connection.path || ''))
      this.clientOptions.path = connection.path;

    if (!_string.isEmpty(config.version || ''))
      this.clientOptions.version = config.version || ESocketIOClientVersion.v4;
  }

  private setCACertificate(certificates: ICertificate[], url: string) {
    if (certificates?.length) {
      const certificate = SSLManager(certificates, url);
      if (certificate) {
        try {
          // @ts-ignore
          this.clientOptions.ca = window.fc.file.read(certificate);
        } catch (e) {
          console.error('Error while reading file: ', e);
        }
      }
    }
  }

  private setPingInfo({ ping, pingInterval }: ISocketIOConnection) {
    this.clientOptions.ping = ping || false;
    this.clientOptions.pingInterval = pingInterval || 3000;
  }

  public prepare() {
    return {
      address: this.parsedUrl,
      clientOptions: this.clientOptions,
    };
  }
}
