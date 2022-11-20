import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Container, Row, RootContainer } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import Executor from '@firecamp/ws-executor/dist/esm';
import create from 'zustand';
import _url from '@firecamp/url';

import { ConfigGenerator } from '../services/reqeust.service';
import URLbar from './common/urlbar/URLbar';
import '../sass/ws.sass';
import Request from './request/Request';
import Response from './response/Response';
import { ACTIONS, reducer } from './reducer';
import Emitter from './common/Emitter';
import { WebsocketContext } from './WebSocket.context';
import {
  REQUEST_CONNECTION,
  RESPONSE_CONNECTION,
  INIT_LOG,
} from '../constants/StatePayloads';
import {
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
  EMessagePayloadTypes,
  ON_CHANGE_ACTIONS,
  STRINGS,
  SYSTEM_MESSAGES,
  PANEL,
  CONFIG,
  ConnectionStatus,
  ELogTypes,
  LogColors,
} from '../constants';
import { _array, _env, _file, _misc, _object, _table } from '@firecamp/utils';
import { EFirecampAgent, ERequestTypes } from '@firecamp/types';

export const CLIENT_ACTIONS = {
  CLIENT_ACTIONS: 'CLIENT_ACTIONS',
  OPEN_CODE_SNIPPET: 'OPEN_CODE_SNIPPET',
  OPEN_COLLECTION: 'OPEN_COLLECTION',
};
export const CONSTS = {
  ON_CHANGE_ACTIONS,
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
  CONFIG,
};

const { ADD, UPDATE, DELETE, SET } = ACTIONS;

let defaultConnectionId = id();

const _getInitResConnections = (connections) => {
  let initResConn = {};
  connections.map((conn) => {
    initResConn = Object.assign({}, initResConn, {
      [conn.id]: Object.assign({}, RESPONSE_CONNECTION, {
        id: conn.id,
        name: conn.name || '',
      }),
    });
  });
  return initResConn;
};

