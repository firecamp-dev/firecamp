import { ISocketIOConfig } from '@firecamp/types';

const keysToMap = {
  reconnection: 'reconnection',
  timeout: 'timeout',
  version: 'version',
  reject_unauthorized: 'rejectUnauthorized',
  reconnection_attempts: 'reconnectionAttempts',
  reconnection_delay: 'reconnectionDelay',
  reconnection_delay_max: 'reconnectionDelayMax',
};

/**
 * transform config keys
 *
 * @param config request config
 */
export default (config: ISocketIOConfig): object => {
  return Object.keys(keysToMap).reduce((newConfig, key) => {
    newConfig[keysToMap[key]] = config[key];

    return newConfig;
  }, {});
};
