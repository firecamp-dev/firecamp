import { nanoid as id } from 'nanoid';
import { EKeyValueTableRowType } from '@firecamp/types';
import { readyState, closeEvents } from './connection';

const { statusCodes: StatusCodes } = closeEvents;

enum ELogTypes {
  Send = 'S',
  Receive = 'R',
  Ack = 'ACK',
  System = 'SYS',
  Upgrade = 'upgrade',
}

enum ELogColors {
  Success = 'success',
  Danger = 'danger',
}

const ConnectionStatus = {
  ...readyState,
};

enum EConnectionState {
  Ideal = -1,
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}
enum EMessageTypes {
  System = 'SYS',
  Send = 'S',
  Receive = 'R',
}
enum ESystemMessages {
  ClearAll = `clear all logs`,

  OnConnecting = `Socket has been  created . The connection is not yet open.`,
  OnConnect = `The connection is  open  and ready to communicate.`,
  OnDisconnecting = `The connection is in the process of  closing .`,
  Close = `The connection is  closed  or couldn't be opened.`,

  OnReconnect = `ws connection  re-connecting `,
  NotConnected = `The connection is not open yet.`,
  Error = `Connection was  broken `,

  Ping = `ping`,
  Pong = `pong`,
  Listen = `you're listening `,
  ListenOff = `you have listen off `,
}
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
  REQUEST: ['url', 'config', 'scripts', 'connections', 'meta', '_dnp', '_meta'],
  KEYS: ['message_collection'],
};
const EMessagePayloadTypes = {
  text: 'text',
  json: 'json',
  file: 'file',
  arraybuffer: 'arraybuffer',
  arraybufferview: 'arraybufferview',
  no_body: 'no_body',
};
enum EPanel {
  Request = 'REQUEST',
  Response = 'RESPONSE',
  All = 'ALL',
}
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
export {
  EConnectionState,
  EMessagePayloadTypes,
  CloseConnStatusCode,
  DefaultHeaders,
  KeysOnSaveRequest,
  EMessageTypes,
  EPanel,
  ESystemMessages,
  ConnectionStatus,
  ELogColors,
  ELogTypes,
  StatusCodes,
};
