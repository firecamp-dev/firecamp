import {
  IWebSocket,
  ERequestTypes,
  IWebSocketConnection,
  TId,
} from '@firecamp/types';
import { _object, _array, _string } from '@firecamp/utils';
import _url from '@firecamp/url';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { nanoid as id } from 'nanoid';

import {
  initialPlaygroundMessage,
  IStoreState,
  IUiRequestPanel,
} from '../store';
import { DefaultConnectionState, DefaultConfigState } from '../constants';
import { EConnectionState, ERequestPanelTabs } from '../types';

const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

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
    //ws url will only have { raw: ""} but in ui we need actual url object IUrl
    //@ts-ignore
    url: { raw: '', queryParams: [], pathParams: [] },
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
  if (url?.raw) {
    _nr.url.raw = getPathFromUrl(url.raw);
  }

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

export const initialiseStoreFromRequest = (
  _request: Partial<IWebSocket>,
  tabId: TId
): IStoreState => {
  const request: IWebSocket = normalizeRequest(_request);
  const requestPanel = prepareUIRequestPanelState(request);

  const defaultConnection =
    request.connections?.find((c) => c.isDefault === true) ||
    DefaultConnectionState;
  const playgroundId = defaultConnection.id;

  const url = _url.updateByQuery(request.url, defaultConnection.queryParams);
  const displayUrl = url.raw;
  // console.log(url, displayUrl, 'url...');

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
      displayUrl,
      activePlayground: playgroundId,
      playgroundTabs: request.connections.map((c) => {
        return {
          id: c.id,
          name: c.name,
          __meta: {
            isSaved: true,
            hasChange: false,
          },
        };
      }),
      _dnp: {},
      isRequestSaved: !!request.__ref.collectionId,
      tabId,
    },
    ui: {
      // ...state.ui,
      requestPanel: {
        ...requestPanel,
        activeTab: ERequestPanelTabs.Playgrounds, //uiActiveTab,
      },
      isFetchingRequest: false,
    },
    logs: {
      [playgroundId]: [],
    },
  };
};
