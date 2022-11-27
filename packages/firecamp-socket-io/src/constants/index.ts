import {
  EEnvelope,
  EArgumentBodyType,
  ERequestTypes,
  ISocketIOConnection,
  ISocketIOConfig,
  ESocketIOClientVersion,
} from '@firecamp/types';
import { nanoid } from 'nanoid'
import { EConnectionState } from '../types';

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

export const PANEL = {
  REQUEST: 'REQUEST',
  RESPONSE: 'RESPONSE',
  ALL: 'ALL',
};

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

export const RequestConnection: ISocketIOConnection = {
  id: nanoid(),
  name: 'Connection 1',
  forceNew: false,
  namespace: '',
  path: '',
  ping: false,
  pingInterval: 3000,
  transports: {
    websocket: false,
    polling: true,
  },
  headers: [],
  queryParams: [],
  auth: [],
  //@ts-ignore
  listeners: {},
};
export const DefaultRequestConfig: ISocketIOConfig = {
  version: ESocketIOClientVersion.v4,
  onConnectListeners: [],
};
export const ResponseCollection = {
  id: '',
  name: '',
  meta: {
    state: EConnectionState.Ideal,
    socketId: '',
  },
  listeners: {},
  logFilters: {
    type: '',
    event: '',
  },
};
export const InitPlayground = {
  name: '',
  path: '',
  body: [
    {
      body: '',
      __meta: {
        type: EArgumentBodyType.Text,
        envelope: EEnvelope.Int8Array,
      },
    },
  ],
  __meta: {
    label: '',
    interval: '',
    ack: false,
  },
  __ref: {
    id: '',
    collectionId: '',
    requestId: '',
    requestType: ERequestTypes.SocketIO,
  },
};
export const InitArg = {
  meta: {
    type: EArgumentBodyType.Text,
    envelope: EEnvelope.Int8Array,
  },
  body: '',
};
export const InitLog = {
  title: '',
  message: '',
  meta: {
    id: '',
    event: '',
    timestamp: '',
    type: '',
    color: '',
    ackRef: '',
  },
};
export const EditorCommands = {
  SAVE: {
    command: 'SAVE',
    name: 'Save',
    key: {
      win: 'Ctrl-S',
      mac: 'Command-S',
    },
    view: {
      win: `Ctrl + S`,
      mac: `⌘ + S`,
    },
  },
  SEND: {
    command: 'SEND',
    name: 'Send',
    key: {
      win: 'Ctrl-Enter',
      mac: 'Command-Enter',
    },
    view: {
      win: `Ctrl + Enter`,
      mac: `⌘ + Enter`,
    },
  },
  SEND_AND_SAVE: {
    command: 'SEND_AND_SAVE',
    name: 'Send and save',
    key: {
      win: 'Ctrl-Shift-Enter',
      mac: 'Command-Shift-Enter',
    },
    view: {
      win: `Ctrl + Shift + Enter`,
      mac: `⌘ + Shift + Enter`,
    },
  },
  SET_TO_ORIGINAL: {
    command: 'SET_TO_ORIGINAL',
    name: 'Set to original',
    key: {
      win: 'Ctrl-O',
      mac: 'Command-O',
    },
    view: {
      win: `Ctrl + O`,
      mac: `⌘ + O`,
    },
  },
  CLEAR_PLAYGROUND: {
    command: 'CLEAR_PLAYGROUND',
    name: 'Clear playground',
    key: {
      win: 'Ctrl-K',
      mac: 'Command-K',
    },
    view: {
      win: `Ctrl + K`,
      mac: `⌘ + K`,
    },
  },
};
export const ArgTypes = [
  {
    id: EArgumentBodyType.Text,
    name: 'Text',
  },
  {
    id: EArgumentBodyType.Json,
    name: 'JSON',
  },
  {
    id: EArgumentBodyType.File,
    name: 'File',
  },
  {
    id: EArgumentBodyType.ArrayBuffer,
    name: 'Array buffer',
  },
  {
    id: EArgumentBodyType.ArrayBufferView,
    name: 'Array buffer view',
  },
  {
    id: EArgumentBodyType.Number,
    name: 'Number',
  },
  {
    id: EArgumentBodyType.Boolean,
    name: 'Boolean',
  },
  {
    id: EArgumentBodyType.NoBody,
    name: 'No body',
  },
];
export const EnvelopeTypes = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
];
