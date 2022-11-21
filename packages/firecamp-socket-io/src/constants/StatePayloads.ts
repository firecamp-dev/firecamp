import { EConnectionState, EMITTER_PAYLOAD_TYPES } from '.';

import { EEnvelope, EArgumentBodyType, ERequestTypes } from '@firecamp/types';

export const REQUEST_CONNECTION = {
  id: '',
  forceNew: false,
  name: '',
  namespace: '',
  path: '',
  ping: false,
  ping_interval: 3000,
  transports: {
    websocket: false,
    polling: true,
  },
  headers: [],
  query_params: [],
  auth: [],
  listeners: {},
};
export const RESPONSE_CONNECTION = {
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
export const INIT_PLAYGROUND = {
  _meta: {
    id: '',
    collection_id: '',
    request_id: '',
    request_type: ERequestTypes.SocketIO,
  },
  name: '',
  path: '',
  meta: {
    label: '',
    interval: '',
    ack: false,
  },
  body: [
    {
      meta: {
        type: EArgumentBodyType.Text,
        envelope: EEnvelope.Int8Array,
      },
      body: '',
    },
  ],
};
export const INIT_ARG = {
  meta: {
    type: EArgumentBodyType.Text,
    envelope: EEnvelope.Int8Array,
  },
  body: '',
};
export const INIT_LOG = {
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

export const EDITOR_COMMANDS = {
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

export const argTypes = [
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

export const envelopeTypes = [
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
