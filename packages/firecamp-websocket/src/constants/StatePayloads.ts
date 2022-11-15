import { IWebSocketConfig } from '@firecamp/types';
import { EConnectionState, DEFAULT_HEADERS } from '.';

export const REQUEST_CONNECTION = {
  id: '',
  headers: DEFAULT_HEADERS || [],
  query_params: [],
  is_default: false,
  name: '',
  config: {
    ping: false,
    ping_interval: 0,
  },
};
export const RESPONSE_CONNECTION = {
  id: '',
  name: '',
  state: EConnectionState.IDEAL,
  reconnect_attempt_left: 0,
  logFilters: {
    type: '',
  },
  /* instance: null,
   messages: [],
   unread_messages_count: 0,
   */
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

export const configState: IWebSocketConfig = {
  protocols: [],
  reconnect: false,
  reconnect_attempts: 3,
  reconnect_timeout: 3000,
  reject_unauthorized: false,
  follow_redirects: true,
  handshake_timeout: 3000, //ms
  max_redirects: 10,
  protocol_version: 13,
  origin: '',
  max_payload: 0, //bytes
};
