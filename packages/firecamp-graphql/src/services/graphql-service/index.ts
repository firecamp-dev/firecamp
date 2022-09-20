import {
  IGraphQL,
  EHttpMethod,
  ERequestTypes,
  EKeyValueTableRowType,
} from '@firecamp/types';
import { nanoid } from 'nanoid';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array, _string } from '@firecamp/utils';
import { isValidRow } from '@firecamp/utils/dist/table';

import { IUi } from '../../store';

/** prepare Ui state for the request tab from given partial request */
export const prepareUiState = (request: Partial<IGraphQL>): Partial<IUi> => {
  let updatedUiStore: Partial<IUi> = {};
  if (request.headers) {
    const headers: number = request?.headers.length;
    updatedUiStore = {
      ...updatedUiStore,
      headers,
      hasHeaders: !!headers,
    };
  }

  return updatedUiStore;
};

/**
 * normalise the request with all required fields/keys, It'll add missing keys of the request or remove any extra keys if exists.
 */
export const normalizeRequest = (
  request: IGraphQL,
  isRequestSaved: boolean = true
): Promise<IGraphQL> => {
  // prepare normalised request aka _nr
  const _nr: IGraphQL = {
    meta: {
      name: '',
      type: ERequestTypes.GraphQL,
      version: '2.0.0' /* ERestRequestVersion.V1; */, // TODO: check version
    },
    method: EHttpMethod.POST,
    _meta: { id: '', collection_id: '' },
  };

  const { url, method, headers, meta, _meta } = request;

  // console.log({ request });

  //normalise url
  _nr.url = !_object.isEmpty(url)
    ? url
    : { raw: '', query_params: [], path_params: [] };
  if (!_array.isEmpty(_nr.url.query_params)) {
    const queryParams = [];
    const pathParams = [];
    if (!url?.query_params?.length) url.query_params = [];
    if (!url?.path_params?.length) url.path_params = [];
    url.query_params.map((qp) => {
      // add default key: `type: text`
      qp.type = EKeyValueTableRowType.Text;
      qp.value = qp.value ? qp.value : '';
      if (isValidRow(qp)) queryParams.push(qp);
    });
    _nr.url.query_params = queryParams;

    url.path_params.map((pp) => {
      // add default key: `type: text`
      pp.type = EKeyValueTableRowType.Text;
      pp.value = pp.value ? pp.value : '';
      if (isValidRow(pp)) pathParams.push(pp);
    });
    _nr.url.path_params = pathParams;
  }

  //normalise method
  _nr.method = EHttpMethod[method.toUpperCase()] ? method : EHttpMethod.POST;

  // normalise headers
  _nr.headers = !headers || _array.isEmpty(headers) ? [] : headers;
  _nr.headers = _nr.headers.filter((h) => {
    // add default key: `type: text`
    h.type = EKeyValueTableRowType.Text;
    h.value = h.value ? h.value : '';
    return isValidRow(h);
  });

  // normalise meta
  _nr.meta.name = meta.name || 'Untitled Request';
  _nr.meta.description = meta.description || '';

  // normalise _meta
  _nr._meta.id = _meta?.id || nanoid();
  _nr._meta.collection_id = _meta?.collection_id;
  _nr._meta.folder_id = _meta?.folder_id;
  _nr._meta.created_at = _meta?.created_at || new Date().valueOf();
  _nr._meta.updated_at = _meta?.updated_at || new Date().valueOf();
  _nr._meta.created_by = _meta?.created_by || '';
  _nr._meta.updated_by = _meta?.updated_by || '';

  if (isRequestSaved === true && (!_nr._meta.id || !_nr._meta.collection_id))
    return Promise.reject('The request payload is invalid');

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
