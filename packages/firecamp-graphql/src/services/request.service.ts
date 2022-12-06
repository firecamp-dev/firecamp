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

import { IGraphQLStoreState, IUi } from '../store';

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
 * normalize the request with all required fields/keys, It'll add missing keys of the request or remove any extra keys if exists.
 */
export const normalizeRequest = (request: Partial<IGraphQL>): IGraphQL => {
  // prepare normalized request aka _nr
  const _nr: IGraphQL = {
    url: { raw: '', queryParams: [], pathParams: [] },
    method: EHttpMethod.POST,
    headers: [],
    __meta: {
      name: '',
      type: ERequestTypes.GraphQL,
      version: '2.0.0',
    },
    __ref: { id: '', collectionId: '' },
  };

  const {
    url = _nr.url,
    method = _nr.method,
    headers = _nr.headers,
    __meta = _nr.__meta,
    __ref = _nr.__ref,
  } = request;

  // console.log({ request });

  //normalize url
  _nr.url = {
    raw: url.raw || '',
    queryParams: url.queryParams || [],
    pathParams: url.pathParams || [],
  };
  if (!_array.isEmpty(_nr.url.queryParams)) {
    const queryParams = [];
    if (!url.queryParams?.length) url.queryParams = [];
    url.queryParams.map((qp) => {
      // add default key: `type: text`
      qp.id = nanoid();
      qp.type = EKeyValueTableRowType.Text;
      qp.value = qp.value || '';
      if (isValidRow(qp)) queryParams.push(qp);
    });
    _nr.url.queryParams = queryParams;
  }
  if (!_array.isEmpty(_nr.url.pathParams)) {
    const pathParams = [];
    if (!url.pathParams?.length) url.pathParams = [];
    url.pathParams.map((pp) => {
      // add default key: `type: text`
      qp.id = nanoid();
      pp.type = EKeyValueTableRowType.Text;
      pp.value = pp.value || '';
      if (isValidRow(pp)) pathParams.push(pp);
    });
    _nr.url.pathParams = pathParams;
  }

  //normalize method
  _nr.method = EHttpMethod[method.toUpperCase()] ? method : EHttpMethod.POST;

  // normalize headers
  _nr.headers = !headers || _array.isEmpty(headers) ? [] : headers;
  _nr.headers = _nr.headers.filter((h) => {
    h.id = nanoid();
    h.type = EKeyValueTableRowType.Text;
    h.value = h.value ? h.value : '';
    return isValidRow(h);
  });

  // normalize __meta
  _nr.__meta.name = __meta.name || 'Untitled Request';
  _nr.__meta.description = __meta.description || '';

  // normalize __ref
  _nr.__ref.id = __ref.id || nanoid();
  _nr.__ref.collectionId = __ref.collectionId;
  _nr.__ref.folderId = __ref.folderId;
  _nr.__ref.createdAt = __ref.createdAt || new Date().valueOf();
  _nr.__ref.updatedAt = __ref.updatedAt || new Date().valueOf();
  _nr.__ref.createdBy = __ref.createdBy || '';
  _nr.__ref.updatedBy = __ref.updatedBy || '';

  return _nr;
};

export const initialiseStoreFromRequest = (
  _request: Partial<IGraphQL>
): IGraphQLStoreState => {
  const request = normalizeRequest(_request);
  const uiState = prepareUiState(_cloneDeep(request));
  // console.log({ request });
  return {
    request,
    playgrounds: {},
    runtime: {
      playgroundTabs: [],
      playgroundsMeta: {},
      activeEnvironments: {
        collection: '',
        workspace: '',
      },
      activePlayground: '',
      isDocOpened: false,
      isFetchingIntrospection: false,
      isRequestSaved: !!request.__ref.collectionId,
      schema: null,
    },
    ui: {
      hasHeaders: false,
      headers: 0,
      isFetchingRequest: false,
      ...uiState,
    },
  };
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
