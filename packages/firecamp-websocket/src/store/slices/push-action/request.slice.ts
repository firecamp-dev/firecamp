import {
  IUrl,
  IWebSocketConfig,
  TId,
  IWebSocketConnection,
  EPushActionType,
} from '@firecamp/types';

import PushActionService from '../../../services/push-actions';

interface IPushActionRequestSlice {
  prepareUrlPushAction?: (lastUrl: IUrl, url: IUrl) => void;
  prepareRequestMetaPushAction?: (lastMeta, meta) => void;
  prepareRequestConfigPushAction?: (
    lastConfig: IWebSocketConfig,
    config: IWebSocketConfig
  ) => void;
  prepareRequestConnectionsPushAction?: (
    id: TId,
    pushActionType: EPushActionType,
    lastConnection: IWebSocketConnection,
    connection: IWebSocketConnection
  ) => void;
}

const createPushActionRequestSlice = (set, get): IPushActionRequestSlice => ({
  prepareUrlPushAction: (lastUrl: IUrl, url: IUrl) => {
    let urlPushAction = PushActionService.prepareUrlPushAction(
      lastUrl,
      url,
      get().pushAction?.request?.url
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          url: urlPushAction,
        },
      },
    }));
  },
  prepareRequestMetaPushAction: (lastMeta, meta) => {
    let metaPushAction = PushActionService.prepareMetaPushAction(
      lastMeta,
      meta,
      get().pushAction?.request?.meta
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          meta: metaPushAction,
        },
      },
    }));
  },
  prepareRequestConfigPushAction: (
    lastConfig: IWebSocketConfig,
    config: IWebSocketConfig
  ) => {
    let configPushAction = PushActionService.prepareMetaPushAction(
      lastConfig,
      config,
      get().pushAction?.request?.meta
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          config: configPushAction,
        },
      },
    }));
  },
  prepareRequestConnectionsPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastConnection: IWebSocketConnection,
    connection: IWebSocketConnection
  ) => {
    let connectionPushAction =
      PushActionService.prepareRequestConnectionsPushAction(
        id,
        pushActionType,
        lastConnection,
        connection,
        get().pushAction?.request?.connections
      );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          connections: connectionPushAction,
        },
      },
    }));
  },
});

export { IPushActionRequestSlice, createPushActionRequestSlice };
