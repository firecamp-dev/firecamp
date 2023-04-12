import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { nanoid as id } from 'nanoid';
import {
  TId,
  ERequestTypes,
  ISocketIOConnection,
  ISocketIO,
  ESocketIOClientVersion,
  TRequestPath,
} from '@firecamp/types';
import _url from '@firecamp/url';
import { _object, _array, _string } from '@firecamp/utils';
import {
  RequestConnection,
  DefaultRequestConfig,
  InitPlayground,
} from '../constants';
import { ISocket } from '../store';
import { EConnectionState } from '../types';

/**
 * prepare the connection panel ui state from the existing request/connection information
 * and return the state.
 */
export const prepareConnectionPanelUiState = (request: Partial<ISocketIO>) => {
  const cPanelUi = {
    headers: 0,
    params: 0,
    auth: 0,
  };
  const { url, connection } = request;
  if (connection?.headers) cPanelUi.headers = connection.headers?.length || 0;
  if (connection?.auth) cPanelUi.auth = connection.auth?.length || 0;
  if (url) cPanelUi.params = request.url.queryParms?.length || 0;
  return cPanelUi;
};

const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

/** normalize the socket.io request */
export const normalizeRequest = (request: Partial<ISocketIO>): ISocketIO => {
  const _nr: ISocketIO = {
    //socket.io url will only have { raw: ""} but in ui we need actual url object IUrl
    //@ts-ignore
    url: { raw: '', queryParams: [], pathParams: [] },
    config: {
      rejectUnauthorized: false,
      timeout: 20000,
      reconnection: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      version: ESocketIOClientVersion.v4,
      onConnectListeners: [],
    },
    connection: _cloneDeep(RequestConnection),
    listeners: [],
    __meta: {
      name: '',
      type: ERequestTypes.SocketIO,
      version: '2.0.0',
    },
    __ref: { id: '', collectionId: '' },
  };

  const {
    url,
    connection = _nr.connection,
    listeners,
    config = _nr.config,
    __meta = _nr.__meta,
    __ref = _nr.__ref,
  } = request;

  //normalize url
  //normalize url
  if (url?.raw) {
    _nr.url.raw = getPathFromUrl(url.raw);
  }

  // normalize __meta
  _nr.__meta.name = __meta.name || 'Untitled Request';
  _nr.__meta.description = __meta.description || '';
  _nr.__meta.fOrders = __meta.fOrders || [];
  _nr.__meta.iOrders = __meta.iOrders || [];
  _nr.__meta.type = ERequestTypes.SocketIO;
  _nr.__meta.version = '2.0.0';

  // normalize __ref
  _nr.__ref.id = __ref.id || id();
  _nr.__ref.collectionId = __ref.collectionId;
  _nr.__ref.folderId = __ref.folderId;
  _nr.__ref.createdAt = __ref.createdAt || new Date().valueOf();
  _nr.__ref.updatedAt = __ref.updatedAt || new Date().valueOf();
  _nr.__ref.createdBy = __ref.createdBy || '';
  _nr.__ref.updatedBy = __ref.updatedBy || '';

  // normalize connection
  _nr.connection = {} as ISocketIOConnection;
  _nr.connection = _object.mergeDeep(
    RequestConnection,
    connection
  ) as ISocketIOConnection;
  if (!_nr.connection) _nr.connection = _cloneDeep(RequestConnection);

  // normalize listeners
  if (Array.isArray(listeners)) _nr.listeners = listeners;

  // normalize config
  _nr.config = _object.mergeDeep(DefaultRequestConfig, config);
  return _nr;
};

export const initialiseStoreFromRequest = (
  _request: Partial<ISocketIO>,
  __meta?: {
    tabId?: TId;
    requestPath?: TRequestPath;
  }
): ISocket => {
  const request: ISocketIO = normalizeRequest(_request);
  if (!request.connection) request.connection = _cloneDeep(RequestConnection);
  request.url = _url.updateByQuery(request.url, request.connection.queryParams);

  const cPanelUi = prepareConnectionPanelUiState(request);

  return {
    request,
    runtime: {
      isRequestSaved: !!request.__ref.collectionId,
      tabId: __meta?.tabId,
      requestPath: __meta?.requestPath,
    },
    playground: {
      connectionState: EConnectionState.Ideal,
      logFilters: {
        type: '',
        event: '',
      },
      emitter: InitPlayground,
      selectedEmitterId: '',
      activeListeners: [],
      activeArgIndex: 0,
      playgroundHasChanges: false,
    },
    logs: [],
    ui: {
      isFetchingRequest: false,
      connectionPanel: cPanelUi,
    },
  };
};
