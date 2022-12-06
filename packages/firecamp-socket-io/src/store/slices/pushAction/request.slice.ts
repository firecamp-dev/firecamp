import {
  IUrl,
  ISocketIOConfig,
  TId,
  ISocketIOConnection,
} from '@firecamp/types';

import PushActionService from '../../../services/push-actions';

interface IPushActionRequestSlice {
  prepareUrlPushAction?: (lastUrl: IUrl, url: IUrl) => void;
  prepareRequestMetaPushAction?: (lastMeta, __meta) => void;
  prepareRequestConfigPushAction?: (
    lastConfig: ISocketIOConfig,
    config: ISocketIOConfig
  ) => void;
  prepareRequestConnectionsPushAction?: (
    id: TId,
    pushActionType: string,
    lastConnection: ISocketIOConnection,
    connection: ISocketIOConnection
  ) => void;
  prepareRootPushAction: (last_root, _root) => void;
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
  prepareRequestMetaPushAction: (lastMeta, __meta) => {
    let metaPushAction = PushActionService.prepareMetaPushAction(
      lastMeta,
      __meta,
      get().pushAction?.request?.__meta
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          __meta: metaPushAction,
        },
      },
    }));
  },
  prepareRequestConfigPushAction: (
    lastConfig: ISocketIOConfig,
    config: ISocketIOConfig
  ) => {
    let configPushAction = PushActionService.prepareMetaPushAction(
      lastConfig,
      config,
      get().pushAction?.request?.__meta
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
    pushActionType: string,
    lastConnection: ISocketIOConnection,
    connection: ISocketIOConnection
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
  prepareRootPushAction: (last_root, _root) => {
    let metaPushAction = PushActionService.prepareRootPushAction(
      last_root,
      _root,
      get().pushAction?.request?._root
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        request: {
          ...s.pushAction.request,
          _root: metaPushAction,
        },
      },
    }));
  },
});

export { IPushActionRequestSlice, createPushActionRequestSlice };
