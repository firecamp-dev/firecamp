import { nanoid as id } from 'nanoid';
import { readyState, closeEvents } from './connection';
import { EKeyValueTableRowType } from '@firecamp/types';

const { statusCodes: StatusCodes } = closeEvents;

const LogTypes = {
  SEND: 'S',
  RECEIVE: 'R',
  ACK: 'ACK',
  SYSTEM: 'SYS',
  UPGRADE: 'upgrade',
};

const LogColors = {
  SUCCESS: 'success',
  DANGER: 'danger',
};

const ConnectionStatus = {
  ...readyState,
};

const STRINGS = {
  RAW_URL: 'ws://echo.websocket.org',
  URL: {
    AUTH: 'auth',
    HASH: 'hash',
    HOST: 'host',
    HOSTNAME: 'hostname',
    HREF: 'href',
    ORIGIN: 'origin',
    PASSWORD: 'password',
    PATHNAME: 'pathname',
    PATH: 'path', //considered pathname as path in new version of URL
    PORT: 'port',
    PROTOCOL: 'protocol',
    QUERY_PARAMS: 'query_params', //URL object is having query as key but in FC there will be query_params key to maintain URL structure
    SLASHES: 'slashes',
    USERNAME: 'username',
    VARIABLES: 'variables',
  },
};
enum EConnectionState {
  IDEAL = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}
