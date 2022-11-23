import { ManagerOptions, SocketOptions } from 'socket.io-client-v4';
import _url from '@firecamp/url';
import {
  ESocketIOClientVersion,
  ICertificate,
  ISocketIOConfig,
  ISocketIOConnection,
} from '@firecamp/types';
import { _string, _table } from '@firecamp/utils';
import SSLManager from './certificate-manager';
import { TExecutorOptions } from './executor.interface';
import transformExtraOptions from './extra-options';

export default class ConfigGenerator {
  address: string;
  config: ISocketIOConfig;
  clientOptions: Partial<ManagerOptions & SocketOptions> & {
    ping: boolean;
    pingInterval: number;
    version: ESocketIOClientVersion;
  };
  connection: ISocketIOConnection;
  certificates: ICertificate[] = [];

  constructor(options: TExecutorOptions) {
    this.address = options.url.raw;
    this.config = transformExtraOptions(options.config as ISocketIOConfig);
    this.connection = options.connection;
    this.clientOptions = {
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
    this.certificates = options.certificates;
  }

  checkBooleanValues() {
    const keys = ['rejectUnauthorized', 'reconnection'];

    keys.map((key) => {
      if (
        this.config.hasOwnProperty(key) &&
        typeof this.config[key] === 'boolean'
      ) {
        this.clientOptions[key] = this.config[key];
      }
    });
  }

  checkNumberValues() {
    const keys = [
      'timeout',
      'reconnectionAttempts',
      'reconnectionDelay',
      'reconnectionDelayMax',
    ];

    keys.map((key) => {
      if (this.config[key] && !isNaN(this.config[key])) {
        this.clientOptions[key] = this.config[key];
      }
    });
  }

  setClientConfig() {
    this.checkBooleanValues();
    this.checkNumberValues();
  }

  setHeaders() {
    const headers = _table.toObject(this.connection.headers);

    Object.assign(
      this.clientOptions.transportOptions['polling'].extraHeaders,
      headers
    );
  }

  setQueryParams() {
    this.clientOptions.query = _table.toObject(this.connection.queryParams);
  }

  // Set auth if socket.io-client lib. version >= 3.0.0
  setAuth() {
    if (
      [ESocketIOClientVersion.v3, ESocketIOClientVersion.v4].includes(
        this.config.version
      )
    )
      this.clientOptions.auth = _table.toObject(this.connection.auth);
  }

  setTransports() {
    if (this.connection?.transports?.polling) {
      this.clientOptions.transports.push('polling');
    }
    if (this.connection?.transports?.websocket) {
      this.clientOptions.transports.push('websocket');
    }
  }

  setConnectionConfig() {
    if (
      this.connection.namespace &&
      !_string.isEmpty(this.connection.namespace)
    ) {
      this.connection.namespace = this.connection.namespace;
    } else this.connection.namespace = '';

    if (
      this.connection.forceNew &&
      typeof this.connection.forceNew === 'boolean'
    ) {
      this.clientOptions.forceNew = this.connection.forceNew;
    }

    if (this.connection.path && !_string.isEmpty(this.connection.path))
      this.clientOptions.path = this.connection.path;

    if (this.config.version && !_string.isEmpty(this.config.version))
      this.clientOptions.version = this.config.version;
  }

  setCACertificate(url) {
    if (
      this.certificates &&
      Array.isArray(this.certificates) &&
      this.certificates.length > 0
    ) {
      const certificate = SSLManager(this.certificates, url);

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

  setPingInfo() {
    this.clientOptions.ping = this.connection.ping || false;
    this.clientOptions.pingInterval = this.connection.pingInterval || 3000;
  }

  prepare() {
    this.setClientConfig();
    this.setHeaders();
    this.setQueryParams();
    this.setAuth();
    this.setTransports();
    this.setConnectionConfig();
    this.setPingInfo();

    const parsedURL =
      _url.parse(this.address, ['http', 'ws']) + this.connection.namespace;

    this.setCACertificate(parsedURL);

    return {
      address: parsedURL,
      clientOptions: this.clientOptions,
    };
  }
}
