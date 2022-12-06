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
  EPushActionRootKeys,
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
    existingPushAction?: Array<EPushActionRootKeys>
  ) => {
    let pushAction: Array<EPushActionRootKeys> = existingPushAction || [];

    if (!lastRequest || !request) return [];

    Object.keys(request).forEach((key: EPushActionRootKeys) => {
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
        pushAction = _array.without(pushAction, key) as EPushActionRootKeys[];
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
    __ref: any,
    existingPushAction?: Array<EPushAction_metaKeys>
  ) => {
    let pushAction: Array<EPushAction_metaKeys> = existingPushAction || [];
    if (!last_Meta || !__ref) return [];

    Object.keys(__ref).forEach((key: EPushAction_metaKeys) => {
      if (!equal(last_Meta[key], __ref[key])) {
        /**
         * Push __ref key in push action
         * If updated __ref and last_Meta value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key) && equal(last_Meta[key], __ref[key])) {
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
    connectionId: TId,
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
        connectionId,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(connectionId)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from connectionId
        let existingConnectionCAIndex = pushAction?.[pushActionType]?.findIndex(
          (c) => c.id === connectionId
        );

        let connectionUpdatedCA = pushAction?.[pushActionType]?.[
          existingConnectionCAIndex
        ] || { id: connectionId };

        for (let key in connection) {
          if (key === 'headers' || key === 'queryParams') {
            // For headers and queryParams add in to key '_root'
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
            (c) => c.id !== connectionId
          );
        }
      }
    }

    // DELETE
    else {
      // check if in insert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(connectionId)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          connectionId
        ) as string[];
      } else {
        // check if in update and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find((c) => c.id === connectionId)
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((c) => c.id === connectionId);
        }

        // Add connectionId in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          connectionId,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },

  prepareCollectionMessagesPushAction: (
    messageId: TId,
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
        messageId,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(messageId)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from messageId
        let existingMessageCAIndex = pushAction?.[pushActionType]?.findIndex(
          (m) => m?.id === messageId
        );

        let messageUpdatedCA = pushAction?.[pushActionType]?.[
          existingMessageCAIndex
        ] || { id: messageId };

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
            (m) => m.id !== messageId
          );
        }
      }
    }

    // DELETE
    else {
      // check if in insert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(messageId)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          messageId
        ) as string[];
      } else {
        // check if in update and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find((m) => m.id === messageId)
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((m) => m.id === messageId);
        }

        // Add messageId in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          messageId,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },

  prepareCollectionDirectoriesPushAction: (
    directoryId: TId,
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
        directoryId,
      ]);
    }

    // UPDATE
    else if (pushActionType === EPushActionType.Update) {
      if (
        (pushAction[EPushActionType.Insert] &&
          !pushAction[EPushActionType.Insert]?.includes(directoryId)) ||
        !pushAction[EPushActionType.Insert]
      ) {
        // Get existing push action from directoryId
        let existingDirectoryCAIndex = pushAction?.[pushActionType]?.findIndex(
          (d) => d?.id === directoryId
        );

        let directoryUpdatedCA = pushAction?.[pushActionType]?.[
          existingDirectoryCAIndex
        ] || { id: directoryId };

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
            (d) => d.id !== directoryId
          );
        }
      }
    }

    // DELETE
    else {
      // check if in instert and delete both, if true then remove
      if (
        pushAction[EPushActionType.Insert] &&
        pushAction[EPushActionType.Insert]?.includes(directoryId)
      ) {
        pushAction[EPushActionType.Insert] = _array.without(
          pushAction[EPushActionType.Insert],
          directoryId
        ) as string[];
      } else {
        // check if in update and delete both, if true then remove
        if (
          pushAction[EPushActionType.Update] &&
          pushAction[EPushActionType.Update]?.find((d) => d.id === directoryId)
        ) {
          pushAction[EPushActionType.Update] = pushAction[
            EPushActionType.Update
          ].filter((d) => d.id === directoryId);
        }

        // Add connectionId in delete
        pushAction[pushActionType] = _array.uniq([
          ...(pushAction?.[pushActionType] || []),
          directoryId,
        ]);
      }
    }

    // console.log({ pushAction });

    return CleanDeep(pushAction);
  },
};

export default PushActionService;
