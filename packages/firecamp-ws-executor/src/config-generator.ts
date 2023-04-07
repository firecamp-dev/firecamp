import {
  ICertificate,
  IWebSocketConfig,
  IWebSocketConnection,
} from '@firecamp/types';
import _url from '@firecamp/url';
import ws from 'ws';
import { _array, _string, _table } from '@firecamp/utils';
import fetchCertificates from './ssl-manager';
import { ClientOptions, EClientOptionsDefaultValues } from './constants';
import { TExecutorOptions } from './executor.interface';

export default class ConfigGenerator {
  private address: string;
  private protocols?: string | string[];
  private clientOptions: ws.ClientOptions & {
    ping?: boolean;
    pingInterval?: number;
    /** default: false */
    reconnect?: boolean;
    /** default: 3000 */
    reconnectTimeout?: number;
    /** default: 3 */
    reconnectAttempts?: number;
  };
  constructor({
    url,
    config = {},
    connection,
    certificates,
  }: TExecutorOptions) {
    this.address = _url.updateByQuery(url, connection.queryParams || []).raw;
    this.protocols = config.protocols || [];
    this.clientOptions = {
      headers: {},
      perMessageDeflate: false,
      rejectUnauthorized: false,
      ca: '',
      followRedirects: true,
      handshakeTimeout: 3000,
      protocolVersion: 13,
      origin: '',
      maxPayload: 0,
      maxRedirects: 10,
    };
    this.checkBooleanValues(config);
    this.checkBooleanValues(config);
    this.checkStringValues(config);
    this.checkNumberValues(config);
    this.setHeaders(connection);
    this.setPingInfo(connection);
    this.setCACertificate(config, certificates);
  }

  private checkBooleanValues(config: IWebSocketConfig) {
    const keys = [
      ClientOptions.reconnect,
      ClientOptions.perMessageDeflate,
      ClientOptions.rejectUnauthorized,
      ClientOptions.followRedirects,
    ];

    keys.map((key) => {
      if (config.hasOwnProperty(key) && typeof config[key] === 'boolean') {
        this.clientOptions[key] = config[key];
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  private checkStringValues(config: IWebSocketConfig) {
    const keys = [
      ClientOptions.ca,
      ClientOptions.origin,
      ClientOptions.maxPayload,
    ];
    keys.map((key) => {
      if (key in config && !_string.isEmpty(config[key])) {
        this.clientOptions[key] = config[key];
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  private checkNumberValues(config: IWebSocketConfig) {
    const keys = [
      ClientOptions.reconnectAttempts,
      ClientOptions.reconnectTimeout,
      ClientOptions.handshakeTimeout,
      ClientOptions.maxRedirects,
      ClientOptions.maxPayload,
      ClientOptions.protocolVersion,
    ];

    keys.map((key) => {
      if (key in config && !isNaN(config[key])) {
        this.clientOptions[key] = Number(config[key]);
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  private setHeaders(connection: IWebSocketConnection) {
    if (connection.headers && !_array.isEmpty(connection.headers)) {
      this.clientOptions.headers = _table.toObject(connection.headers);
    }
  }

  private setCACertificate(config: IWebSocketConfig, certificates: ICertificate[]) {
    if (config.rejectUnauthorized) {
      const certificate = fetchCertificates(certificates, this.address);

      if (certificate) {
        try {
          this.clientOptions.ca = window.fc.file.read(certificate);
        } catch (e) {
          console.error('Error while reading file: ', e);
        }
      }
    }
  }

  private setPingInfo(connection: IWebSocketConnection) {
    this.clientOptions.ping = connection.config?.ping || false;
    this.clientOptions.pingInterval = connection.config?.pingInterval || 3000;
  }

  prepare() {
    const normalizedUrl = _url.normalize(this.address, ['http', 'ws']);
    // console.log(normalizedUrl);
    return {
      address: normalizedUrl,
      protocols: this.protocols,
      clientOptions: this.clientOptions,
    };
  }
}
