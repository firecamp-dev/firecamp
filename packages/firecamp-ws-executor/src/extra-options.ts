import { IWebSocketConfig } from '@firecamp/types';

const keysToMap = {
  handshake_timeout: 'handshakeTimeout',
  reject_unauthorized: 'rejectUnauthorized',
  follow_redirects: 'followRedirects',
  max_redirects: 'maxRedirects',
  protocol_version: 'protocolVersion',
  max_payload: 'maxPayload',
  reconnect_attempts: 'reconnectAttempts',
  reconnect_timeout: 'reconnectTimeout',
  protocols: 'protocols',
  reconnect: 'reconnect',
  origin: 'origin',
};

/**
 * transform config keys
 *
 * @param config request config
 */
export default (config: IWebSocketConfig): object => {
  return Object.keys(keysToMap).reduce((newConfig, key) => {
    newConfig[keysToMap[key]] = config[key];

    return newConfig;
  }, {});
};
