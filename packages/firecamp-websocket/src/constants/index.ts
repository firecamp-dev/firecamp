import { nanoid as id } from 'nanoid';
import { EKeyValueTableRowType, IWebSocketConfig } from '@firecamp/types';
import { EConnectionState, EMessagePayloadTypes } from '../types';

const DefaultHeaders = [
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

const DefaultConnectionState = {
  id: id(),
  name: 'Default',
  isDefault: true,
  headers: DefaultHeaders,
  queryParams: [],
  config: {
    ping: false,
    pingInterval: 3000,
  },
};

const ConnectionStates = {
  '0': {
    state: 'connecting',
    description: 'Socket has been created. The connection is not yet open.',
  },
  '1': {
    state: 'open',
    description: 'The connection is open and ready to communicate.',
  },
  '2': {
    state: 'closing',
    description: 'The connection is in the process of closing.',
  },
  '3': {
    state: 'closed',
    description: "The connection is closed or couldn't be opened.",
  },
  '4': {
    state: 'normal_closed',
    description:
      'Normal closure; the connection successfully completed whatever purpose for which it was created.',
  },
  '5': {
    state: 'error',
    description: 'connection error',
  },
  '6': {
    state: 'reconnect',
    description: 'Reconnect',
  },
  '7': {
    state: 'reconnecting',
    description: 'Reconnecting',
  },
  '8': {
    state: 'reconnect_attempt',
    description: 'Reconnect attempts',
  },
  '9': {
    state: 'reconnect_failed',
    description: 'Reconnection failed',
  },
};

const ConnectionCloseEventsWithReason = {
  '1000': {
    name: 'Normal Closure',
    description:
      'Normal closure; the connection successfully completed whatever purpose for which it was created.',
  },
  '1001': {
    name: 'Going, Away',
    description:
      'The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.',
  },
  '1002': {
    name: 'Protocol, Error',
    description:
      'The endpoint is terminating the connection due to a protocol error.',
  },
  '1003': {
    name: 'Unsupported, Data',
    description:
      'The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).',
  },
  '1005': {
    name: 'No, Status Received',
    description: 'No status code was provided even though one was expected.',
  },
  '1006': {
    name: 'Abnormal, Closure',
    description:
      'A connection was closed abnormally, when a status code is expected.',
  },
  '1007': {
    name: 'Invalid, frame payload data',
    description:
      'The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).',
  },
  '1008': {
    name: 'Policy, Violation',
    description:
      'The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.',
  },
  '1009': {
    name: 'Message, too big',
    description:
      'The endpoint is terminating the connection because a data frame was received that is too large.',
  },
  '1010': {
    name: 'Missing, Extension',
    description:
      "The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't.",
  },
  '1011': {
    name: 'Internal, Error',
    description:
      'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.',
  },
  '1012': {
    name: 'Service, Restart',
    description:
      'The server is terminating the connection because it is restarting.',
  },
  '1013': {
    name: 'Try Again Later',
    description:
      'The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.',
  },
  '1014': {
    name: 'Bad Gateway',
    description:
      'The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.',
  },
  '1015': {
    name: 'TLS Handshake',
    description:
      "Reserved. Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).",
  },
};

const CloseConnStatusCode = {
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

const KeysOnSaveRequest = {
  REQUEST: [
    'url',
    'config',
    'scripts',
    'connections',
    '__meta',
    '_dnp',
    '__ref',
  ],
  KEYS: ['message_collection'],
};

const DefaultRequestConnection = {
  id: '',
  headers: DefaultHeaders || [],
  queryParams: [],
  isDefault: false,
  name: '',
  config: {
    ping: false,
    pingInterval: 0,
  },
};
const ResponseConnection = {
  id: '',
  name: '',
  state: EConnectionState.Ideal,
  reconnectAttemptLeft: 0,
  logFilters: {
    type: '',
  },
  /* instance: null,
   messages: [],
   unread_messages_count: 0,
   */
};
const InitLog = {
  title: '',
  message: '',
  __meta: {
    id: '',
    event: '',
    timestamp: '',
    type: '',
    color: '',
    ackRef: '',
  },
};

const DefaultConfigState: IWebSocketConfig = {
  protocols: [],
  reconnect: false,
  reconnectAttempts: 3,
  reconnectTimeout: 3000,
  rejectUnauthorized: false,
  followRedirects: true,
  handshakeTimeout: 3000, //ms
  maxRedirects: 10,
  protocolVersion: 13,
  origin: '',
  maxPayload: 0, //bytes
};

const MessageTypeDropDownList = [
  {
    id: EMessagePayloadTypes.text,
    name: 'Text',
  },
  {
    id: EMessagePayloadTypes.json,
    name: 'JSON',
  },
  // {
  //   id: EMessagePayloadTypes.file,
  //   name: 'File',
  // },
  /** temporarily disabling the array buffer option */
  /**
  {
    id: EMessagePayloadTypes.arraybuffer,
    name: 'Array buffer',
  },
  {
    id: EMessagePayloadTypes.arraybufferview,
    name: 'Array buffer view',
  },*/
  // {
  //   id: 'none',
  //   name: 'None',
  // },
];

export {
  DefaultConnectionState,
  CloseConnStatusCode,
  DefaultHeaders,
  KeysOnSaveRequest,
  ConnectionStates,
  ConnectionCloseEventsWithReason,
  DefaultRequestConnection,
  ResponseConnection,
  InitLog,
  DefaultConfigState,
  MessageTypeDropDownList,
};
