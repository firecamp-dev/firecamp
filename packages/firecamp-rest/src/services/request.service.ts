import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import equal from 'deep-equal';
import {
  EAuthTypes,
  ERestBodyTypes,
  IRest,
  EHttpMethod,
  ERequestTypes,
  EKeyValueTableRowType,
  IUiAuth,
  IKeyValueTable,
  EFirecampAgent,
  IAuth,
  TId,
  IRestBody,
} from '@firecamp/types';
import {
  _object,
  _array,
  _string,
  _auth,
  _misc,
  _table,
} from '@firecamp/utils';
import { isValidRow } from '@firecamp/utils/dist/table';
import { IRestStoreState, IUiRequestPanel } from '../store';
import { ERequestPanelTabs, IRestClientRequest } from '../types';
import { configState, bodyState } from '../constants';
import { IAuthHeader } from './auth/types';
import { Auth } from '.';

export const prepareUIRequestPanelState = (
  request: Partial<IRestClientRequest>
): IUiRequestPanel => {
  let updatedUiStore: IUiRequestPanel = {};

  for (let key in request) {
    switch (key) {
      case 'auth':
        if (request.auth?.type) {
          updatedUiStore = {
            ...updatedUiStore,
            hasAuth: true,
          };
        }
        break;
      case 'body':
        if (request.body?.type) {
          updatedUiStore = {
            ...updatedUiStore,
            hasBody: true,
          };
        }
        break;
      case 'headers':
        let headers = request?.headers.length;
        updatedUiStore = {
          ...updatedUiStore,
          // activeTab: ERequestPanelTabs.Headers,
          headers,
          hasHeaders: headers !== 0,
        };
        break;
      case 'url':
        if (request['url']?.queryParams || request['url']?.pathParams) {
          let queryParamsLength = request?.url?.queryParams?.length || 0;
          let pathParamsLength = request?.url?.pathParams?.length || 0;
          updatedUiStore = {
            ...updatedUiStore,
            // activeTab: ERequestPanelTabs.Params,
            params: queryParamsLength + pathParamsLength,
            hasParams: queryParamsLength !== 0 || pathParamsLength !== 0,
          };
        }
        break;
      case 'scripts':
        let scripts = request.scripts;
        let hasScripts =
          !!scripts['pre'] || !!scripts['post'] || !!scripts['test'];

        updatedUiStore = {
          ...updatedUiStore,
          // activeTab: ERequestPanelTabs.Scripts,
          hasScripts,
        };
        break;
      case 'config':
        let hasConfig = !equal(request.config, _cloneDeep(configState));
        updatedUiStore = {
          ...updatedUiStore,
          // activeTab: ERequestPanelTabs.Config,
          hasConfig,
        };
        break;
      default:
      // do nothing
    }
  }
  return updatedUiStore;
};

export const isRestBodyEmpty = (body: IRestBody) => {
  return !body?.value || !body?.type;
};

/**
 * normalize the request with all required fields/keys, It'll add missing keys of the request or remove any extra keys if exists.
 */