const Websocket = ({
  firecampFunctions = {},
  constants: propConstants = {},
  tabData = {},
  sslManager = [],
  proxyManager = [],
  environments = {},
  activeEnvs = {},

  request: prop_request = {},
  collection: prop_collection = [],
  additionalComponents: prop_additionalComponents = {},
  onChange: propOnChange = () => {},
  onSave: propOnSave = () => {},
  onUpdate: propsOnUpdateRequest = () => {},
  onSendMessage: propOnSendMessage = () => {},
  onUpdateEnvironment = () => {},
  onAddCookies: propsOnAddCookies = () => {},
  updateCacheTab = () => {},
}) => {
  const prop_STRINGS = {
    URL:
      propConstants.STRINGS && propConstants.STRINGS.URL
        ? propConstants.STRINGS.URL
        : {
            AUTH: 'auth',
            HASH: 'hash',
            HOST: 'host',
            HOSTNAME: 'hostname',
            HREF: 'href',
            ORIGIN: 'origin',
            PASSWORD: 'password',
            PATHNAME: 'pathname',
            PATH: 'path', //considered pathname as path in new version of URL
            PORT: 'port',
            PROTOCOL: 'protocol',
            QUERY_PARAMS: 'query_params', //URL object is having query as key but in FC there will be query_params key to maintain URL structure
            SLASHES: 'slashes',
            USERNAME: 'username',
            VARIABLES: 'variables',
          },
  };

  defaultConnectionId =
    prop_request &&
    prop_request.meta &&
    prop_request._dnp.runtime_active_connection
      ? prop_request._dnp.runtime_active_connection
      : defaultConnectionId;

  let initResConnections =
    prop_request && prop_request.connections
      ? _getInitResConnections(prop_request.connections)
      : {};

  let initMessage = {};
  if (
    prop_request &&
    prop_request._dnp &&
    prop_request._dnp.active_message &&
    prop_collection &&
    prop_collection.messages
  ) {
    let foundMessage = prop_collection.messages.find(
      (msg) => msg._meta.id === prop_request._dnp.active_message
    );
    if (foundMessage) {
      initMessage = {
        name: foundMessage.name || '',
        message: foundMessage.body || '',
        envelope: foundMessage.meta.envelope || '',
        type: foundMessage.meta.type || EMessagePayloadTypes.no_body,
        path: '', //TODO: add original path
      };
    }
    // _cacheMessagesFns.add(foundMessage);
  }
  // console.log(`defaultConnectionId`, defaultConnectionId);
  // console.log(`prop_request`, prop_request);

  let initialState = {
    request: _object.mergeDeep(
      {
        raw_url: '',
        url: {},
        config: {
          [CONFIG.PROTOCOLS]: [],
          [CONFIG.RECONNECT]: false,
          [CONFIG.RECONNECT_ATTEMPTS]: 3,
          [CONFIG.RECONNECT_TIMEOUT]: 3000,
          [CONFIG.REJECT_UNAUTHORIZED]: false,
          [CONFIG.FOLLOW_REDIRECTS]: true,
          [CONFIG.HANDSHAKE_TIMEOUT]: 3000, //ms
          [CONFIG.MAX_REDIRECTS]: 10,
          [CONFIG.PROTOCOL_VERSION]: 13,
          [CONFIG.ORIGIN]: '',
          [CONFIG.MAX_PAYLOAD]: '', //bytes
        },
        scripts: {
          pre: '',
          post: '',
          test: '',
        },
        connections: [
          /* {
            id: defaultConnectionId,
            name: "Default",
            is_default: true,
            headers:
              [
                {
                  id: id(),
                  key: "Sec-WebSocket-Extensions",
                  value: "",
                  type: "text",
                  disable: true
                },
                {
                  id: id(),
                  key: "Sec-WebSocket-Protocol",
                  value: "",
                  type: "text",
                  disable: true
                },
                {
                  id: id(),
                  key: "Sec-WebSocket-Version",
                  value: "13",
                  type: "text",
                  disable: false
                }
              ] || [],
            query_params: [],
            config: {
              ping: false,
              ping_interval: 3000
            }
            // auth: {},
            // active_auth_type: ""
          } */
        ],
        message: {
          type: EMessagePayloadTypes.no_body,
          message: '',
          envelope: '',
          path: '',
          ...initMessage,
        },
        meta: {
          ['dir_orders']: [],
          ['leaf_orders']: [],
          version: '2.0',
          ...(prop_request.meta || {}),
        },
        _dnp: {
          // active_message: "",
          // runtime_active_connection: defaultConnectionId
        },
      },
      { ...prop_request },
      false,
      {
        arrayMerge: (da, sa, o) => {
          let result = [];
          result = _table.mergeTablesByKey('id', da, sa) || [];
          if (!result.length) {
            result = _table.mergeTablesByKey('id', da, sa) || [];
            if (!result.length) {
              result = sa; //source array
            }
          }
          return result || [];
        },
      }
    ),
    collection: _object.mergeDeep(
      {
        messages: [],
        directories: [],
      },
      { ...prop_collection },
      false
    ),
    revision: 1,
  };
  const initialZustandState = {
    collectionMessagesCache: new Map(),
    connections: new Map(),
    resActiveConn: '',
    connectionLogs: new Map(),
  };

  let { current: emitterRef } = useRef(new Emitter()); //TODO: remove later

  let { current: WSInstances_Ref } = useRef(new Map());
  let envSnippetsMeta_ref = useRef({});
  let state_Ref = useRef({});

  let [state, setState] = useReducer(reducer, initialState);
  let [visiblePanel, setVisiblePanel] = useState(PANEL.REQUEST);

  let [store_client] = useState(() => create(() => initialZustandState));

  let { request, collection } = state;

  // console.log(`request ws client`, prop_request);

  let {
    url,
    raw_url,
    config,
    meta,
    connections: req_connections,
    _dnp: { runtime_active_connection },
  } = request;

  useEffect(() => {
    if (
      prop_request &&
      prop_request._dnp &&
      prop_request._dnp.active_message &&
      prop_collection &&
      prop_collection.messages
    ) {
      let foundMessage = prop_collection.messages.find(
        (msg) => msg._meta.id === prop_request._dnp.active_message
      );
      if (foundMessage) {
        _cacheMessagesFns.add(foundMessage);
      }
    }

    if (initResConnections) {
      for (let key in initResConnections) {
        _responseConnectionFns.add(key, initResConnections[key]);
      }
    }

    _storeClientFns.updateResActiveConn(runtime_active_connection);
    firecampFunctions?.reactGA?.pageview?.('websocket');

    return async () => {
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.clear();
        return { connections: new Map([...resConnectionList]) };
      });

      store_client.setState((state) => {
        let messagesList = state.connectionLogs || new Map();
        messagesList.clear();
        return { connectionLogs: new Map([...messagesList]) };
      });

      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        collectionMessages.clear();
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });

      if (req_connections) {
        req_connections.map(async (conn) => {
          if (conn.id) {
            let connToClose = WSInstances_Ref.get(conn.id);
            if (
              connToClose &&
              (connToClose.connected() ||
                connToClose.readyState() === EConnectionState.Connecting)
            ) {
              await connToClose.close(1000);
            }
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      _cacheMessagesFns.clearAll();
    };
  }, []);

  useEffect(() => {
    let found = req_connections.find(
      (c) => c.id === runtime_active_connection
    );
    if (!found) return;

    /**
     * Update url on change active_connction as query_params updated
     * @type {*}
     */
    let found_params = found[prop_STRINGS.URL.QUERY_PARAMS];

    let urlObject = {
      ...url,
      [prop_STRINGS.URL.QUERY_PARAMS]: found_params,
    };
    let new_raw_url = _url.toString(urlObject);

    if (!equal(new_raw_url, raw_url)) {
      _requestFns.updateURL(new_raw_url);
    }
  }, [runtime_active_connection]);

  useEffect(() => {
    // console.log(`environments updated`, environments);
    try {
      envSnippetsMeta_ref.current = environments;
      const envVariables = _commonFns.getMergedVariables(environments) || {};

      for (let [connectionId, WE] of WSInstances_Ref) {
        if (!WE || !WE.setEnvVariables) return;
        // console.log(`envVariables`, envVariables);
        WE.setEnvVariables(envVariables || {});
      }
    } catch (e) {}
  }, [
    Object.assign(
      Object.create(Object.getPrototypeOf(environments)),
      environments
    ),
  ]);

  useEffect(() => {
    let statePayload = Object.assign({}, state);
    if (
      tabData &&
      tabData.meta &&
      Object.keys(tabData.meta).includes('revision') &&
      !equal(tabData.meta.revision, state.revision)
    ) {
      let reqData = _object.pick(tabData.request, [
        ...KEYS_ON_SAVE_REQUEST.REQUEST,
        'message',
      ]);

      let propsData = _object.omit(tabData.request, [
        ...KEYS_ON_SAVE_REQUEST.REQUEST,
        'message',
        'collection',
      ]);
      let propCollection = tabData.request.collection;

      let new_req = firecampFunctions.tab.rehydrate(
        state,
        {
          ['request']: reqData,
          ['collection']: propCollection,
          ...propsData,
        },
        ERequestTypes.WebSocket
      );

      // console.log(`new_req`, new_req);

      if (
        new_req.request &&
        new_req.request.url &&
        typeof new_req.request.url === 'string'
      ) {
        new_req.request = Object.assign({}, new_req.request, {
          url: _url.toObject(new_req.request.url || ''),
          raw_url: new_req.request.url,
        });
      } else if (
        new_req.request.url &&
        typeof new_req.request.url === 'object' &&
        Object.keys(new_req.request.url).length
      ) {
        let url_query_params = [];
        if (new_req.request.connections) {
          let found = new_req.request.connections.find((con) => con.is_default);
          if (found) {
            url_query_params = found[STRINGS.URL.QUERY_PARAMS];
            new_req.request.url[STRINGS.URL.QUERY_PARAMS] = url_query_params;
          }
        }

        new_req.request = Object.assign({}, new_req.request, {
          url: new_req.request.url,
          raw_url: _url.toString(
            _object.mergeDeep({}, new_req.request.url) || {}
          ),
        });
      }

      if (new_req) {
        new_req.request = Object.assign({}, new_req.request, {
          _dnp: {
            ...(new_req.request?._dnp || {}),
            active_message: state?.request?._dnp?.active_message || '',
          },
        });

        statePayload = Object.assign({}, statePayload, new_req, {
          revision: tabData.meta.revision || 1,
        });
      }
    }

    // console.log(`statePayload--->`, statePayload);
    // console.log(`state--->`, state);

    if (
      statePayload &&
      typeof statePayload === 'object' &&
      Object.keys(statePayload).length &&
      !equal(statePayload, state)
    ) {
      setState({ type: SET.STATE, value: statePayload });

      if (
        statePayload.request &&
        statePayload.request.connections &&
        Array.isArray(statePayload.request.connections)
      ) {
        let propConnections = statePayload.request.connections;
        propConnections.map((conn) => {
          let newResConn = Object.assign(
            {},
            {
              id: conn.id,
              name: conn.name || '',
            }
          );
          _responseConnectionFns.update(conn.id, newResConn);
        });
      }
    }
  }, [tabData]);

  useEffect(() => {
    state_Ref.current = state;
    updateCacheTab(state);
  }, [state]);

  /* useEffect(() => {
   console.log("lietening the emitterRef");      
   emitterRef.on(CLIENT_ACTIONS.CLIENT_ACTIONS, t => {
   switch (t) {
   case CLIENT_ACTIONS.OPEN_CODE_SNIPPET:
   _fns.openCodeSnippet();
   break;
   case CLIENT_ACTIONS.OPEN_COLLECTION:
   _fns.openColletion();
   break;
   }
   });

   return () => {
   console.log("unmounting");
   emitterRef.off("*", log);
   };
   }, []);

   let _fns = {
   openCodeSnippet: () => {
   console.log(123);
   },

   openColletion: () => {
   console.log(456);
   }
   };*/

  /**
   * _requestFns: Request functions
   * @type {{updateMessage: ((p1?:*, p2:*)), updateURL: ((p1?:*)), updateConnection: ((p1?:*, p2?:*, p3:*)), addConnection: ((p1?:*, p2?:*)), updateActiveConnection: ((p1?:*))}}
   * @private
   */
  let _requestFns = {
    updateRequest: (key, value) => {
      setState({ type: UPDATE.REQUEST, key, value });
    },

    /**
     * updateMessage: To update message
     * @param key: String// update message key
     * @param value: String// updated value
     */
    updateMessage: (payload) => {
      // console.log(`updateMessage`, key, value);

      if (!payload) return;

      setState({ type: UPDATE.MESSAGE, value: payload });

      // _commonFns.onChange({action: ON_CHANGE_ACTIONS.MESSAGE, payload: {key, value}});
    },

    setMessage: (payload) => {
      if (!payload) return;

      setState({ type: SET.MESSAGE, value: payload });
    },

    /**
     * updateURL: To update URL
     * @param value: String// updated url string
     */
    updateURL: async (value = '', url_obj = {}) => {
      let urlValue = value.trim();

      if (urlValue === raw_url) return;
      let urlObject = _url.toObject(
        urlValue,
        url_obj?.query_params || url.query_params
      );

      await setState({
        type: UPDATE.URL,
        value: {
          url: urlObject || {},
          raw_url: value || '',
        },
      });

      let urlObjectKeys = Object.keys(urlObject);
      if (urlObjectKeys.length) {
        await Promise.all(
          (Object.values(prop_STRINGS.URL) || []).map(async (key, i) => {
            if (
              Object.keys(url).includes(key) &&
              Object.keys(urlObject).includes(key) &&
              !equal(url[key], urlObject[key])
            ) {
              if (
                state_Ref.current &&
                state_Ref.current.request &&
                state_Ref.current.request.connections &&
                key === prop_STRINGS.URL.QUERY_PARAMS
              ) {
                let activeConnPayload = req_connections.find(
                  (conn) => conn.id === runtime_active_connection
                );

                if (
                  activeConnPayload &&
                  !equal(activeConnPayload[key], urlObject[key])
                ) {
                  await _requestFns.updateConnection(
                    runtime_active_connection,
                    {
                      [key]: urlObject[key],
                    },
                    false
                  );
                }
              }
            }
          })
        );
      }

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.URL,
        payload: {
          url: urlObject || {},
          raw_url: value || '',
        },
      });
    },

    /**
     * addConnection: To add new connection
     * @param name: String// new connection name
     * @param connectOnCreate: Boolean// true if you want to connect on create connection
     * @returns {Promise.<void>}
     */
    addConnection: async (name = '', connectOnCreate = true) => {
      if (!name) return;

      let newconnectionId = id();
      let newReqConnection = Object.assign({}, REQUEST_CONNECTION),
        newResConnection = Object.assign({}, RESPONSE_CONNECTION, {
          id: newconnectionId,
          name,
        });

      let defaultConnection = req_connections.find((c) => c.is_default);

      if (!defaultConnection && req_connections && req_connections.length) {
        defaultConnection = req_connections[0];
      }

      let queryParams = defaultConnection[STRINGS.URL.QUERY_PARAMS] || [];
      queryParams = queryParams.map((q) =>
        Object.assign({}, q, { id: id() })
      );

      let headers = defaultConnection['headers'] || [];
      headers = headers.map((h) => Object.assign({}, h, { id: id() }));

      defaultConnection = Object.assign({}, defaultConnection, {
        [STRINGS.URL.QUERY_PARAMS]: queryParams,
        headers,
      });

      delete defaultConnection['is_default'];

      // console.log(`defaultConnection`,defaultConnection)

      newReqConnection = Object.assign(
        {},
        newReqConnection,
        defaultConnection || {},
        {
          name,
          id: newconnectionId,
        }
      );

      await setState({
        type: ADD.REQUEST_CONNECTION,
        value: newReqConnection,
      });

      await _responseConnectionFns.add(newconnectionId, newResConnection);

      if (connectOnCreate === true) {
        await _wsFns.onConnect(newconnectionId);
      }

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.ADD_REQUEST_CONNECTION,
        payload: newReqConnection,
      });
      await _requestFns.updateActiveConnection(newconnectionId);
      _storeClientFns.updateResActiveConn(newconnectionId);
    },

    /**
     * updateConnection: To update request connection
     * @param id: String// connection id to update
     * @param payload: Object// updated connection payload
     */
    updateConnection: (id = '', payload, updateURL = true) => {
      if (!id || !payload) return;

      // console.log(`updateConnection`, payload);

      let found_conn = req_connections.find((c) => c.id === id);
      if (!found_conn) return;

      let updatedPayload = {};

      for (let key in payload) {
        if (!equal(payload[key], found_conn[key])) {
          updatedPayload = Object.assign({}, updatedPayload, {
            [key]: payload[key],
          });
        }
      }

      //Ping on and off API calling
      if (
        _object.has(payload, 'config') &&
        _object.has(payload.config, 'ping') &&
        found_conn.config
      ) {
        if (payload['config']['ping'] === true) {
          let interval = found_conn.config.ping_interval;
          _wsFns.pingOn(id, interval);
        } else {
          _wsFns.pingOff(id);
        }
      }

      setState({
        type: UPDATE.REQUEST_CONNECTION,
        id,
        payload: updatedPayload,
      });

      /**
       * if query_params updated update URL
       */
      if (
        updateURL === true &&
        Object.keys(updatedPayload).includes(prop_STRINGS.URL.QUERY_PARAMS) &&
        id === runtime_active_connection
      ) {
        let urlObject = {
          ...url,
          [prop_STRINGS.URL.QUERY_PARAMS]:
            updatedPayload[prop_STRINGS.URL.QUERY_PARAMS],
        };
        let new_raw_url = _url.toString(urlObject);
        _requestFns.updateURL(new_raw_url, urlObject);

        //TODO: check once
        // setState({type: UPDATE.RAW_URL, value: new_raw_url});
      }

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.REQUEST_CONNECTION,
        payload: { id, payload: updatedPayload },
      });
    },

    removeConnection: (connection_id) => {
      let remove_index = -1,
        conn_id =
          connection_id && connection_id.length
            ? connection_id
            : runtime_active_connection || '';

      remove_index = req_connections.findIndex((conn) => conn.id === conn_id);

      if (
        remove_index === -1 ||
        (remove_index !== -1 && req_connections[remove_index].is_default)
      ) {
        return;
      }

      setState({
        type: DELETE.REQUEST_CONNECTION,
        value: runtime_active_connection,
      });

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.REMOVE_REQUEST_CONNECTION,
        payload: runtime_active_connection,
      });
      _responseConnectionFns.remove(runtime_active_connection);
    },

    /**
     * updateActiveConnection: To update active connection
     * @param connection_id: String// updated active connection
     */
    updateActiveConnection: (connection_id) => {
      if (!connection_id || connection_id === runtime_active_connection)
        return;

      try {
        let found =
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.connections
            ? state_Ref.current.request.connections.findIndex(
                (c) => c.id === connection_id
              )
            : -1;
        if (found === -1) return;

        setState({
          type: UPDATE.ACTIVE_CONNECTION,
          value: connection_id,
        });

        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.ACTIVE_CONNECTION,
          payload: connection_id,
        });
      } catch (e) {
        console.log(`e`, e);
      }
    },

    onChangeConfig: (key, value) => {
      if (!key) return;
      setState({ type: UPDATE.CONFIG, key, value });

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.CONFIG,
        payload: { key, value },
      });
    },

    updateMeta: (key, value) => {
      /* console.log(`meta`, meta)

       console.log(`update orders`, key, value)*/

      setState({ type: UPDATE.META, key, value });

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.META,
        payload: { key, value },
      });
    },

    updateDNP: (payload) => {
      if (!payload) return;

      setState({ type: UPDATE.DNS, value: payload });

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.DNS,
        payload,
      });
    },
  };

  /**
   * _wsFns: Websocket functions
   * @type {{onConnect: ((p1?:*)),onClose: ((p1?:*)), onSendMessage: (())}}
   * @private
   */
  const _wsFns = {
    /**
     * generateRequestConfig: To get request configuration
     * @param connection_id: <type: String>// connection id for which you want to generate config
     */
    generateRequestConfig: async (connection_id = '') => {
      if (!connection_id) {
        connection_id = runtime_active_connection;
      }

      try {
        const connection =
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.connections
            ? _cloneDeep(
                state_Ref.current.request.connections.find(
                  (conn) => conn.id === connection_id
                )
              )
            : undefined;

        let newConfig = _cloneDeep(
          state_Ref?.current?.request?.config || config
        );

        newConfig.certificates = sslManager;
        newConfig.proxies = proxyManager;

        if (_misc.firecampAgent() === EFirecampAgent.desktop) {
          // Fetch variables to parse URL to fetch cookies
          const envVar = _commonFns.getMergedVariables();

          // Fetch Cookie by DOMAIN in WebSocket client connection request
          // if platform is electron
          const cookie = await firecampFunctions.cookieManager.getCookies(
            _env.applyVariables(state_Ref?.current?.request?.raw_url, envVar)
          );

          if (cookie) {
            connection.headers.push({
              id: id(),
              key: 'cookie',
              value: cookie,
              disable: false,
            });
          }
        }

        return await new ConfigGenerator({
          envVariables: _commonFns.getMergedVariables() || {},
          raw_url: state_Ref?.current?.request?.raw_url || raw_url,

          // Omit query_params from connection as they will be sent through raw_url
          connection: _object.omit(connection, ['query_params']) || {},

          config: newConfig,
        }).prepare();
      } catch (e) {
        console.log('Error in generate WS config: ', e);
        throw new Error(e);
      }
    },

    /**
     * onConnect: To connect websocket
     * @param connectionId: String// connection id which you want to connect
     * @returns {Promise.<void>}
     */
    onConnect: async (connectionId = '') => {
      // console.log(`connectionId`, connectionId);
      if (!connectionId && state_Ref?.current?.request?._dnp) {
        connectionId =
          state_Ref.current.request._dnp.runtime_active_connection;
      }

      if (!connectionId) return;

      // Find connection to connect
      const connectionInstance = WSInstances_Ref.get(connectionId);

      if (connectionInstance?.connected()) return;

      const envVariables = _commonFns.getMergedVariables() || {};

      try {
        const { url, protocols, config } = await _wsFns.generateRequestConfig(
          connectionId
        );

        const executor =
          _misc.firecampAgent() !== EFirecampAgent.desktop
            ? new Executor({
                WebSocket,
                agent: EFirecampAgent.extension,
                connectionId,
                url,
                protocols,
                config,
                envVariables,
              })
            : window.fc.websocket({
                agent: EFirecampAgent.desktop,
                connectionId,
                url,
                protocols,
                config,
                envVariables,
              });

        if (executor) {
          executor.connectionState((result) => {
            _wsFns.onStateChange(connectionId, result);
          });

          executor.subscribe(async (result) => {
            if (result.meta.event === ELogTypes.UPGRADE) {
              if (_misc.firecampAgent() === EFirecampAgent.desktop) {
                // Set cookie from response header `Set-Cookie`
                await _commonFns._setCookie(url, result.message.payload);
              }
            } else _wsFns.onSubscribe(connectionId, result);
          });

          executor.connect();
        } else return;

        await _responseConnectionFns.update(connectionId, {
          state: executor.connected(),
        });

        WSInstances_Ref.set(connectionId, executor);
      } catch (e) {
        console.error(e);
        console.log(`error in connect`, e);
      }
    },

    onStateChange: async (connectionId = '', payload = {}) => {
      _responseConnectionLogFns.addLog(payload, connectionId);

      // Update status from connecting to connected
      if (payload.meta.event === ConnectionStatus[1].state) {
        const instance = WSInstances_Ref.get(connectionId);

        if (!instance) return;

        await _responseConnectionFns.update(connectionId, {
          state: EConnectionState.Open,
        });
      }

      if (
        payload.meta.event === ConnectionStatus[3].state ||
        payload.meta.event === ConnectionStatus[4].state ||
        payload.meta.event === ConnectionStatus[5].state ||
        payload.meta.event === ConnectionStatus[9].state
      ) {
        await _responseConnectionFns.update(connectionId, {
          state: EConnectionState.Closed,
        });

        // Remove socket instance on socket closed manually
        // or reconnection failed
        if (
          payload.meta.event === ConnectionStatus[3].state ||
          payload.meta.event === ConnectionStatus[9].state
        )
          WSInstances_Ref.delete(connectionId);
      }

      if (
        payload.meta.event === ConnectionStatus[0].state ||
        payload.meta.event === ConnectionStatus[6].state ||
        payload.meta.event === ConnectionStatus[7].state
      ) {
        await _responseConnectionFns.update(connectionId, {
          state: EConnectionState.Connecting,
        });
      }
    },

    onSubscribe: async (connectionId = '', payload = {}) => {
      _responseConnectionLogFns.addLog(payload, connectionId);
    },

    onCloseManually: (connectionId = '', code = '', reason = '') => {
      try {
        let instance = WSInstances_Ref.get(connectionId);

        if (code) {
          code = Number(code);
        }
        if (instance) {
          instance.close(code, reason);
        }
      } catch (e) {}
    },

    /**
     * onSendMessage: To send message from active connection.
     * @param payload: <type: Object>
     *   {
     *    "name":"",
     *    "message": "",
     *    "type": "",
     *    "envelope": ""
     *   }
     * @returns {Promise.<void>}
     */
    onSendMessage: async (payload = {}) => {
      let conn = WSInstances_Ref.get(runtime_active_connection);

      if (!conn || (conn && conn.socket && !conn.connected())) {
        _responseConnectionLogFns.sendErrorSystemMessage(
          '',
          runtime_active_connection,
          SYSTEM_MESSAGES.notConnected
        );
        return;
      }

      let msg_payload = Object.assign(
        {},
        state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.message
          ? state_Ref.current.request.message
          : request.message
      );

      if (payload && Object.keys(payload).length) {
        msg_payload = Object.assign({}, payload);
      }

      let ws_instance = conn || null,
        ws_message = msg_payload ? msg_payload.message || '' : '';

      if (
        msg_payload.type === EMessagePayloadTypes.file &&
        typeof ws_message === 'string'
      ) {
        return;
      }

      if (
        msg_payload.type === EMessagePayloadTypes.file &&
        ws_message instanceof File
      ) {
        ws_message = await _file.readAsArrayBuffer(ws_message);
      }

      if (msg_payload.type === EMessagePayloadTypes.no_body) {
        await ws_instance.send();
      } else {
        await ws_instance.send({
          name: msg_payload?.message?.name,
          meta: {
            type: msg_payload.type || '',
            envelope: msg_payload.envelope || '',
          },
          payload: ws_message || '',
        });
      }

      _commonFns.setHistory(runtime_active_connection);
    },
    pingOn: (connectionId = '', interval = 3000) => {
      let conn = WSInstances_Ref.get(connectionId);
      if (!conn) return;
      // console.log(`interval`, interval);
      conn.ping(interval);
    },
    pingOff: (connectionId = '') => {
      let conn = WSInstances_Ref.get(connectionId);
      if (!conn) return;
      // console.log(`OFF`);
      conn.stopPinging('PING');
    },
  };

  /**
   * _commonFns: Client common fns
   * @type {{getMergedVariables: (())}}
   * @private
   */
  let _commonFns = {
    getMergedVariables: () => {
      let mergedVars = {};
      const collectionId = tabData?.request?._meta?.collection_id || '';

      // console.log(`envSnippetsMeta_ref.current`, envSnippetsMeta_ref.current);
      if (environments || envSnippetsMeta_ref.current) {
        const defaultGlobalEnv =
          activeEnvs.workspace ||
          (envSnippetsMeta_ref.current || environments).getDefaultEnvironment(
            'global'
          );
        const defaultProjectEnv =
          activeEnvs.project ||
          (envSnippetsMeta_ref.current || environments).getDefaultEnvironment(
            collectionId
          );

        mergedVars =
          (envSnippetsMeta_ref.current || environments).getVariablesByTabId({
            globalEnvID: defaultGlobalEnv || '',
            collectionId: collectionId || '',
            collectionEnvID: defaultProjectEnv || '',
          }) || {};
      }
      // console.log(`mergedVars`, mergedVars);
      return mergedVars;
    },

    /**
     * _onChange: To perform change events in state
     * @param action: String// action that is going to perform
     * @param payload: String// corrasponding payload to be changed
     * @private
     */
    onChange: ({ action, payload }) => {
      if (!action && !payload) return;
      propOnChange({ action, payload }, state_Ref.current || state || {});
    },

    /**
     * onSave: To save request
     * @param name: String// request name
     * @param description: String// request description
     * @param collection_id: String// parent project id
     * @param folder_id: String// parent module id
     * @private
     */
    onSave: async ({
      name,
      description,
      project: collection_id,
      module: folder_id,
    }) => {
      await _commonFns.updateCacheMessageOnSave();

      await propOnSave(
        {
          name,
          description,
          project: collection_id,
          module: folder_id,
        },
        state_Ref.current
      )
        .then((statePayload) => {
          statePayload = Object.assign({}, state, statePayload);
          setState({ type: SET.STATE, value: statePayload });
        })
        .catch((e) => {
          console.log(`e`, e);
        });
    },

    /**
     * onUpdateRequest: To update graphql request
     * @private
     */
    onUpdateRequest: async () => {
      await _commonFns.updateCacheMessageOnSave();

      propsOnUpdateRequest(state_Ref.current);
    },

    setHistory: (connection_id = '') => {
      if (!connection_id || !connection_id.length) {
        connection_id = runtime_active_connection;
      }

      let history_payload = {},
        history_connections = [];

      let connectionPayload = req_connections.find(
        (con) => con.id === connection_id
      );

      if (connectionPayload) {
        history_connections = [{ ...connectionPayload, is_default: true }];
      }
      let request = _object.pick(state_Ref?.current?.request || request, [
        'raw_url',
        'url',
        'config',
        'listeners',
      ]);
      console.log(`hello`, state_Ref?.current);
      let leaf = {};

      if (state_Ref?.current?.request?.message) {
        let existingMsg = state_Ref?.current?.request?.message;
        leaf = {
          name: existingMsg.name || '',
          meta: {
            type: existingMsg.type || '',
            envelope: existingMsg.envelope || '',
          },
          body: existingMsg.message || '',
          _meta: {
            id: existingMsg?._meta?.id || id(),
          },
        };
      }
      // console.log({ leaf });

      history_payload = {
        request: {
          ...request,
          connections: history_connections,
          meta: {
            version: '2.0',
            type: ERequestTypes.WebSocket,
            ['leaf_orders']: [leaf?._meta?.id || ''],
          },
        },
        leaf,
        _meta: (state_Ref?.current?.request || request)?._meta,
      };

      console.log(`WS: history_payload`, history_payload);
      propOnSendMessage(Object.assign({}, history_payload));
    },

    updateCacheMessageOnSave: () => {
      console.log(state_Ref?.current?.request);
      if (state_Ref?.current?.request?._dnp?.active_message) {
        _cacheMessagesFns.onSave(
          state_Ref?.current?.request?._dnp?.active_message
        );
      }
    },

    setVisiblePanel: (panel) => {
      if (!panel) return;
      setVisiblePanel(panel);
    },

    setActiveEnvSnippets: (type = 'project', id = '') => {
      if (type === 'project') {
        setState({ type: UPDATE.ACTIVE_PRJ_ENV_SNIPT, value: id });
      } else {
        setState({ type: UPDATE.ACTIVE_GBL_ENV_SNIPT, value: id });
      }
    },
    /**
     * Parse cookie from response headers and add into cookie jar and local db
     * @private
     * @param requestURL
     * @param responseHeaders
     */
    _setCookie: async (requestURL, responseHeaders) => {
      if (_misc.firecampAgent() !== EFirecampAgent.desktop) {
        return '';
      }
      try {
        // Parse cookies fetched from the response headers
        const cookies = firecampFunctions.cookieManager.parseHeaders(
          responseHeaders,
          requestURL
        );

        // Add cookies into Cookie-Jar
        await firecampFunctions.cookieManager.addCookiesByDomain(
          cookies,
          requestURL
        );

        // Add cookies in the db
        if (cookies.length > 0) await _commonFns._addCookies(cookies);
        else return '\n* No cookie found from response headers.';

        return '\n* Cookie set successfully.';
      } catch (e) {
        console.log('ERROR WHILE SET COOKIE: ', e);
        return '\n* Failed to set cookie.';
      }
    },

    // Pass cookie into HTTPTab.js to add into local-db
    _addCookies: (cookies = []) => {
      propsOnAddCookies(cookies);
    },
  };

  /**
   * _responseConnectionLogFns: Response messages functions
   * @type {{addLog: *}}
   * @private
   */
  let _responseConnectionLogFns = {
    /**
     * addLog: To add message in websocket response connection tab which is active
     * {title = "", message = "", type = "", color = ""}
     * connection_id: String// id for which connection you want to set message.
     */
    addLog: useCallback(
      async (
        log = {
          title: '',
          message: '',
          meta: {
            type: '',
            color: '',
            timestamp: new Date().getTime(),
          },
        },
        connection_id = ''
      ) => {
        if (!connection_id) return;
        store_client.setState((state) => {
          let connectionsLogs = state.connectionLogs || new Map();
          let resConnLogs = connectionsLogs.get(connection_id);

          let logPayload = Object.assign({}, INIT_LOG, log, {
              meta: Object.assign({}, log.meta, { count: 0 }),
            }),
            newLogs = [];

          if (resConnLogs) {
            let lastLog = resConnLogs
              ? resConnLogs[resConnLogs.length - 1]
              : {};
            if (
              resConnLogs &&
              resConnLogs.length &&
              lastLog &&
              equal(lastLog, logPayload) &&
              log.meta.type !== ELogTypes.SYSTEM
            ) {
              let newLog = Object.assign({}, logPayload, {
                meta: Object.assign({}, logPayload.meta, {
                  count: (lastLog.meta.count || 0) + 1,
                }),
              });
              newLogs = [
                ...resConnLogs.slice(0, resConnLogs.length - 1),
                newLog,
              ];
            } else {
              newLogs = [...resConnLogs, logPayload];
            }
          } else {
            newLogs = [logPayload];
          }
          return {
            connectionLogs: new Map([
              ...connectionsLogs,
              [connection_id, newLogs],
            ]),
          };
        });
      },
      [store_client?.getState()?.connections?.values()]
    ),

    clearAll: (connectionId) => {
      if (!connectionId) return;
      store_client.setState((state) => {
        let connectionsLogs = state.connectionLogs || new Map();
        connectionsLogs.delete(connectionId);
        return { connectionLogs: new Map([...connectionsLogs]) };
      });
    },

    sendErrorSystemMessage: (
      message = '',
      connection_id = '',
      title = ''
    ) => {
      _responseConnectionLogFns.addLog(
        {
          title: title || '',
          message: message || '',
          meta: {
            type: ELogTypes.SYSTEM,
            color: LogColors.DANGER,
            timestamp: new Date().getTime(),
          },
        },
        connection_id
      );
    },
  };

  let _collectionFns = {
    messages: {
      add: async ({ name = '', parent_id = '' }) => {
        let msgId = id();

        if (
          request.message.type === 'no_body' ||
          request.message.type === EMessagePayloadTypes.file
        ) {
          return;
        }

        let messagePayload = {
          name,
          body: request.message.message,
          meta: {
            type: request.message.type,
            envelope: request.message.envelope,
          },
          _meta: {
            id: msgId,
            parent_id,
          },
        };

        await setState({ type: ADD.COLLECTION_MESSAGE, value: messagePayload });
        // await _requestFns.updateDNP({ active_mesage: msgId });

        //Update parent orders on add message
        await _collectionFns.updateOrders({
          action: 'add',
          key: 'leaf_orders',
          parent_id,
          id: msgId,
        });

        // console.log(`messagePayload`, messagePayload);

        await _cacheMessagesFns.add(messagePayload);
        // _requestFns.updateMessage()

        // console.log({ msgId });
        _requestFns.updateDNP({ active_message: msgId });

        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.ADD_COLLECTION_MESSAGE,
          payload: messagePayload,
        });
        _commonFns.onUpdateRequest(tabData);
      },

      update: async ({ id, key, value }) => {
        if (!id || !key) return;

        if (key !== 'path') {
          await setState({ type: UPDATE.COLLECTION_MESSAGE, id, key, value });
          _commonFns.onChange({
            action: ON_CHANGE_ACTIONS.UPDATE_COLLECTION_MESSAGE,
            payload: { id, key, value },
          });
        }
        _cacheMessagesFns.update(id, { [key]: value });
      },

      remove: (id) => {
        if (!id) return;
        let foundMessage = state_Ref?.current?.collection?.messages.find(
          (msg) => msg._meta.id === id
        );

        if (foundMessage) {
          setState({ type: DELETE.COLLECTION_MESSAGE, value: id });

          let parent_id = foundMessage._meta.parent_id || '';
          //Update parent orders on remove message
          _collectionFns.updateOrders({
            action: 'remove',
            key: 'leaf_orders',
            parent_id,
            id,
          });

          _commonFns.onChange({
            action: ON_CHANGE_ACTIONS.REMOVE_COLLECTION_MESSAGE,
            payload: id,
          });

          _cacheMessagesFns.remove(id);
        }
      },

      set: (id = '', payload = {}) => {
        if (!id || !payload) return;
        console.log(`payload`, payload);
        setState({ type: SET.COLLECTION_MESSAGE, id, value: payload });
        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.SET_COLLECTION_MESSAGE,
          payload: { id, payload },
        });
      },
    },

    directories: {
      add: (payload) => {
        let { name = '', parent_id = '' } = payload,
          directoryID = id();

        let directoryPayload = Object.assign(
          {},
          {
            name,
            _meta: {
              id: directoryID,
              parent_id,
            },
            meta: {
              dir_orders: [],
              leaf_orders: [],
            },
          }
        );
        console.log(`directoryPayload`, directoryPayload);

        setState({ type: ADD.COLLECTION_DIRECTORY, value: directoryPayload });

        //Update parent orders on add directory
        _collectionFns.updateOrders({
          action: 'add',
          key: 'dir_orders',
          parent_id,
          id: directoryID,
        });

        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.ADD_COLLECTION_DIRECTORY,
          payload: directoryPayload,
        });
      },

      update: ({ id, key, value }) => {
        if (!id || !key) return;

        setState({ type: UPDATE.COLLECTION_DIRECTORY, id, key, value });
        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.UPDATE_COLLECTION_DIRECTORY,
          payload: { id, key, value },
        });
      },

      /**
       * remove: Remove directory and it's children
       * Reset playground if playground emitter (active_emitter) is removed
       * @param {*} id : Removed directory's id
       */
      remove: async (id) => {
        if (!id) return;

        // Directory to remove
        let foundDirectory = collection.directories.find(
          (dir) => dir._meta.id === id
        );

        if (foundDirectory) {
          setState({ type: DELETE.COLLECTION_DIRECTORY, value: id });

          let parent_id = foundDirectory._meta.parent_id || '';
          //update parent orders on remove dirctory
          _collectionFns.updateOrders({
            action: 'remove',
            key: 'dir_orders',
            parent_id,
            id,
          });

          _commonFns.onChange({
            action: ON_CHANGE_ACTIONS.REMOVE_COLLECTION_DIRECTORY,
            payload: id,
          });
        }

        if (collection) {
          let dirsToRemoveIds = [id];
          let messagesToRemoveIds = [];

          if (!_array.isEmpty(collection.directories)) {
            //----------------------ALGORITHM: REMOVE DIRECTORY AND CHILDREN----------------------//

            /**
             * getChildren: Get and set children of directory
             * @param {*} dirId : Directory's id to get childern
             */
            let getChildren = async (dirId = '') => {
              // Child directories ids
              let childDirIds = collection.directories
                .filter((childDir) => childDir._meta.parent_id === dirId)
                .map((childDir) => childDir._meta.id);

              // Child messages ids
              let childMessageIds = collection.messages
                .filter((childMsg) => childMsg._meta.parent_id === dirId)
                .map((childMsg) => childMsg._meta.id);

              if (!_array.isEmpty(childDirIds)) {
                dirsToRemoveIds = dirsToRemoveIds.concat(childDirIds);

                for await (const childDirId of childDirIds) {
                  // Recall: getChildren if child directory is parent of another directory
                  await getChildren(childDirId);
                }
              }

              if (!_array.isEmpty(childMessageIds)) {
                messagesToRemoveIds =
                  messagesToRemoveIds.concat(childMessageIds);
              }
              return Promise.resolve(true);
            };
            await getChildren(id);

            //-----------------------------------------------------------------------------------//

            if (
              !_array.isEmpty(collection.messages) &&
              !_array.isEmpty(messagesToRemoveIds)
            ) {
              // messageRes: Collection messages to set
              let messageRes = collection.messages.filter(
                (emtr) => !messagesToRemoveIds.includes(emtr._meta.id)
              );

              if (messageRes && !equal(messageRes, collection.messages)) {
                _collectionFns.updateCollection('messages', messageRes);
              }
              _cacheMessagesFns.removeMultiple(messagesToRemoveIds);
            }

            // dirResult: Collection directories to set
            let dirResult = collection.directories.filter(
              (dir) => !dirsToRemoveIds.includes(dir._meta.id)
            );

            if (dirResult && !equal(dirResult, collection.directories)) {
              _collectionFns.updateCollection('directories', dirResult);
            }
          }
        }
      },
    },

    updateOrders: ({
      action = 'add',
      key = 'leaf_orders',
      parent_id = '',
      id = '',
    }) => {
      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parent_id && parent_id.length
            ? 'DIR'
            : ERequestTypes.WebSocket;

      //Get existing orders from parent
      if (parentType === ERequestTypes.WebSocket) {
        existingOrders = meta[key] || [];
      } else if (parentType === 'DIR' && parent_id.length) {
        if (collection.directories) {
          let foundParentDirectoryIndex = collection.directories.findIndex(
            (dir) => dir._meta.id === parent_id
          );
          if (
            foundParentDirectoryIndex !== -1 &&
            collection.directories[foundParentDirectoryIndex].meta &&
            collection.directories[foundParentDirectoryIndex].meta[key]
          ) {
            existingOrders =
              collection.directories[foundParentDirectoryIndex].meta[key];
          }
        }
      } else {
      }

      //update orders by action type
      if (action === 'add') {
        newOrders = [...existingOrders, id];
      } else if (action === 'remove') {
        let foundExistingIndex = existingOrders.findIndex(
          (item) => item === id
        );
        if (foundExistingIndex !== -1) {
          newOrders = [
            ...existingOrders.slice(0, foundExistingIndex),
            ...existingOrders.slice(foundExistingIndex + 1),
          ];
        }
      }

      newOrders = _array.uniq(newOrders);
      //update state and parent component callback
      if (parentType === ERequestTypes.WebSocket) {
        _requestFns.updateMeta(key, newOrders);
      } else if (parentType === 'DIR' && parent_id.length) {
        _collectionFns.directories.update({
          id: parent_id,
          key: 'meta',
          value: { [key]: newOrders },
        });
      } else {
      }
    },

    updateCollection: (key, value) => {
      if (!key) return;
      setState({ type: UPDATE.COLLECTION, key, value });
      /*_commonFns.onChange({
        action: ON_CHANGE_ACTIONS.COLLECTION,
        payload: {key, value}
      });*/
    },
  };

  let _cacheMessagesFns = {
    setToPlayground: (payload) => {
      if (!payload?._meta?.id) return;

      let messagePayload = {
        name: payload.name || '',
        message: payload.body || '',
        type: payload.meta.type || '',
        envelope: payload.meta.envelope || '',
        path: payload.path || '',
        _meta: payload?._meta || {},
      };

      _requestFns.setMessage(messagePayload);
    },

    add: (
      payload,
      setOriginal = false,
      appendExistingPayload = false,
      sendMessage = false
    ) => {
      if (!payload?._meta?.id) return;

      let msg =
        state_Ref?.current?.collection?.messages.find(
          (msg) => msg._meta.id === payload._meta.id
        ) || {};
      let msgToSetInPlayground = {};

      msgToSetInPlayground = Object.assign({}, msg, payload); //TODO: check

      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        if (
          collectionMessages.has(payload._meta.id) &&
          setOriginal === false
        ) {
          let existingMsg = collectionMessages.get(payload._meta.id);

          if (appendExistingPayload === true) {
            msgToSetInPlayground = Object.assign(
              {},
              msgToSetInPlayground,
              existingMsg
            );
          } else {
            msgToSetInPlayground = Object.assign(
              {},
              existingMsg,
              msgToSetInPlayground
            );
          }
        } else {
          collectionMessages.set(payload._meta.id, payload);
        }
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });

      _cacheMessagesFns.setToPlayground(msgToSetInPlayground);
      if (sendMessage === true && msgToSetInPlayground) {
        let msgToSend = Object.assign(
          {},
          {
            message: msgToSetInPlayground.body || '',
            type: msgToSetInPlayground.meta
              ? msgToSetInPlayground.meta.type || ''
              : '',
            envelope: msgToSetInPlayground.meta
              ? msgToSetInPlayground.meta.envelope || ''
              : '',
            name: msgToSetInPlayground.name || '',
          }
        );

        _wsFns.onSendMessage(msgToSend, false);
      }
    },

    update: (id = '', payload = {}) => {
      if (payload) {
        if (request?._dnp?.active_message === id) {
          _requestFns.updateMessage(payload);
        }

        if (payload.hasOwnProperty('message')) {
          payload = Object.assign({}, payload, { body: payload.message });
          payload = _object.omit(payload, ['message']);
        }

        if (payload.hasOwnProperty('type')) {
          payload = Object.assign({}, payload, {
            meta: Object.assign({}, payload.meta, { type: payload.type }),
          });
          payload = _object.omit(payload, ['type']);
        }

        if (payload.hasOwnProperty('envelope')) {
          payload = Object.assign({}, payload, {
            meta: Object.assign({}, payload.meta, {
              envelope: payload.envelope,
            }),
          });
          payload = _object.omit(payload, ['envelope']);
        }
      }

      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        if (collectionMessages.has(id)) {
          let existingMsg = collectionMessages.get(id),
            message = {};

          message = _object.mergeDeep(existingMsg, payload);

          if (
            message.meta &&
            (message.meta.type === EMessagePayloadTypes.arraybufferview ||
              message.meta.type === EMessagePayloadTypes.arraybuffer) &&
            (message.meta.envelope === '' || !message.meta.envelope)
          ) {
            message = Object.assign({}, message, {
              meta: Object.assign({}, message.meta, { envelope: 'Int8Array' }),
            });
          }

          message = _object.omit(message, ['path']);
          // console.log(`message`, message);
          collectionMessages.set(id, message);
        }
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });
    },

    remove: (id) => {
      if (!id) return;

      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        collectionMessages.delete(id);
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });

      if (
        request &&
        request._dnp &&
        request._dnp.active_message &&
        request._dnp.active_message === id
      ) {
        _cacheMessagesFns.addNewMessage();
      }
    },

    removeMultiple: (ids = []) => {
      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        ids.map((id) => {
          collectionMessages.delete(id);
        });
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });

      if (
        request &&
        request._dnp &&
        request._dnp.active_message &&
        ids.includes(request._dnp.active_message)
      ) {
        _cacheMessagesFns.addNewMessage();
      }
    },

    setToOriginal: (id) => {
      if (state_Ref?.current?.collection?.messages && id) {
        let oringinal = state_Ref?.current?.collection?.messages.find(
          (msg) => msg._meta.id === id
        );
        if (oringinal) {
          if (request.message) {
            oringinal = Object.assign({}, oringinal, {
              path: request.message.path || '',
            });
          }

          store_client.setState((state) => {
            let collectionMessages = state.collectionMessagesCache || new Map();
            collectionMessages.set(id, oringinal);
            return {
              collectionMessagesCache: new Map([...collectionMessages]),
            };
          });
          _cacheMessagesFns.setToPlayground(oringinal);
        }
      }
    },

    onSave: (id) => {
      // console.log({ id, ref: state_Ref?.current });

      let existingMsgs = state_Ref?.current?.collection?.messages;

      // console.log({ existingMsgs });
      if (existingMsgs) {
        let foundMsg = existingMsgs.find((msg) => msg._meta.id === id);
        let updateCollection = false,
          msgInCollection;

        store_client.setState((state) => {
          let collectionMessages = state.collectionMessagesCache || new Map();
          if (foundMsg && collectionMessages.has(id)) {
            let msgToSave = collectionMessages.get(id);

            // console.log(`msgToSave`, msgToSave);
            if (
              msgToSave &&
              msgToSave.meta &&
              msgToSave.meta.type !== EMessagePayloadTypes.file
            ) {
              msgInCollection = Object.assign({}, foundMsg, msgToSave);
              updateCollection = true;
            }
          }
          return { collectionMessagesCache: new Map([...collectionMessages]) };
        });

        if (updateCollection && msgInCollection) {
          _collectionFns.messages.set(id, msgInCollection);
        }
      }
    },

    addNewMessage: () => {
      let msg = {
        name: '',
        type: EMessagePayloadTypes.no_body,
        message: '',
        envelope: '',
        path: '',
      };
      _requestFns.setMessage(msg);
      _requestFns.updateDNP({ active_message: '' });
    },

    clearAll: () => {
      store_client.setState((state) => {
        let collectionMessages = state.collectionMessagesCache || new Map();
        collectionMessages.clear();
        return { collectionMessagesCache: new Map([...collectionMessages]) };
      });
    },
  };

  let _responseConnectionFns = {
    add: (id, payload = {}) => {
      if (!payload || !id) return;
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        return {
          connections: new Map([...resConnectionList, [id, payload]]),
        };
      });
    },

    update: async (id, payload, from) => {
      if (!id || !payload) return;

      let updatedPayload = Object.assign({}, payload);

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        let existing = resConnectionList.get(id);
        if (existing) {
          updatedPayload = Object.assign({}, existing, payload);
        } else {
          updatedPayload = Object.assign({}, RESPONSE_CONNECTION, payload);
        }
        return {
          connections: new Map([...resConnectionList, [id, updatedPayload]]),
        };
      });

      return Promise.resolve();
    },

    remove: (id) => {
      if (!id) return;

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.delete(id);
        return { connections: new Map([...resConnectionList]) };
      });

      store_client.setState((state) => {
        let messagesList = state.connectionLogs || new Map();
        messagesList.delete(id);
        return { connectionLogs: new Map([...messagesList]) };
      });

      WSInstances_Ref.delete(id);
    },

    clearAll: () => {
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.clear();
        return { connections: new Map([...resConnectionList]) };
      });
    },
  };

  let _storeClientFns = {
    updateResActiveConn: (connectionId) => {
      if (!connectionId) return;

      store_client.setState({ resActiveConn: connectionId });
    },
  };

  return (
    <WebsocketContext.Provider
      value={{
        //props
        ctx_environments: environments,
        ctx_firecampFunctions: firecampFunctions,
        ctx_constants: propConstants,
        ctx_tabData: tabData,

        //prop components
        ctx_additionalComponents: prop_additionalComponents,

        //state
        ctx_store_client: store_client,
        // ctx_request: request,
        // ctx_config: config,
        // ctx_collection: collection,
        // ctx_meta: meta,

        //functions
        ctx_requestFns: _requestFns,
        ctx_wsFns: _wsFns,
        ctx_commonFns: _commonFns,
        ctx_collectionFns: _collectionFns,
        ctx_responseConnectionLogFns: _responseConnectionLogFns,
        ctx_cacheMessagesFns: _cacheMessagesFns,

        ctx_emitter: emitterRef,
        ctx_onUpdateEnvironment: onUpdateEnvironment,

        ctx_storeClientFns: _storeClientFns,
      }}
    >
      <RootContainer className="fc-h-full w-full ws-tab">
        <Container className="fc-h-full with-divider">
          <Container.Header>
            <URLbar
              runtimeActiveConnection={runtime_active_connection || ''}
              tabData={tabData}
              raw_url={raw_url}
            />
          </Container.Header>
          <Container.Body>
            <Row className="with-divider" height={'100%'}>
              <Request
                collection={collection || []}
                meta={meta || {}}
                tabData={tabData || {}}
                runtimeActiveConnection={runtime_active_connection || ''}
                config={config}
                connections={req_connections || []}
                message={request.message || {}}
                _dnp={request._dnp}
                visiblePanel={visiblePanel}
              />
              <Response
                runtimeActiveConnection={runtime_active_connection}
                visiblePanel={visiblePanel}
                setVisiblePanel={_commonFns.setVisiblePanel}
              />
            </Row>
          </Container.Body>
        </Container>
      </RootContainer>
    </WebsocketContext.Provider>
  );
};

export default Websocket;

Websocket.defaultProps = {
  firecampFunctions: {},
  constants: {},
  tabData: {},
  sslManager: [],
  proxyManager: [],

  request: {},
  collection: [],
  additionalComponents: {},
  onChange: () => {},
  onSave: () => {},
  onUpdate: () => {},
  onSendMessage: () => {},
};

Websocket.propTypes = {
  firecampFunctions: PropTypes.object.isRequired,
  constants: PropTypes.object.isRequired,
  tabData: PropTypes.object.isRequired,
  sslManager: PropTypes.array,
  proxyManager: PropTypes.array,

  request: PropTypes.object.isRequired,
  collection: PropTypes.object,
  additionalComponents: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func,
};
