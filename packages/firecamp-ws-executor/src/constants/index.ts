import { readyState, closeEvents } from './connection-info';

export const { statusCodes: StatusCodes } = closeEvents;

export enum ELogTypes {
  Send = 's',
  Receive = 'r',
  Ack = 'ack',
  System = 'sys',
  Upgrade = 'upgrade',
}

export enum ELogEvents {
  onOpen = 'onOpen',
  onClose = 'onClose',
  onConnecting = 'onConnecting',
  common = 'common',
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
}

export const ConnectionStatus = {
  ...readyState,
};

export const EClientOptions = {
  handshakeTimeout: 'handshakeTimeout',
  rejectUnauthorized: 'rejectUnauthorized',
  followRedirects: 'followRedirects',
  maxRedirects: 'maxRedirects',
  protocolVersion: 'protocolVersion',
  maxPayload: 'maxPayload',
  reconnect: 'reconnect',
  reconnectAttempts: 'reconnectAttempts',
  reconnectTimeout: 'reconnectTimeout',
  ca: 'ca',
  origin: 'origin',
  protocols: 'protocols',
  perMessageDeflate: 'perMessageDeflate',
  headers: 'headers',
};

export const EClientOptionsDefaultValues = {
  handshakeTimeout: 3000,
  rejectUnauthorized: false,
  followRedirects: false,
  maxRedirects: 10,
  protocolVersion: 13,
  maxPayload: -1,
  reconnect: false,
  reconnectAttempts: 3,
  reconnectTimeout: 3000,
  ca: '',
  origin: '',
  protocols: '',
  perMessageDeflate: false,
  headers: {},
};
