import {
  IWebSocket,
  ERequestTypes,
  IWebSocketConnection,
} from '@firecamp/types';
import { _object, _array, _string } from '@firecamp/utils';
import _url from '@firecamp/url';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { nanoid as id } from 'nanoid';

import {
  initialPlaygroundMessage,
  IUiRequestPanel,
  IWebsocketStoreState,
} from '../store';
import { DefaultConnectionState, DefaultConfigState } from '../constants';
import { EConnectionState, ERequestPanelTabs } from '../types';

export const prepareUIRequestPanelState = (
  request: Partial<IWebSocket>
): IUiRequestPanel => {
  let updatedUiStore: IUiRequestPanel = {};

  // TODO: add logic form collection queries

  for (let key in request) {
    switch (key) {
      default:
      // do nothing
    }
  }
  return updatedUiStore;
};

/** normalize the websocket request */
export const normalizeRequest = (request: Partial<IWebSocket>): IWebSocket => {
  const _nr: IWebSocket = {
    url: { raw: '' },
    connections: [],
    __meta: {
      name: '',
      type: ERequestTypes.WebSocket,
      version: '2.0.0',
    },
    __ref: { id: '', collectionId: '' },
  };

  const {
    url,
    connections = _nr.connections,
    config = {},
    __meta = _nr.__meta,
    __ref = _nr.__ref,
  } = request;

  //normalize url
  _nr.url = !_object.isEmpty(url) ? url : { raw: '' };

  // normalize __meta
  _nr.__meta.name = __meta.name || 'Untitled Request';
  _nr.__meta.description = __meta.description || '';
  _nr.__meta.fOrders = __meta.fOrders || [];
  _nr.__meta.iOrders = __meta.iOrders || [];
  _nr.__meta.type = ERequestTypes.WebSocket;
  _nr.__meta.version = '2.0.0'; /* ERestRequestVersion.V1; */ // TODO: check version

  // normalize __ref
  _nr.__ref.id = __ref.id || id();
  _nr.__ref.collectionId = __ref.collectionId;
  _nr.__ref.folderId = __ref.folderId;
  _nr.__ref.createdAt = __ref.createdAt || new Date().valueOf();
  _nr.__ref.updatedAt = __ref.updatedAt || new Date().valueOf();
  _nr.__ref.createdBy = __ref.createdBy || '';
  _nr.__ref.updatedBy = __ref.updatedBy || '';

  // normalize connections
  _nr.connections = [];
  _nr.connections = connections.map(
    (connection: IWebSocketConnection) =>
      _object.mergeDeep(
        DefaultConnectionState,
        connection
      ) as IWebSocketConnection
  );
  if (!_nr.connections?.length) _nr.connections = [DefaultConnectionState];

  // normalize config
  _nr.config = _object.mergeDeep(DefaultConfigState, config || {});
  return _nr;
};

/**
 * Normalize variables at runtime (on send request)
 * Set and unset variables from scripts response and update variables to platform
 */
export const normalizeVariables = (
  existing: {
    collection?: { [key: string]: any };
    workspace: { [key: string]: any };
  },
  updated: {
    workspace: {
      variables: { [key: string]: any };
      unsetVariables: string[];
      name: string;
      clearEnvironment: boolean;
    };
    collection?: {
      variables: { [key: string]: any };
      unsetVariables: string[];
      name: string;
      clearEnvironment: boolean;
    };
  }
): Promise<{
  collection?: { [key: string]: any };
  workspace: { [key: string]: any };
}> => {
  // updated variables
  let updatedVariables: {
    collection?: { [key: string]: any };
    workspace: { [key: string]: any };
  } = existing;

  ['workspace', 'collection'].forEach((scope) => {
    // if clear environment is true then set variables as empty
    if (updated[scope].clearEnvironment === true) {
      updatedVariables[scope] = {};
    } else {
      // set variables, updated variables
      updatedVariables[scope] = Object.assign(
        updatedVariables[scope],
        updated[scope].variables
      );

      // unset variables, removed variables
      if (updated[scope].unsetVariables) {
        updatedVariables[scope] = _object.omit(
          updatedVariables[scope],
          updated[scope].unsetVariables
        );
      }
    }
  });

  return Promise.resolve(updatedVariables);
};

export const initialiseStoreFromRequest = (
  _request: Partial<IWebSocket>
): IWebsocketStoreState => {
  const request: IWebSocket = normalizeRequest(_request);
  const requestPanel = prepareUIRequestPanelState(request);

  const defaultConnection =
    request.connections?.find((c) => c.isDefault === true) ||
    DefaultConnectionState;
  const playgroundId = defaultConnection.id;

  const url = _url.fetchPathParams(request.url.raw);

  console.log(url, 'url...');

  return {
    request,
    playgrounds: {
      // add logic for init playgrounds by connections
      [playgroundId]: {
        id: playgroundId,
        connectionState: EConnectionState.Ideal,
        logFilters: {
          type: '',
        },
        message: initialPlaygroundMessage,
        selectedCollectionMessage: '',
      },
    },
    runtime: {
      displayUrl: '',
      activePlayground: playgroundId,
      playgroundTabs: request.connections.map((c) => {
        return {
          id: c.id,
          name: c.name,
          meta: {
            isSaved: true,
            hasChange: false,
          },
        };
      }),
      activeEnvironments: {
        workspace: '',
        collection: '',
      },
      _dnp: {},
      isRequestSaved: !!request.__ref.collectionId,
    },
    ui: {
      // ...state.ui,
      requestPanel: {
        ...requestPanel,
        activeTab: ERequestPanelTabs.Playgrounds, //uiActiveTab,
      },
      isFetchingRequest: false,
    },
    connectionsLogs: {
      [playgroundId]: [],
    },
  };
};
