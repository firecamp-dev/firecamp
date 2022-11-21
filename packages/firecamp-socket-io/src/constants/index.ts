export const STRINGS = {
  RAW_URL: 'https://socketio-tweet-stream.herokuapp.com',
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
export enum EConnectionState {
  Ideal = -1,
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export enum ELogTypes {
  Send = 'S',
  Receive = 'R',
  Ack = 'ACK',
  System = 'SYS',
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
}

//--------------------------------CONSTS---------------------------------

export const LOG_CUSTOM_EVENTS = {
  LISTEN_ON: 'L_ON',
  LISTEN_OFF: 'L_OFF',
};
export const SYSTEM_LOGS = {
  clearAll: `chatboard  cleared `,
  onConnecting: `Socket has been  created . The connection is not yet open.`,
  onConnect: `The connection is  open  and ready to communicate.`,
  onDisconnecting: `The connection is in the process of  closing .`,
  close: `The connection is  closed  or couldn't be opened.`,
  onReconnect: `Socket connection  re-connecting `,
  notConnected: `The connection is not open yet.`,
  error: `Connection was  broken `,
  ping: `ping`,
  pong: `pong`,
  listen: `you're listening `,
  listenOff: `you have listen off `,
};

export const ACTIONS = {
  UPDATE: {
    REQUEST: 'REQUEST',
    RAW_URL: 'RAW_URL',
    URL: 'URL',
    EMITTER: 'EMITTER',
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
    COLLECTION_EMITTER: 'UPDATE_COLLECTION_EMITTER',
    COLLECTION_DIRECTORY: 'UPDATE_COLLECTION_DIRECTORY',
    ACTIVE_PRJ_ENV_SNIPT: 'ACTIVE_PRJ_ENV_SNIPT',
    ACTIVE_GBL_ENV_SNIPT: 'ACTIVE_GBL_ENV_SNIPT',
  },
  ADD: {
    NEW_CONNECTION: 'NEW_CONNECTION',
    REQUEST_CONNECTION: 'ADD_REQUEST_CONNECTION',
    RESPONSE_CONNECTION: 'ADD_RESPONSE_CONNECTION',
    COLLECTION_EMITTER: 'ADD_COLLECTION_EMITTER',
    COLLECTION_DIRECTORY: 'ADD_COLLECTION_DIRECTORY',
  },
  DELETE: {
    REQUEST_CONNECTION: 'DELETE_REQUEST_CONNECTION',
    COLLECTION_EMITTER: 'DELETE_COLLECTION_EMITTER',
    COLLECTION_DIRECTORY: 'DELETE_COLLECTION_DIRECTORY',
  },
  SET: {
    STATE: 'STATE',
    EMITTER: 'SET_EMITTER',
    COLLECTION_EMITTER: 'SET_COLLECTION_EMITTER',
    GLOBAL_LISTENERS: 'GLOBAL_LISTENERS',
    CONNECTION_LISTENERS: 'CONNECTION_LISTENERS',
    ON_CONNECT_LISTENERS: 'ON_CONNECT_LISTENERS',
  },
};
export const ON_CHANGE_ACTIONS = {
  URL: 'URL',
  RAW_URL: 'RAW_URL',
  EMITTER: 'EMITTER',
  REQUEST_CONNECTIONS: 'REQUEST_CONNECTIONS',
  ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',
  REQUEST_CONNECTION: 'REQUEST_CONNECTION',
  ADD_REQUEST_CONNECTION: 'ADD_REQUEST_CONNECTION',
  REMOVE_REQUEST_CONNECTION: 'REMOVE_REQUEST_CONNECTION',
  CONFIG: 'CONFIG',
  META: 'META',
  COLLECTION: 'COLLECTION',
  DNS: 'DNS',
  ADD_COLLECTION_EMITTER: 'ADD_COLLECTION_EMITTER',
  UPDATE_COLLECTION_EMITTER: 'UPDATE_COLLECTION_EMITTER',
  REMOVE_COLLECTION_EMITTER: 'REMOVE_COLLECTION_EMITTER',
  SET_COLLECTION_EMITTER: 'SET_COLLECTION_EMITTER',
  ADD_COLLECTION_DIRECTORY: 'ADD_COLLECTION_DIRECTORY',
  UPDATE_COLLECTION_DIRECTORY: 'UPDATE_COLLECTION_DIRECTORY',
  REMOVE_COLLECTION_DIRECTORY: 'REMOVE_COLLECTION_DIRECTORY',
  GLOBAL_LISTENERS: 'GLOBAL_LISTENERS',
  CONNECTION_LISTENERS: 'CONNECTION_LISTENERS',
  ON_CONNECT_LISTENERS: 'ON_CONNECT_LISTENERS',
};
export const KEYS_ON_SAVE_REQUEST = {
  REQUEST: [
    'url',
    'config',
    'scripts',
    'connections',
    'active_connection',
    'meta',
    '_dnp',
    'listeners',
    '_meta',
  ],
  KEYS: ['emitter_collection'],
};
export const EMITTER_PAYLOAD_TYPES = {
  text: 'text',
  json: 'json',
  file: 'file',
  arraybuffer: 'arraybuffer',
  arraybufferview: 'arraybufferview',
  number: 'number',
  boolean: 'boolean',
  no_body: 'no_body',
};
export const PANEL = {
  REQUEST: 'REQUEST',
  RESPONSE: 'RESPONSE',
  ALL: 'ALL',
};
export const DEFAULT_HEADERS = [];

export const CustomLogTypes = {
  LISTEN_ON: 'L_ON',
  LISTEN_OFF: 'L_OFF',
};

export const ConnectionStatus = {
  CONNECTING: 'connecting',
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  CONNECT_TIMEOUT: 'connect_timeout',
  ERROR: 'error',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECTING: 'reconnecting',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
};
export const VERSIONS = ['v2', 'v3', 'v4'];
export const RESERVED_EMITTER_EVENTS = [
  'connect',
  'connect_error',
  'disconnect',
  'newListener',
  'removeListener',
];