const MESSAGE_TYPES = {
  SYSTEM: 'SYS',
  SEND: 'S',
  RECEIVE: 'R',
};
const SYSTEM_MESSAGES = {
  clearAll: `chatboard  cleared `,

  onConnecting: `Socket has been  created . The connection is not yet open.`,
  onConnect: `The connection is  open  and ready to communicate.`,
  onDisconnecting: `The connection is in the process of  closing .`,
  close: `The connection is  closed  or couldn't be opened.`,

  onReconnect: `ws connection  re-connecting `,
  notConnected: `The connection is not open yet.`,
  error: `Connection was  broken `,

  ping: `ping`,
  pong: `pong`,
  listen: `you're listening `,
  listenOff: `you have listen off `,
};
const CLOSE_CONN_STATUS_CODES = {
  1001: 'Going, Away',
  1002: 'Protocol, Error',
  1003: 'Unsupported, Data',
  1005: 'No, Status Received',
  1006: 'Abnormal, Closure',
  1007: 'Invalid, frame payload data',
  1008: 'Policy, Violation',
  1009: 'Message, too big',
  1010: 'Missing, Extension',
  1011: 'Internal, Error',
  1012: 'Service, Restart',
  1013: 'Try Again Later',
  1014: 'Bad Gateway',
  1015: 'TLS Handshake',
};
const ACTIONS = {
  UPDATE: {
    REQUEST: 'REQUEST',
    RAW_URL: 'RAW_URL',
    URL: 'URL',
    MESSAGE: 'MESSAGE',
    REQUEST_CONNECTIONS: 'REQUEST_CONNECTIONS',
    RESPONSE_CONNECTIONS: 'RESPONSE_CONNECTIONS',
    ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',
    REQUEST_CONNECTION: 'UPDATE_REQUEST_CONNECTION',
    RESPONSE_CONNECTION: 'UPDATE_RESPONSE_CONNECTION',
    RESPONSE_MESSAGES_ALIGNMENT: 'RESPONSE_MESSAGES_ALIGNMENT',
    CONFIG: 'CONFIG',
    META: 'META',
    DNS: 'DNS',

    COLLECTION: 'COLLECTION',
    COLLECTION_MESSAGE: 'UPDATE_COLLECTION_MESSAGE',
    COLLECTION_DIRECTORY: 'UPDATE_COLLECTION_DIRECTORY',

    ACTIVE_PRJ_ENV_SNIPT: 'ACTIVE_PRJ_ENV_SNIPT',
    ACTIVE_GBL_ENV_SNIPT: 'ACTIVE_GBL_ENV_SNIPT',
  },
  ADD: {
    NEW_CONNECTION: 'NEW_CONNECTION',
    REQUEST_CONNECTION: 'ADD_REQUEST_CONNECTION',
    RESPONSE_CONNECTION: 'ADD_RESPONSE_CONNECTION',

    COLLECTION_MESSAGE: 'ADD_COLLECTION_MESSAGE',
    COLLECTION_DIRECTORY: 'ADD_COLLECTION_DIRECTORY',
  },
  DELETE: {
    REQUEST_CONNECTION: 'DELETE_REQUEST_CONNECTION',

    COLLECTION_MESSAGE: 'DELETE_COLLECTION_MESSAGE',
    COLLECTION_DIRECTORY: 'DELETE_COLLECTION_DIRECTORY',
  },
  SET: {
    STATE: 'STATE',
    MESSAGE: 'SET_MESSAGE',
    COLLECTION_MESSAGE: 'SET_COLLECTION_MESSAGE',
  },
};
const ON_CHANGE_ACTIONS = {
  URL: 'URL',
  RAW_URL: 'RAW_URL',
  MESSAGE: 'MESSAGE',
  REQUEST_CONNECTIONS: 'REQUEST_CONNECTIONS',
  ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',
  REQUEST_CONNECTION: 'REQUEST_CONNECTION',
  ADD_REQUEST_CONNECTION: 'ADD_REQUEST_CONNECTION',
  REMOVE_REQUEST_CONNECTION: 'REMOVE_REQUEST_CONNECTION',
  CONFIG: 'CONFIG',
  META: 'META',
  COLLECTION: 'COLLECTION',
  DNS: 'DNS',

  ADD_COLLECTION_MESSAGE: 'ADD_COLLECTION_MESSAGE',
  UPDATE_COLLECTION_MESSAGE: 'UPDATE_COLLECTION_MESSAGE',
  REMOVE_COLLECTION_MESSAGE: 'REMOVE_COLLECTION_MESSAGE',
  SET_COLLECTION_MESSAGE: 'SET_COLLECTION_MESSAGE',

  ADD_COLLECTION_DIRECTORY: 'ADD_COLLECTION_DIRECTORY',
  UPDATE_COLLECTION_DIRECTORY: 'UPDATE_COLLECTION_DIRECTORY',
  REMOVE_COLLECTION_DIRECTORY: 'REMOVE_COLLECTION_DIRECTORY',
};
const KEYS_ON_SAVE_REQUEST = {
  REQUEST: ['url', 'config', 'scripts', 'connections', 'meta', '_dnp', '_meta'],
  KEYS: ['message_collection'],
};
const MESSAGE_PAYLOAD_TYPES = {
  text: 'text',
  json: 'json',
  file: 'file',
  arraybuffer: 'arraybuffer',
  arraybufferview: 'arraybufferview',
  no_body: 'no_body',
};
const PANEL = {
  REQUEST: 'REQUEST',
  RESPONSE: 'RESPONSE',
  ALL: 'ALL',
};
const DEFAULT_HEADERS = [
  {
    id: id(),
    key: 'Sec-WebSocket-Extensions',
    value: '',
    type: EKeyValueTableRowType.Text,
    disable: true,
  },
  {
    id: id(),
    key: 'Sec-WebSocket-Protocol',
    value: '',
    type: EKeyValueTableRowType.Text,
    disable: true,
  },
  {
    id: id(),
    key: 'Sec-WebSocket-Version',
    value: '13',
    type: EKeyValueTableRowType.Text,
    disable: false,
  },
];
export {
  STRINGS,
  EConnectionState,
  MESSAGE_PAYLOAD_TYPES,
  ACTIONS,
  CLOSE_CONN_STATUS_CODES,
  DEFAULT_HEADERS,
  KEYS_ON_SAVE_REQUEST,
  MESSAGE_TYPES,
  ON_CHANGE_ACTIONS,
  PANEL,
  SYSTEM_MESSAGES,
  ConnectionStatus,
  LogColors,
  LogTypes,
  StatusCodes,
};
