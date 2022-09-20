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
} from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  _object,
  _array,
  _string,
  _auth,
  _misc,
  _table,
} from '@firecamp/utils';
import { isValidRow } from '@firecamp/utils/dist/table';
import { nanoid } from 'nanoid';
import equal from 'deep-equal';

import { configState, bodyState } from '../../constants';
import { IUiRequestPanel } from '../../store';
import { IRestClientRequest } from '../../types';
import { Auth } from '..';
import { IAuthHeader } from '../auth/types';

export const prepareUIRequestPanelState = (
  request: Partial<IRestClientRequest>
): IUiRequestPanel => {
  let updatedUiStore: IUiRequestPanel = {};

  for (let key in request) {
    switch (key) {
      case 'auth':
        /*  
      TODO: check usecase
     
     let hasAuth = !_object.isEmpty(
        _cleanDeep(_cloneDeep(request.auth))
      ); */
        break;
      case 'body':
        /* 
      TODO: check usecase
      
      let hasBody = !(
        isRestBodyEmpty(_cloneDeep(request.body))?.isEmpty || false
      ); */
        break;
      case 'meta':
        if (request.meta.active_body_type) {
          updatedUiStore = {
            ...updatedUiStore,
            hasBody: request.meta.active_body_type !== ERestBodyTypes.NoBody,
          };
        }

        if (request.meta.active_auth_type) {
          updatedUiStore = {
            ...updatedUiStore,
            hasAuth: request.meta.active_auth_type !== EAuthTypes.NoAuth,
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
        if (request['url']?.query_params || request['url']?.path_params) {
          let queryParamsLength = request?.url?.query_params?.length || 0;
          let pathParamsLength = request?.url?.path_params?.length || 0;
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

export const isRestBodyEmpty = (bodies: { [key: string]: any }) => {
  if (!bodies) return { isEmpty: true };

  let body = {};
  for (let key in bodies) {
    body[key] =
      key !== ERestBodyTypes.NoBody
        ? _string.isString(bodies[key]['value'])
          ? _string.isEmpty(bodies[key]['value'])
          : _array.isEmpty(bodies[key]['value'])
        : true;
  }

  let isBodyEmpty = !Object.values(body).includes(false);
  return isBodyEmpty
    ? { isEmpty: true }
    : Object.assign(body, { isEmpty: false });
};

/**
 * normalise the request with all required fields/keys, It'll add missing keys of the request or remove any extra keys if exists.
 */
export const normalizeRequest = (
  request: Partial<IRest>,
  isSaved: boolean = true
): Promise<IRestClientRequest> => {
  // prepare normalised request aka _nr
  const _nr: IRestClientRequest = {
    meta: {
      name: '',
      description: '',
      type: ERequestTypes.Rest,
      version: '2.0.0' /* ERestRequestVersion.V1; */, // TODO: check version
      active_body_type: ERestBodyTypes.NoBody,
      active_auth_type: EAuthTypes.NoAuth,
    },
    method: EHttpMethod.GET,
    _meta: { id: '', collection_id: '' },
  };

  const { url, method, auth, headers, config, body, scripts, meta, _meta } =
    request;

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
  _nr.method = EHttpMethod[method.toUpperCase()] ? method : EHttpMethod.GET;

  // normalise auth
  _nr.auth = !_object.isEmpty(auth)
    ? (_auth.normalizeToUi(auth) as IUiAuth)
    : _cloneDeep(_auth.defaultAuthState);

  // normalise headers
  _nr.headers = !headers || _array.isEmpty(headers) ? [] : headers;
  _nr.headers = _nr.headers.filter((h) => {
    // add default key: `type: text`
    h.type = EKeyValueTableRowType.Text;
    h.value = h.value ? h.value : '';
    return isValidRow(h);
  });

  // normalise config
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

  // normalise body
  _nr.body = _object.isEmpty(body)
    ? _cloneDeep(bodyState)
    : _object.mergeDeep(_cloneDeep(bodyState), body || {});

  // normalise scripts
  _nr.scripts = {
    pre: scripts?.pre || '',
    post: scripts?.post || '',
    test: scripts?.test || '',
  };

  // normalise meta
  _nr.meta.name = meta.name || 'Untitled Request';
  _nr.meta.description = meta.description || '';
  _nr.meta.active_body_type = meta.active_body_type || ERestBodyTypes.NoBody;
  _nr.meta.active_auth_type = meta.active_auth_type || EAuthTypes.NoAuth;
  _nr.meta.version = '2.0.0'; /* ERestRequestVersion.V1; */ // TODO: check version
  _nr.meta.inherit_scripts = {
    pre: meta?.inherit_scripts?.pre || true,
    post: meta?.inherit_scripts?.post || true,
    test: meta?.inherit_scripts?.test || true,
  };
  _nr.meta.inherited_auth = meta.inherited_auth;

  // normalise _meta
  _nr._meta.id = _meta?.id || nanoid();
  _nr._meta.collection_id = _meta?.collection_id;
  _nr._meta.folder_id = _meta?.folder_id;
  _nr._meta.created_at = _meta?.created_at || new Date().valueOf();
  _nr._meta.updated_at = _meta?.updated_at || new Date().valueOf();
  _nr._meta.created_by = _meta?.created_by || '';
  _nr._meta.updated_by = _meta?.updated_by || '';

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
    'meta',
  ]) as IRest;

  try {
    // Send active body payload
    if (request.meta.active_body_type !== ERestBodyTypes.NoBody) {
      sendRequestPayload.body = {
        [request.meta.active_body_type]:
          request.body[request.meta.active_body_type],
      };

      if (request.meta.active_body_type === ERestBodyTypes.FormData) {
        // Add file entry value after parse env. variable in body
        if (
          !_array.isEmpty(request.body?.[request.meta.active_body_type]?.value)
        ) {
          sendRequestPayload.body[request.meta.active_body_type].value =
            request.body[request.meta.active_body_type].value.map(
              (item, index) => {
                if (item.type === EKeyValueTableRowType.File) {
                  item.value =
                    originalRequest.body[request.meta.active_body_type].value[
                      index
                    ].value;
                }
                return item;
              }
            );
        }
      } else if (
        request.meta.active_body_type === ERestBodyTypes.Binary &&
        originalRequest.body[request.meta.active_body_type].value
      ) {
        // handle binary body paylaod
        let text: string | ArrayBuffer = await readFile(
          originalRequest.body[request.meta.active_body_type].value
        )
          .then((r) => r)
          .catch((e) => {
            return '';
          });
        sendRequestPayload.body[request.meta.active_body_type].value = text;
      }
    }

    // Send active auth payload
    if (
      request.meta.active_auth_type !== EAuthTypes.NoAuth &&
      request.meta.active_auth_type !== EAuthTypes.Inherit
    ) {
      sendRequestPayload.auth = {
        [request.meta.active_auth_type]:
          request.auth[request.meta.active_auth_type],
      };
    } else if (request.meta.active_auth_type === EAuthTypes.Inherit) {
      let inheritd_auth = request.meta.inherited_auth;
      if (inheritd_auth) {
        sendRequestPayload.auth = {
          [inheritd_auth.auth]: inheritd_auth.payload,
        };
      }
    }
    sendRequestPayload._meta = { id: request._meta.id, collection_id: '' };
    // console.log({ sendRequestPayload });

    //  Merge headers and auth headers
    let authHeaders = await getAuthHeaders(
      request,
      request.meta.active_auth_type
    );
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

/**
 * normalise rest client request 'IRestClientRequest' to rest request 'IRest'
 * Set empty string for file object
 *    - Binary body
 *    - Multipart FormData body
 */
export const normalizePushPaylaod = async (
  request: Partial<IRestClientRequest>,
  _removed?: {
    body?: Array<ERestBodyTypes>;
    auth?: Array<EAuthTypes>;
  }
): Promise<Partial<IRest>> => {
  let pushRequestPayload: Partial<IRest> = {};

  try {
    // console.log({ request });

    for (let key in request) {
      if (key === 'auth') {
        // Manage auth payload
        let authToNormalise = {};

        for (let authType in request.auth) {
          if (
            !equal(request.auth[authType], _auth.defaultAuthState[authType]) ||
            (_removed &&
              _removed.auth &&
              _removed.auth.hasOwnProperty(authType))
          ) {
            authToNormalise[authType] = request.auth[authType];
          }
        }

        if (!_object.isEmpty(authToNormalise)) {
          pushRequestPayload['auth'] = _auth.normalise(authToNormalise);
        }
      } else if (key === 'body') {
        let isBodyEmpty = isRestBodyEmpty(request.body);
        // console.log({ isBodyEmpty });
        if (isBodyEmpty.isEmpty !== true) {
          // Manage body payload
          pushRequestPayload['body'] = {};
          for (let bodyType in request.body) {
            if (
              isBodyEmpty[bodyType] !== true ||
              (_removed &&
                _removed.body &&
                _removed.body.hasOwnProperty(bodyType))
            ) {
              pushRequestPayload['body'][bodyType] = {};

              if (bodyType === ERestBodyTypes.Binary) {
                // set empty string for binary body

                pushRequestPayload['body'][bodyType] = {
                  ...request['body'][bodyType],
                  value: '',
                };
              } else if (
                bodyType === ERestBodyTypes.FormData &&
                !_array.isEmpty(request['body'][bodyType].value)
              ) {
                // set empty string for file type input

                let multipartValue = request.body[bodyType].value.map(
                  (multipartRow: IKeyValueTable) => {
                    if (multipartRow.type === EKeyValueTableRowType.File) {
                      multipartRow.value = '';
                    }
                    return multipartRow;
                  }
                );

                pushRequestPayload['body'][bodyType] = {
                  ...request['body'][bodyType],
                  value: multipartValue,
                };
              } else {
                pushRequestPayload['body'][bodyType] = request.body[bodyType];
              }
            }
          }
        }
      } else {
        pushRequestPayload[key] = request[key];
      }
    }
  } catch (e) {
    console.log({ e });
  }

  console.log({ pushRequestPayload });
  return Promise.resolve(pushRequestPayload);
};

export const getAuthHeaders = async (
  request: IRestClientRequest,
  authType?: EAuthTypes
): Promise<{ [key: string]: any } | IAuthHeader> => {
  if (!authType) {
    authType = request.meta?.active_auth_type;
  }
  // console.log({ authType });

  if (authType === EAuthTypes.NoAuth) {
    return Promise.resolve({});
  } /* else if (authType === EAuthTypes.Inherit) {
    // TODO: add logic to fetch inherit auth
    // set inherit auth to runtimeSlice.inherit
    // update auth headers by inherit auth
  } */ else {
    let { url, method, body, headers, auth, meta } = request;

    let requestAuth = auth;

    // @ts-ignore
    let inheritd_auth = request.meta.inherited_auth;

    if (authType === EAuthTypes.Inherit && inheritd_auth) {
      let normalizedAuth = _auth.normalizeToUi(inheritd_auth.payload);
      requestAuth = {
        [inheritd_auth.type]: normalizedAuth[inheritd_auth.type],
      };
      authType = inheritd_auth.type;
    }

    if (meta?.active_auth_type !== EAuthTypes.NoAuth) {
      try {
        let agent =
          _misc.firecampAgent() === EFirecampAgent.desktop
            ? EFirecampAgent.desktop
            : EFirecampAgent.extension;
        let extraParams = {
          url,
          method,
          body,
          agent,
          headers,
          authType: authType || meta.active_auth_type,
        };

        // console.log({ extraParams, requestAuth });

        let authServicePayload = requestAuth?.[authType];
        // console.log({ authServicePayload });

        // debugger;u
        // manage OAuth2 payload
        if (meta?.active_auth_type === EAuthTypes.OAuth2) {
          let oAuth2 = requestAuth[EAuthTypes.OAuth2];
          let activeGrantType = oAuth2.active_grant_type;
          let activeGrantTypePayload = oAuth2.grant_types[activeGrantType];
          authServicePayload = activeGrantTypePayload;
        }

        const authService = new Auth(authServicePayload, extraParams);
        await authService.authorize();
        let authHeaders = await authService.getHeader();

        // If OAuth2 then set headers with prefix Bearer and set to token
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