export const normalizeRequest = (
  request: Partial<IRest>
): IRestClientRequest => {
  // prepare normalized request aka _nr
  const _nr: IRestClientRequest = {
    url: { raw: '', queryParams: [], pathParams: [] },
    method: EHttpMethod.GET,
    __meta: {
      name: '',
      description: '',
      type: ERequestTypes.Rest,
      version: '2.0.0',
    },
    __ref: { id: '', collectionId: '' },
  };

  const {
    url = _nr.url,
    method = _nr.method,
    auth,
    headers,
    config,
    body,
    scripts,
    __meta = _nr.__meta,
    __ref = _nr.__ref,
  } = request;

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
      pp.id = nanoid();
      pp.type = EKeyValueTableRowType.Text;
      pp.value = pp.value || '';
      if (isValidRow(pp)) pathParams.push(pp);
    });
    _nr.url.pathParams = pathParams;
  }

  //normalize method
  _nr.method = EHttpMethod[method.toUpperCase()] ? method : EHttpMethod.GET;

  // normalize auth
  _nr.auth = !_object.isEmpty(auth)
    ? (_auth.normalizeToUi(auth) as IUiAuth)
    : _cloneDeep(_auth.defaultAuthState);

  // normalize headers
  _nr.headers = !headers || _array.isEmpty(headers) ? [] : headers;
  _nr.headers = _nr.headers.filter((h) => {
    // add default key: `type: text`
    h.id = nanoid();
    h.type = EKeyValueTableRowType.Text;
    h.value = h.value ? h.value : '';
    return isValidRow(h);
  });

  // normalize config
  _nr.config = _object.isEmpty(config)
    ? _cloneDeep(configState)
    : _object.mergeDeep(_cloneDeep(configState), config);
  Object.keys(_nr.config).map((key) => {
    // remove extra keys if exists config values
    if (!configState.hasOwnProperty(key)) {
      delete _nr.config[key];
      return;
    }
    if (typeof _nr.config[key] !== typeof configState[key]) {
      _nr.config[key] = configState[key];
    }
  });

  // normalize body
  if (!_object.isEmpty(body)) {
    _nr.body = { value: body.value, type: body.type };
  }
  // _nr.body = _object.isEmpty(body)
  //   ? _cloneDeep(bodyState)
  //   : _object.mergeDeep(_cloneDeep(bodyState), body || {});

  // normalize scripts
  _nr.scripts = {
    pre: scripts?.pre || '',
    post: scripts?.post || '',
    test: scripts?.test || '',
  };

  // normalize __meta
  _nr.__meta.name = __meta.name || 'Untitled Request';
  _nr.__meta.description = __meta.description || '';
  _nr.__meta.version = '2.0.0';
  _nr.__meta.type = ERequestTypes.Rest;
  _nr.__meta.inheritScripts = {
    pre: __meta.inheritScripts?.pre || true,
    post: __meta.inheritScripts?.post || true,
    test: __meta.inheritScripts?.test || true,
  };
  _nr.__meta.inheritedAuth = __meta.inheritedAuth;

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
  _request: Partial<IRest>,
  tabId: TId
): IRestStoreState => {
  const request: IRestClientRequest = normalizeRequest(_request);
  const requestPanel = prepareUIRequestPanelState(_cloneDeep(request));
  // console.log({ request });

  return {
    request,
    ui: {
      isFetchingRequest: false,
      isCodeSnippetOpen: false,
      requestPanel: {
        ...requestPanel,
        activeTab: ERequestPanelTabs.Body,
      },
    },
    runtime: {
      authHeaders: [],
      inherit: {
        auth: {
          active: '',
          payload: {},
          oauth2LastFetchedToken: '',
        },
        script: {
          pre: '',
          post: '',
          test: '',
        },
      },
      activeEnvironments: {
        collection: '',
        workspace: '',
      },
      isRequestSaved: !!request.__ref.collectionId,
      oauth2LastFetchedToken: '',
      tabId,
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

/**
 * Prepare normalize payload for send request.
 */
export const normalizeSendRequestPayload = async (
  request: IRestClientRequest,
  originalRequest: IRestClientRequest
) => {
  let sendRequestPayload: IRest = _object.pick(request, [
    'url',
    'method',
    'config',
    'headers',
    '__meta',
  ]) as IRest;

  try {
    // Send active body payload
    if (!request.body?.type) {
      sendRequestPayload.body = {
        value: request.body.value,
        type: request.body.type,
      };

      if (request.body?.type === ERestBodyTypes.FormData) {
        // add file entry value after parse env. variable in body
        if (!_array.isEmpty(request.body?.value as any[])) {
          sendRequestPayload.body.value = request.body.value.map(
            (item, index) => {
              if (item.type === EKeyValueTableRowType.File) {
                item.value = originalRequest.body.value[index].value;
              }
              return item;
            }
          );
        }
      } else if (
        request.body.type === ERestBodyTypes.Binary &&
        originalRequest.body.value
      ) {
        // handle binary body payload
        let text: string | ArrayBuffer = await readFile(
          originalRequest.body.value
        )
          .then((r) => r)
          .catch((e) => {
            return '';
          });
        sendRequestPayload.body.value = text;
      }
    }

    // Send active auth payload
    if (request.auth?.type !== EAuthTypes.Inherit) {
      sendRequestPayload.auth = {
        value: request.auth.value,
        type: request.auth.type,
      };
    } else if (request.auth?.type === EAuthTypes.Inherit) {
      const inheritedAuth = request.__meta.inheritedAuth;
      if (inheritedAuth) {
        sendRequestPayload.auth = {
          value: inheritedAuth.value,
          type: inheritedAuth.auth,
        };
      }
    }
    sendRequestPayload.__ref = { id: request.__ref.id, collectionId: '' };
    // console.log({ sendRequestPayload });

    //  merge headers and auth headers
    const authHeaders = await getAuthHeaders(request, request.auth?.type);
    const headersAry = _table.objectToTable(authHeaders) || [];
    // console.log({ headersAry, request });

    sendRequestPayload.headers = [...request.headers, ...headersAry];
  } catch (error) {
    console.log({ normalizeSendRequestPayload: error });
  }

  return Promise.resolve(sendRequestPayload);
};

/**
 *  Read binary file return file text
 */
export const readFile = (file): Promise<string | ArrayBuffer> => {
  return new Promise(async (rs, rj) => {
    let reader = new FileReader();
    reader.onload = () => {
      let text: string | ArrayBuffer = reader.result;
      rs(text);
    };
    reader.readAsText(file);
  });
};

export const getAuthHeaders = async (
  request: IRestClientRequest,
  authType?: EAuthTypes
): Promise<{ [key: string]: any } | IAuthHeader> => {
  if (!authType) {
    authType = request.auth.type;
  }
  // console.log({ authType });

  if (!authType) {
    return Promise.resolve({});
  } /* else if (authType === EAuthTypes.Inherit) {
    // TODO: add logic to fetch inherit auth
    // set inherit auth to runtimeSlice.inherit
    // update auth headers by inherit auth
  } */ else {
    let { url, method, body, headers, auth } = request;

    let requestAuth = auth;

    // @ts-ignore
    let inheritedAuth = request.__meta.inheritedAuth;

    if (authType === EAuthTypes.Inherit && inheritedAuth) {
      let normalizedAuth = _auth.normalizeToUi(inheritedAuth.payload);
      requestAuth = {
        value: normalizedAuth[inheritedAuth.type],
        type: inheritedAuth.type,
      };
      authType = inheritedAuth.type;
    }

    if (!auth.type) {
      try {
        let agent =
          _misc.firecampAgent() === EFirecampAgent.Desktop
            ? EFirecampAgent.Desktop
            : EFirecampAgent.Extension;
        const extraParams = {
          url,
          method,
          body,
          agent,
          headers,
        };

        // console.log({ extraParams, requestAuth });

        let authServicePayload = requestAuth[authType];
        // console.log({ authServicePayload });

        // manage OAuth2 payload
        if (auth?.type === EAuthTypes.OAuth2) {
          const oAuth2 = requestAuth[EAuthTypes.OAuth2];
          const activeGrantType = oAuth2.activeGrantType;
          const activeGrantTypePayload = oAuth2.grantTypes[activeGrantType];
          authServicePayload = activeGrantTypePayload;
        }

        const authService = new Auth(
          authType || auth.type,
          authServicePayload,
          extraParams
        );
        await authService.authorize();
        const authHeaders = await authService.getHeader();

        // if OAuth2 then set headers with prefix Bearer and set to token
        if (authType === EAuthTypes.OAuth2 && authHeaders['Authorization']) {
          authHeaders[
            'Authorization'
          ] = `Bearer ${authHeaders['Authorization']}`;
          return Promise.resolve(authHeaders['Authorization']);
        }

        // prepare auth headers array
        return Promise.resolve(authHeaders);
      } catch (error) {
        console.info({
          API: 'rest get auth headers',
          error,
        });
        return Promise.reject({});
      }
    }
  }
  return Promise.reject({});
};
