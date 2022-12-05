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
  address: string;
  protocols?: string | string[];
  clientOptions: ws.ClientOptions & {
    ping?: boolean;
    pingInterval?: number;
    /** default: false */
    reconnect?: boolean;
    /** default: 3000 */
    reconnectTimeout?: number;
    /** default: 3 */
    reconnectAttempts?: number;
  };
  connection: IWebSocketConnection;
  certificates: ICertificate[];
  config: IWebSocketConfig;
  constructor({ url, config, connection, certificates }: TExecutorOptions) {
    this.address = _url.updateByQuery(url, connection.queryParams || []).raw;
    this.protocols = [];
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
    this.config = config || {};
    this.connection = connection;
    this.certificates = certificates;
  }

  checkBooleanValues() {
    const keys = [
      ClientOptions.reconnect,
      ClientOptions.perMessageDeflate,
      ClientOptions.rejectUnauthorized,
      ClientOptions.followRedirects,
    ];

    keys.map((key) => {
      if (
        this.config.hasOwnProperty(key) &&
        typeof this.config[key] === 'boolean'
      ) {
        this.clientOptions[key] = this.config[key];
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  checkStringValues() {
    const keys = [
      ClientOptions.ca,
      ClientOptions.origin,
      ClientOptions.maxPayload,
    ];

    keys.map((key) => {
      if (key in this.config && !_string.isEmpty(this.config[key])) {
        this.clientOptions[key] = this.config[key];
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  checkNumberValues() {
    const keys = [
      ClientOptions.reconnectAttempts,
      ClientOptions.reconnectTimeout,
      ClientOptions.handshakeTimeout,
      ClientOptions.maxRedirects,
      ClientOptions.maxPayload,
      ClientOptions.protocolVersion,
    ];

    keys.map((key) => {
      if (key in this.config && !isNaN(this.config[key])) {
        this.clientOptions[key] = Number(this.config[key]);
      } else this.clientOptions[key] = EClientOptionsDefaultValues[key];
    });
  }

  setClientConfig() {
    this.protocols = this.config.protocols;
    this.checkBooleanValues();
    this.checkStringValues();
    this.checkNumberValues();
  }

  setHeaders() {
    if (this.connection.headers && !_array.isEmpty(this.connection.headers)) {
      this.clientOptions.headers = _table.toObject(this.connection.headers);
    }
  }

  setCACertificate() {
    if (this.config.rejectUnauthorized) {
      const certificate = fetchCertificates(this.certificates, this.address);

      if (certificate) {
        try {
          this.clientOptions.ca = window.fc.file.read(certificate);
        } catch (e) {
          console.error('Error while reading file: ', e);
        }
      }
    }
  }

  setPingInfo() {
    this.clientOptions.ping = this.connection.config?.ping || false;
    this.clientOptions.pingInterval =
      this.connection.config?.pingInterval || 3000;
  }

  prepare() {
    this.setClientConfig();
    this.setHeaders();
    this.setPingInfo();
    this.setCACertificate();
    const normalizedUrl = _url.normalize(this.address, ['http', 'ws']);
    // console.log(normalizedUrl);
    return {
      address: normalizedUrl,
      protocols: this.config.protocols,
      clientOptions: this.clientOptions,
    };
  }
}
