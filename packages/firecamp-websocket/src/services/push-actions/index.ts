import {
  IUrl,
  IWebSocketConfig,
  TId,
  IWebSocketConnection,
  IWebSocketMessage,
  IRequestFolder,
  EPushActionType,
} from '@firecamp/types';
import equal from 'deep-equal';
import CleanDeep from 'clean-deep';

import {
  IPushActionConnections,
  IPushActionMessage,
  IPushActionDirectory,
  EPushAction_rootKeys,
  EPushActionUrlKeys,
  EPushActionMetaKeys,
  EPushAction_metaKeys,
  EPushActionConfigKeys,
  EPushActionMessage_Root,
  EPushActionDirectory_Root,
} from '../../types';
import { _array, _object } from '@firecamp/utils';

// TODO: add enums for push action types

const PushActionService = {
  // TODO: add below function as common logic for all clients
  prepareRootPushAction: (
    lastRequest: any,
    request: any,
    existingPushAction?: Array<EPushAction_rootKeys>
  ) => {
    let pushAction: Array<EPushAction_rootKeys> = existingPushAction || [];

    if (!lastRequest || !request) return [];

    Object.keys(request).forEach((key: EPushAction_rootKeys) => {
      if (!equal(lastRequest[key], request[key])) {
        /**
         * Push request key in push action
         * If updated request and lastRequest value are not same
         */
        pushAction.push(key);
      } else if (
        pushAction.includes(key) &&
        equal(lastRequest[key], request[key])
      ) {
        pushAction = _array.without(pushAction, key) as EPushAction_rootKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepareUrlPushAction: (
    lastUrl: IUrl,
    url: IUrl,
    existingPushAction?: Array<EPushActionUrlKeys>
  ) => {
    let pushAction: Array<EPushActionUrlKeys> = existingPushAction || [];

    if (!lastUrl || !url) return [];

    Object.keys(url).forEach((key: EPushActionUrlKeys) => {
      if (!equal(lastUrl[key], url[key])) {
        /**
         * Push url key in push action
         * If updated url and lastUrl value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key) && equal(lastUrl[key], url[key])) {
        pushAction = _array.without(pushAction, key) as EPushActionUrlKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepareMetaPushAction: (
    lastMeta: any,
    meta: any,
    existingPushAction?: Array<EPushActionMetaKeys>
  ) => {
    let pushAction: Array<EPushActionMetaKeys> = existingPushAction || [];

    if (!lastMeta || !meta) return [];

    Object.keys(meta).forEach((key: EPushActionMetaKeys) => {
      if (!equal(lastMeta[key], meta[key])) {
        /**
         * Push meta key in push action
         * If updated meta and lastMeta value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key) && equal(lastMeta[key], meta[key])) {
        pushAction = _array.without(pushAction, key) as EPushActionMetaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepare_MetaPushAction: (
    last_Meta: any,
    _meta: any,
    existingPushAction?: Array<EPushAction_metaKeys>
  ) => {
    let pushAction: Array<EPushAction_metaKeys> = existingPushAction || [];
    if (!last_Meta || !_meta) return [];

    Object.keys(_meta).forEach((key: EPushAction_metaKeys) => {
      if (!equal(last_Meta[key], _meta[key])) {
        /**
         * Push _meta key in push action
         * If updated _meta and last_Meta value are not same
         */
        pushAction.push(key);
      } else if (
        pushAction.includes(key) &&
        equal(last_Meta[key], _meta[key])
      ) {
        pushAction = _array.without(pushAction, key) as EPushAction_metaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  prepareConfigPushAction: (
    lastConfig: IWebSocketConfig,
    config: IWebSocketConfig,
    existingPushAction: Array<string>
  ) => {
    let pushAction: Array<string> = existingPushAction || [];

    if (!lastConfig || !config) return [];

    for (let key in config) {
      if (!equal(lastConfig[key], config[key])) {
        /**
         * Push config key in push action
         * If updated config and lastConfig value are not same
         */
        pushAction.push(key);
      } else if (
        pushAction.includes(key) &&
        equal(lastConfig[key], config[key])
      ) {
        pushAction = _array.without(pushAction, key) as EPushActionConfigKeys[];
      }
    }

    return _array.uniq(pushAction);
  },

  prepareRequestConnectionsPushAction: (
    connection_id: TId,
    pushActionType: EPushActionType,
    lastConnection: IWebSocketConnection,
    connection: IWebSocketConnection,
    existingPushAction: IPushActionConnections
  ) => {
    let pushAction: IPushActionConnections = existingPushAction || {};

    // INSERT
    if (pushActionType === EPushActionType.Insert) {
      pushAction[pushActionType] = _array.uniq([
        ...(pushAction[pushActionType] || []),
        connection_id,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(connection_id)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from connection_id
        let existingConnectionCAIndex = pushAction?.[pushActionType]?.findIndex(
          (c) => c.id === connection_id
        );

        let connectionUpdatedCA = pushAction?.[pushActionType]?.[
          existingConnectionCAIndex
        ] || { id: connection_id };

        for (let key in connection) {
          if (key === 'headers' || key === 'query_params') {
            // For headers and query_params add in to key '_root'
            if (!equal(connection[key], lastConnection[key])) {
              connectionUpdatedCA['_root'] = _array.uniq([
                ...(connectionUpdatedCA?.['_root'] || []),
                key,
              ]);
            } else if (connectionUpdatedCA?.['_root']?.includes(key)) {
              // If already exist in push action and having same value then remove from updated push action
              connectionUpdatedCA['_root'] = _array.without(
                connectionUpdatedCA?.['_root'],
                key
              ) as string[];
            }
          } else if (key === 'config') {
            for (let configKey in connection[key]) {
              if (
                !equal(
                  connection[key][configKey],
                  connection?.[key]?.[configKey]
                )
              ) {
                connectionUpdatedCA['config'] = _array.uniq([
                  ...(connectionUpdatedCA?.['config'] || []),
                  configKey,
                ]);
              } else if (connectionUpdatedCA?.['config']?.includes(configKey)) {
                // If already exist in push action and having same value then remove from updated push action
                connectionUpdatedCA['config'] = _array.without(
                  connectionUpdatedCA['config'],
                  configKey
                ) as string[];
              }
            }
          }
        }

        if (_object.size(_object.omit(connectionUpdatedCA, ['id']))) {
          if (
            existingConnectionCAIndex !== undefined &&
            existingConnectionCAIndex !== -1
          ) {
            pushAction[pushActionType][existingConnectionCAIndex] =
              connectionUpdatedCA;
          } else {
            pushAction[pushActionType] = [
              ...(pushAction?.[pushActionType] || []),
              connectionUpdatedCA,
            ];
          }
        } else if (pushAction[pushActionType]) {
          pushAction[pushActionType] = pushAction?.[pushActionType].filter(
            (c) => c.id !== connection_id
          );
        }
      }
    }

    // DELETE
    else {
      // check if in instert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(connection_id)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          connection_id
        ) as string[];
      } else {
        // check if in udpate and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find(
            (c) => c.id === connection_id
          )
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((c) => c.id === connection_id);
        }

        // Add connection_id in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          connection_id,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },

  prepareCollectionMessagesPushAction: (
    message_id: TId,
    pushActionType: EPushActionType,
    lastMessage: IWebSocketMessage,
    message: IWebSocketMessage,
    existingPushAction: IPushActionMessage
  ) => {
    let pushAction: IPushActionMessage = existingPushAction || {};

    // INSERT
    if (pushActionType === EPushActionType.Insert) {
      pushAction[pushActionType] = _array.uniq([
        ...(pushAction[pushActionType] || []),
        message_id,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(message_id)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from message_id
        let existingMessageCAIndex = pushAction?.[pushActionType]?.findIndex(
          (m) => m?.id === message_id
        );

        let messageUpdatedCA = pushAction?.[pushActionType]?.[
          existingMessageCAIndex
        ] || { id: message_id };

        for (let key in message) {
          if (
            key === EPushActionMessage_Root.name ||
            key === EPushActionMessage_Root.body
          ) {
            // For name and body add in to key '_root'
            if (!equal(message[key], lastMessage[key])) {
              messageUpdatedCA['_root'] = _array.uniq([
                ...(messageUpdatedCA?.['_root'] || []),
                key,
              ]);
            } else if (messageUpdatedCA?.['_root']?.includes(key)) {
              // If already exist in push action and having same value then remove from updated push action
              messageUpdatedCA['_root'] = _array.without(
                messageUpdatedCA?.['_root'],
                key
              ) as EPushActionMessage_Root[];
            }
          } else if (key === key) {
            for (let updatedKey in message[key]) {
              if (
                !equal(message[key][updatedKey], message?.[key]?.[updatedKey])
              ) {
                messageUpdatedCA[key] = _array.uniq([
                  ...(messageUpdatedCA?.[key] || []),
                  updatedKey,
                ]);
              } else if (messageUpdatedCA?.[key]?.includes(updatedKey)) {
                // If already exist in push action and having same value then remove from updated push action
                messageUpdatedCA[key] = _array.without(
                  messageUpdatedCA[key],
                  updatedKey
                );
              }
            }
          }
        }

        if (_object.size(_object.omit(messageUpdatedCA, ['id']))) {
          if (
            existingMessageCAIndex !== undefined &&
            existingMessageCAIndex !== -1
          ) {
            pushAction[pushActionType][existingMessageCAIndex] =
              messageUpdatedCA;
          } else {
            pushAction[pushActionType] = [
              ...(pushAction?.[pushActionType] || []),
              messageUpdatedCA,
            ];
          }
        } else if (pushAction[pushActionType]) {
          pushAction[pushActionType] = pushAction?.[pushActionType].filter(
            (m) => m.id !== message_id
          );
        }
      }
    }

    // DELETE
    else {
      // check if in instert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(message_id)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          message_id
        ) as string[];
      } else {
        // check if in udpate and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find((m) => m.id === message_id)
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((m) => m.id === message_id);
        }

        // Add message_id in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          message_id,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },

  prepareCollectionDirectoriesPushAction: (
    directory_id: TId,
    pushActionType: EPushActionType,
    lastDirectory: IRequestFolder,
    directory: IRequestFolder,
    existingPushAction: IPushActionDirectory
  ) => {
    let pushAction: IPushActionDirectory = existingPushAction || {};

    // INSERT
    if (pushActionType === EPushActionType.Insert) {
      pushAction[pushActionType] = _array.uniq([
        ...(pushAction[pushActionType] || []),
        directory_id,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(directory_id)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from directory_id
        let existingDirectoryCAIndex = pushAction?.[pushActionType]?.findIndex(
          (d) => d?.id === directory_id
        );

        let directoryUpdatedCA = pushAction?.[pushActionType]?.[
          existingDirectoryCAIndex
        ] || { id: directory_id };

        for (let key in directory) {
          if (key === EPushActionDirectory_Root.name) {
            // For name and body add in to key '_root'
            if (!equal(directory[key], lastDirectory[key])) {
              directoryUpdatedCA['_root'] = _array.uniq([
                ...(directoryUpdatedCA?.['_root'] || []),
                key,
              ]);
            } else if (directoryUpdatedCA?.['_root']?.includes(key)) {
              // If already exist in push action and having same value then remove from updated push action
              directoryUpdatedCA['_root'] = _array.without(
                directoryUpdatedCA?.['_root'],
                key
              ) as EPushActionDirectory_Root[];
            }
          } else if (key === key) {
            for (let updatedKey in directory[key]) {
              if (
                !equal(
                  directory[key][updatedKey],
                  directory?.[key]?.[updatedKey]
                )
              ) {
                directoryUpdatedCA[key] = _array.uniq([
                  ...(directoryUpdatedCA?.[key] || []),
                  updatedKey,
                ]);
              } else if (directoryUpdatedCA?.[key]?.includes(updatedKey)) {
                // If already exist in push action and having same value then remove from updated push action
                directoryUpdatedCA[key] = _array.without(
                  directoryUpdatedCA[key],
                  updatedKey
                );
              }
            }
          }
        }

        if (_object.size(_object.omit(directoryUpdatedCA, ['id']))) {
          if (
            existingDirectoryCAIndex !== undefined &&
            existingDirectoryCAIndex !== -1
          ) {
            pushAction[pushActionType][existingDirectoryCAIndex] =
              directoryUpdatedCA;
          } else {
            pushAction[pushActionType] = [
              ...(pushAction?.[pushActionType] || []),
              directoryUpdatedCA,
            ];
          }
        } else if (pushAction[pushActionType]) {
          pushAction[pushActionType] = pushAction?.[pushActionType].filter(
            (d) => d.id !== directory_id
          );
        }
      }
    }

    // DELETE
    else {
      // check if in instert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(directory_id)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          directory_id
        ) as string[];
      } else {
        // check if in udpate and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find((d) => d.id === directory_id)
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((d) => d.id === directory_id);
        }

        // Add connection_id in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          directory_id,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },
};

export default PushActionService;
