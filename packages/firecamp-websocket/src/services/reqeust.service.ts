import {
  IWebSocket,
  ERequestTypes,
  EKeyValueTableRowType,
  IWebSocketConnection,
} from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array, _string } from '@firecamp/utils';
import { isValidRow } from '@firecamp/utils/dist/table';
import { isString } from 'lodash';
import { nanoid as id } from 'nanoid';

import { IUiRequestPanel } from '../store';
import { DefaultConnectionState, DefaultConfigState } from '../constants';

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
export const normalizeRequest = (request: IWebSocket): Promise<IWebSocket> => {
  const _nr: IWebSocket = {
    url: { raw: '' },
    meta: {
      name: '',
      type: ERequestTypes.WebSocket,
      version: '2.0.0',
    },
    _meta: { id: '', collectionId: '' },
  };

  const { meta, _meta, url, connections, config } = request;

  // console.log({ request });

  //normalize url
  _nr.url = !_object.isEmpty(url) ? url : { raw: '' };

  // normalize meta
  _nr.meta.name = meta.name || 'Untitled Request';
  _nr.meta.description = meta.description || '';
  _nr.meta.fOrders = meta.fOrders || [];
  _nr.meta.iOrders = meta.iOrders || [];
  _nr.meta.type = ERequestTypes.WebSocket;
  _nr.meta.version = '2.0.0'; /* ERestRequestVersion.V1; */ // TODO: check version

  // normalize _meta
  _nr._meta.id = _meta?.id || id();
  _nr._meta.collectionId = _meta?.collectionId;
  _nr._meta.folderId = _meta?.folderId;
  _nr._meta.createdAt = _meta?.createdAt || new Date().valueOf();
  _nr._meta.updatedAt = _meta?.updatedAt || new Date().valueOf();
  _nr._meta.createdBy = _meta?.createdBy || '';
  _nr._meta.updatedBy = _meta?.updatedBy || '';

  // normalize _meta
  _nr.connections = [];
  _nr.connections = connections.map(
    (connection: IWebSocketConnection) =>
      _object.mergeDeep(
        DefaultConnectionState,
        connection
      ) as IWebSocketConnection
  );
  if (!_nr.connections?.length) _nr.connections = [DefaultConnectionState];

  console.log(connections, _nr.connections, 789789);

  // normalize config
  _nr.config = _object.mergeDeep(DefaultConfigState, config || {});
  return Promise.resolve(_nr);
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
