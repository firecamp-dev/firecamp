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

import { IUiRequestPanel } from '../../store';
import { defaultConnectionState } from '../../constants/connection';
import { DefaultConfigState } from '../../constants/StatePayloads';

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

export const normalizeRequestPayload = (
  request: IWebSocket,
  isSaved: boolean = true
): Promise<IWebSocket> => {
  let requestPayload: IWebSocket = {
    url: { raw: '' },
    meta: {
      name: '',
      type: ERequestTypes.WebSocket,
      version: '2.0.0',
    },
    _meta: { id: '', collection_id: '' },
  };

  const { meta, _meta, url, connections, config } = request;

  // console.log({ request });

  // Validate _meta
  if (!_object.isEmpty(_meta)) {
    if (!_string.isEmpty(_meta.collection_id) && isSaved) {
      requestPayload['_meta'].collection_id = _meta.collection_id;
    } else if (!isSaved) {
      requestPayload['_meta'].collection_id = '';
    } else {
      return Promise.reject({ error: 'Invalid collection id' });
    }

    // Validate request id
    if (!_string.isEmpty(_meta.id) && isSaved) {
      requestPayload['_meta'].id = _meta.id;
    } else if (!isSaved) {
      requestPayload['_meta'].id = id();
    } else {
      return Promise.reject({ error: 'Invalid Request id' });
    }

    // Validate folder id
    if (!_string.isEmpty(_meta.folder_id))
      requestPayload['_meta'].folder_id = _meta.folder_id;
    else requestPayload['_meta'].folder_id = '';

    requestPayload['_meta'].created_at =
      _meta.created_at; /* || new Date().valueOf(); */
    requestPayload['_meta'].created_by = _meta.created_by || '';

    requestPayload['_meta'].updated_at =
      _meta.updated_at; /* || new Date().valueOf(); */
    requestPayload['_meta'].updated_by = _meta.updated_by || '';
  } else return Promise.reject({ error: 'Invalid request' });

  // Validate meta
  if (!_object.isEmpty(meta)) {
    // Validate request name
    if (!_string.isEmpty(meta.name)) requestPayload['meta'].name = meta.name;
    else requestPayload['meta'].name = 'Untitled Request';

    // Validate request description
    if (isString(meta.description))
      requestPayload['meta'].description = meta.description;
    else requestPayload['meta'].description = '';

    // Validate request type
    if (!_string.isEmpty(meta.type)) requestPayload['meta'].type = meta.type;
    else requestPayload['meta'].type = ERequestTypes.WebSocket;

    // Validate request version
    if (!_string.isEmpty(meta.version))
      requestPayload['meta'].version = meta.version;
    else requestPayload['meta'].version = '2.0.0'; /* ERestRequestVersion.V1; */ // TODO: check version

    // Validate orders
    if (meta.dir_orders) {
      requestPayload['meta'].dir_orders = meta.dir_orders;
    } else requestPayload['meta'].dir_orders = [];

    if (meta.dir_orders) {
      requestPayload['meta'].leaf_orders = meta.leaf_orders;
    } else requestPayload['meta'].leaf_orders = [];
  } else return Promise.reject({ error: 'Invalid request' });

  // Validate URL or Convert to Object if receive string
  if (url) {
    if (!_object.isEmpty(url)) {
      requestPayload['url'] = url;
    } else requestPayload['url'] = { raw: '' };

    // Validate and Add query params
    if (!_array.isEmpty(url.query_params)) {
      const queryParams = [];

      url.query_params.map((queryParam) => {
        // Add default key: `type: text`
        queryParam.type = EKeyValueTableRowType.Text;
        queryParam.value = queryParam.value ? queryParam.value : '';

        if (isValidRow(queryParam)) queryParams.push(queryParam);
      });

      requestPayload['url'].query_params = queryParams;
    }
  } else requestPayload['url'] = { raw: '', query_params: [] };

  // Validate connection payload
  if (connections) {
    requestPayload['connections'] = connections.map(
      (connection: IWebSocketConnection) =>
        _object.mergeDeep(
          defaultConnectionState,
          connection
        ) as IWebSocketConnection
    );
  } else {
    requestPayload['connections'] = [defaultConnectionState];
  }

  // Validate config
  if (config) {
    requestPayload['config'] = _object.mergeDeep(
      DefaultConfigState,
      request['config']
    );
  } else {
    requestPayload['config'] = DefaultConfigState;
  }

  // console.log({ requestPayload });

  return Promise.resolve(requestPayload);
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
