import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Container, Row, RootContainer } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import Executor from '@firecamp/socket.io-executor/dist/esm';
import v2 from 'socket.io-client-v2';
import v3 from 'socket.io-client-v3';
import v4 from 'socket.io-client-v4';
import create from 'zustand';
import _url from '@firecamp/url';
import { _array, _env, _file, _misc, _object, _table } from '@firecamp/utils';
import { ConfigGenerator } from '../services';
import URLbar from './common/urlbar/URLbar';
import '../sass/socket.sass';
import Request from './request/Request';
import Response from './response/Response';
import { ACTIONS, reducer } from './reducer';
import Emitter from './common/Emitter';

import { SocketContext } from './Socket.context';

import {
  REQUEST_CONNECTION,
  RESPONSE_CONNECTION,
  InitPayload,
  InitLog,
} from '../constants/StatePayloads';
import {
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
  ELogTypes,
  ON_CHANGE_ACTIONS,
  STRINGS,
  SYSTEM_LOGS,
  PANEL,
  RESERVED_EMITTER_EVENTS,
  EMITTER_PAYLOAD_TYPES,
} from '../constants';
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
};

let defaultConnectionId = id();

const { ADD, UPDATE, DELETE, SET } = ACTIONS;

const _getInitResConnections = (
  connections = [],
  listeners = [],
  on_connect_listeners = []
) => {
  let initResConn = {};
  connections.map((conn) => {
    let listenersObj = {};
    listeners.map((l) => {
      listenersObj = Object.assign({}, listenersObj, {
        [l]: on_connect_listeners?.includes(l) || false,
      });
    });

    initResConn = Object.assign({}, initResConn, {
      [conn.id]: Object.assign({}, RESPONSE_CONNECTION, {
        id: conn.id,
        name: conn.name || '',
        listeners: listenersObj,
      }),
    });
  });
  return initResConn;
};

const Socket = ({
  firecampFunctions = {},
  constants: propConstants = {},
  tabData = {},
  tabFn = {},
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
  onEmitMessage: propOnSendMessage = () => {},
  onUpdateEnvironment = () => {},
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
            QUERY_PARAMS: 'queryParams', //URL object is having query as key but in FC there will be queryParams key to maintain URL structure
            SLASHES: 'slashes',
            USERNAME: 'username',
            VARIABLES: 'variables',
          },
  };

  defaultConnectionId =
    prop_request &&
    prop_request._dnp &&
    prop_request._dnp.runtime_activeConnection
      ? prop_request._dnp.runtime_activeConnection
      : defaultConnectionId;

  let initResConnections =
    prop_request && prop_request.connections
      ? _getInitResConnections(
          prop_request.connections,
          prop_request.listeners,
          prop_request.on_connect_listeners
        )
      : {};

  let initPlayground = {};
  if (
    prop_request &&
    prop_request._dnp &&
    prop_request._dnp.active_emitter &&
    prop_collection &&
    prop_collection.emitters
  ) {
    let emitterFound = prop_collection.emitters.find(
      (emitter) => emitter._meta.id === prop_request._dnp.active_emitter
    );
    if (emitterFound) {
      initPlayground = Object.assign({}, InitPayload, emitterFound);
    }
    // _cacheEmittersFns.add(emitterFound);
  }

  let initialState = {
    request: _object.mergeDeep(
      {
        type: 'socketio',
        url: {},
        raw_url: '',
        config: {
          rejectUnauthorized: false,
          timeout: 20000,
          reconnection: false,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          version: 'v4',
          on_connect_listeners: [],
        },
        connections: [],
        playground: InitPayload,
        meta: {
          fOrders: [],
          iOrders: [],
          version: '2.0',
        },
        _dnp: {
          active_emitter: '',
          runtime_activeConnection: '',
        },
        listeners: [],
        _meta: {},
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
        emitters: [],
        directories: [],
      },
      { ...prop_collection },
      false
    ),
    revision: 1,
  };

  const initialZustandState = {
    collectionEmittersCache: new Map(),
    connections: new Map(),
    resActiveConn: '',
    connectionLogs: new Map(),
  };

  let { current: emitterRef } = useRef(new Emitter()); //TODO: remove later

  let { current: SocketInstances_Ref } = useRef(new Map());
  let envSnippetsMeta_Ref = useRef({});
  let state_Ref = useRef({});

  let [state, setState] = useReducer(reducer, initialState);
  let [visiblePanel, setVisiblePanel] = useState(PANEL.REQUEST);

  let [store_client] = useState(() => create(() => initialZustandState));

  let { request, collection } = state;

  let {
    url,
    raw_url,
    config,
    meta,
    connections: req_connections,
    _dnp: { runtime_activeConnection },
  } = request;

  useEffect(() => {
    if (
      prop_request &&
      prop_request._dnp &&
      prop_request._dnp.active_emitter &&
      prop_collection &&
      prop_collection.emitters
    ) {
      let emitterFound = prop_collection.emitters.find(
        (emitter) => emitter._meta.id === prop_request._dnp.active_emitter
      );
      if (emitterFound) {
        _cacheEmittersFns.add(emitterFound);
      }
    }

    if (initResConnections) {
      for (let key in initResConnections) {
        _responseConnectionFns.add(key, initResConnections[key]);
      }
    }

    _storeClientFns.updateResActiveConn(runtime_activeConnection);

    //TODO: remove code later
    /*_responseConnectionLogFns.addLog(
      {
        title: "Message",
        message: [
          {
            meta: {
              type: "text",
              envelope: ""
            },
            payload: "Hello from Vinaxi Khalasi"
          },
          {
            meta: {
              type: "json",
              envelope: ""
            },
            payload: `
              {
                "name":"Vinaxi Khalasi"
              }
              `
          }
        ],
        meta: {
          type: "R",
          color: "",
          time: new Date()
        }
      },
      runtime_activeConnection
    );*/
    return async () => {
      try {
        store_client.setState((state) => {
          let resConnectionList = state.connections || new Map();
          resConnectionList.clear();
          return { connections: new Map([...resConnectionList]) };
        });

        store_client.setState((state) => {
          let connectionsLogs = state.connectionLogs || new Map();
          connectionsLogs.clear();
          return { connectionLogs: new Map([...connectionsLogs]) };
        });

        store_client.setState((state) => {
          let collCacheMessagesList =
            state.collectionEmittersCache || new Map();
          collCacheMessagesList.clear();
          return { collectionEmittersCache: new Map(collCacheMessagesList) };
        });

        if (req_connections) {
          req_connections.map(async (conn) => {
            if (conn.id) {
              let connToClose = SocketInstances_Ref.get(conn.id);
              _socketFns.disconnect(conn.id);
              SocketInstances_Ref.delete(conn.id);
            }
          });
        }
      } catch (e) {
        console.log({ e });
      }
    };
  }, []);

  useEffect(() => {
    firecampFunctions?.reactGA?.pageview?.('socketio');
  }, []);

  useEffect(() => {
    let found = req_connections.find((c) => c.id === runtime_activeConnection);
    if (!found) return;

    /**
     * Update url on change active_connction as queryParams updated
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
  }, [runtime_activeConnection]);

  useEffect(() => {
    envSnippetsMeta_Ref.current = environments;

    try {
      let variables = _commonFns.getMergedVariables() || {};

      for (let [connectionId, SE] of SocketInstances_Ref) {
        if (!SE || !SE.setEnvVariables) return;
        // console.log(`variables`, variables)
        SE.setEnvVariables(variables || {});
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
        'playground',
      ]);
      let propsData = _object.omit(tabData.request, [
        ...KEYS_ON_SAVE_REQUEST.REQUEST,
        'playground',
        'collection',
      ]);
      let propCollection = tabData.request.collection;
      console.log({ propCollection });

      let new_req = firecampFunctions.tab.rehydrate(
        state,
        {
          ['request']: reqData,
          ['collection']: propCollection,
          ...propsData,
        },
        ERequestTypes.SocketIO
      );

      if (
        new_req.request &&
        new_req.request.url &&
        typeof new_req.request.url === 'string'
      ) {
        new_req.request = Object.assign({}, new_req.request, {
          url: _url.normalize(
            { raw: new_req.request.url, queryParams: [], pathParams: [] } ||
              ''
          ),
          raw_url: new_req.request.url,
        });
      } else if (
        new_req.request.url &&
        typeof new_req.request.url === 'object' &&
        Object.keys(new_req.request.url).length
      ) {
        let url_query_params = [];
        if (new_req.request.connections) {
          let found = new_req.request.connections.find((con) => con.isDefault);
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
            active_emitter: state?.request?._dnp?.active_emitter || '',
          },
        });

        statePayload = Object.assign({}, statePayload, new_req, {
          revision: tabData.meta.revision || 1,
        });
      }
    }

    if (
      statePayload &&
      typeof statePayload === 'object' &&
      Object.keys(statePayload).length &&
      !equal(statePayload, state)
    ) {
      console.log({ statePayload });
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
   * @private
   */
  let _requestFns = {
    updateRequest: (key, value) => {
      setState({ type: UPDATE.REQUEST, key, value });
    },

    /**
     * updateEmitter: To update emitter
     * @param key: String// update emitter key
     * @param value: String// updated value
     */
    updateEmitter: (payload) => {
      // console.log(`updateEmitter`, key, value);

      if (!payload) return;

      setState({ type: UPDATE.EMITTER, value: payload });

      // _commonFns.onChange({action: ON_CHANGE_ACTIONS.EMITTER, payload: {key, value}});
    },

    setPlayground: (payload) => {
      if (!payload) return;

      setState({ type: SET.EMITTER, value: payload });
    },

    /**
     * updateURL: To update URL
     * @param value: String// updated url string
     */
    updateURL: async (value = '', url_obj = {}) => {
      let urlValue = value.trim();
      if (urlValue === raw_url) return;
      let urlObject = (urlObject = _url.toObject(
        urlValue,
        url_obj?.queryParams || url.queryParams
      ));

      // console.log(`urlObject`, urlObject)
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
                  (conn) => conn.id === runtime_activeConnection
                );

                if (
                  activeConnPayload &&
                  !equal(activeConnPayload[key], urlObject[key])
                ) {
                  await _requestFns.updateConnection(
                    runtime_activeConnection,
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
      let listenersObj = {};

      (request.listeners || []).map((l) => {
        listenersObj = Object.assign({}, listenersObj, { [l]: false });
      });

      let newReqConnection = Object.assign({}, REQUEST_CONNECTION),
        newResConnection = Object.assign({}, RESPONSE_CONNECTION, {
          id: newconnectionId,
          name,
          listeners: listenersObj || {},
          auth: [],
        });

      let defaultConnection = req_connections.find((c) => c.isDefault);

      if (!defaultConnection && req_connections && req_connections.length) {
        defaultConnection = req_connections[0];
      }

      let queryParams = defaultConnection[STRINGS.URL.QUERY_PARAMS] || [];
      queryParams = queryParams.map((q) => Object.assign({}, q, { id: id() }));

      let headers = defaultConnection['headers'] || [];
      headers = headers.map((h) => Object.assign({}, h, { id: id() }));

      defaultConnection = Object.assign({}, defaultConnection, {
        [STRINGS.URL.QUERY_PARAMS]: queryParams,
        headers,
      });

      delete defaultConnection['isDefault'];

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
        _socketFns.onConnect(newconnectionId);
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

      // console.log(`id`, id, payload);

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
      setState({
        type: UPDATE.REQUEST_CONNECTION,
        id,
        payload: updatedPayload,
      });

      /**
       * if queryParams updated update URL
       */

      if (
        updateURL === true &&
        Object.keys(updatedPayload).includes(prop_STRINGS.URL.QUERY_PARAMS) &&
        id === runtime_activeConnection
      ) {
        let urlObject = {
          ...url,
          [prop_STRINGS.URL.QUERY_PARAMS]:
            updatedPayload[prop_STRINGS.URL.QUERY_PARAMS],
        };
        // console.log(`urlObject`, urlObject);
        let new_raw_url = _url.toString(urlObject);
        _requestFns.updateURL(new_raw_url, urlObject);

        //TODO: check once
        // setState({type: UPDATE.RAW_URL, value: new_raw_url});
      }

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.REQUEST_CONNECTION,
        payload: { id, payload: updatedPayload },
      });

      //Call ping event
      if (Object.prototype.hasOwnProperty.call(payload, 'ping')) {
        _socketFns.onPing(
          id,
          payload['pingInterval'] || found_conn.pingInterval,
          !payload['ping']
        );
      }
    },

    removeConnection: (connectionId) => {
      let remove_index = -1,
        conn_id =
          connectionId && connectionId.length
            ? connectionId
            : runtime_activeConnection || '';

      remove_index = req_connections.findIndex((conn) => conn.id === conn_id);
      if (
        remove_index === -1 ||
        (remove_index !== -1 &&
          req_connections[remove_index].isDefault === true)
      ) {
        return;
      }

      setState({
        type: DELETE.REQUEST_CONNECTION,
        value: runtime_activeConnection,
      });

      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.REMOVE_REQUEST_CONNECTION,
        payload: runtime_activeConnection,
      });

      _responseConnectionFns.remove(runtime_activeConnection);
    },

    /**
     * updateActiveConnection: To update active connection
     * @param connectionId: String// updated active connection
     */
    updateActiveConnection: (connectionId) => {
      if (!connectionId || connectionId === runtime_activeConnection) return;

      try {
        let found =
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.connections
            ? state_Ref.current.request.connections.findIndex(
                (c) => c.id === connectionId
              )
            : -1;
        if (found === -1) return;

        setState({
          type: UPDATE.ACTIVE_CONNECTION,
          value: connectionId,
        });

        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.ACTIVE_CONNECTION,
          payload: connectionId,
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

    addListener: (name = '', listen = false) => {
      let listeners = [];
      if (
        state_Ref.current &&
        state_Ref.current.request &&
        state_Ref.current.request.listeners
      ) {
        listeners = [...state_Ref.current.request.listeners, name];
      } else {
        listeners = [name];
      }

      listeners = _array.uniq(listeners);

      _requestFns.setListeners(listeners);
      _resConnListenerFns.addListener(name, listen);
    },

    removeListener: (name = '') => {
      // Remove listener
      _requestFns.setListeners(
        _array.without(state_Ref.current.request.listeners, name)
      );

      // Remove onConnectListener
      _requestFns.setOnConnectListeners(
        _array.without(
          state_Ref?.current?.request?.config?.on_connect_listeners,
          name
        )
      );

      // Remove listener from connection cache
      _resConnListenerFns.removeListener(name);
    },

    setListeners: (listeners = []) => {
      setState({ type: SET.GLOBAL_LISTENERS, value: listeners });
      _commonFns.onChange({
        action: ON_CHANGE_ACTIONS.GLOBAL_LISTENERS,
        payload: { listeners },
      });
    },

    setOnConnectListeners: (listeners = []) => {
      _requestFns.onChangeConfig('on_connect_listeners', listeners);
    },
  };

  /**
   * _socketFns: SocketIO functions
   * @type {{onConnect: ((p1?:*))}
   * @private
   */
  let _socketFns = {
    /**
     * generateRequestConfig: To get request configuration
     * @param connectionId: <type: String>// connection id for which you want to generate config
     */
    generateRequestConfig: (connectionId) => {
      let socketConfig = {},
        urlStr = raw_url || '';

      if (!connectionId) {
        connectionId = runtime_activeConnection;
      }
      let foundConnection = {};
      try {
        /*
             Find connection to connect
             */

        foundConnection =
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.connections
            ? state_Ref.current.request.connections.find(
                (conn) => conn.id === connectionId
              )
            : undefined;

        /*if (
                    !foundConnection
                ) {
                  return Promise.resolve(false);
                }*/

        let connectionConfig = {};
        if (foundConnection) {
          let transports = [];
          if (foundConnection.transports) {
            if (foundConnection.transports.websocket === true) {
              transports.push('websocket');
            }
            if (foundConnection.transports.polling === true) {
              transports.push('polling');
            }
          }

          connectionConfig = {
            transportOptions: {
              polling: {
                extraHeaders:
                  _table.toObject(foundConnection.headers || []) || {},
              },
            },
            query:
              _table.toObject(
                foundConnection[STRINGS.URL.QUERY_PARAMS] || []
              ) || {},
            path: foundConnection.path || '',
            transports,
          };
        }

        let reqConfig = config;
        if (
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.config
        ) {
          reqConfig = state_Ref.current.request.config;
        }

        socketConfig = Object.assign({}, connectionConfig, reqConfig);

        //TODO: uncomment later
        /*if (misc.isElectron()=== true && reqConfig) {

                  //SSL and Proxy
                  let manager = _commonFns.getSSLandProxyPayload();
                  if (manager.ssl) {
                    socketConfig = Object.assign({}, socketConfig, {
                      ssl: manager.ssl
                    });
                  }

                  if (manager.proxy) {
                    socketConfig = Object.assign({}, socketConfig, {
                      proxy: manager.proxy
                    });
                  }
                }*/

        /**
         * Remove QUERY_PARAMS from url string
         * @type {string}
         */
        if (raw_url) {
          let urlObj = _url.toObject(raw_url);
          if (urlObj) {
            urlObj = _object.omit(urlObj, [STRINGS.URL.QUERY_PARAMS]);
          }
          urlStr = _url.toString(urlObj);
        }
        // console.log(`urlStr`, urlStr)
      } catch (e) {
        console.log(`ERROR:: Generate socket request config: `, e);
      }

      /**
       * Append namespace to the URL
       */
      if (foundConnection) {
        urlStr = (urlStr || raw_url || '').concat(
          foundConnection.namespace || ''
        );
      }

      return {
        url: urlStr || raw_url || '',
        config: socketConfig,
      };
    },

    /**
     * onConnect: To connect socket
     * @param connectionId: String// connection id which you want to connect
     * @returns {Promise.<void>}
     */
    onConnect: async (connectionId = '') => {
      if (!connectionId && state_Ref?.current?.request?._dnp) {
        connectionId = state_Ref.current.request._dnp.runtime_activeConnection;
      }

      if (!connectionId) return;

      // Check if connection is exist
      const connectionInstance = SocketInstances_Ref.get(connectionId);
      const resConn =
        store_client?.getState()?.connections?.get(runtime_activeConnection) ||
        {};

      if (
        connectionInstance &&
        resConn &&
        resConn.meta &&
        resConn.meta.state === EConnectionState.Open
      ) {
        return;
      }

      const envVariables = _cloneDeep(_commonFns.getMergedVariables() || {});

      try {
        const connection =
          state_Ref.current &&
          state_Ref.current.request &&
          state_Ref.current.request.connections
            ? _cloneDeep(
                state_Ref.current.request.connections.find(
                  (conn) => conn.id === connectionId
                )
              )
            : undefined;

        if (_misc.firecampAgent() === EFirecampAgent.desktop) {
          // Fetch variables to parse URL to fetch cookies
          const envVar = _commonFns.getMergedVariables();

          // Fetch Cookie by DOMAIN in Socket.IO client connection request
          // if platform is electron
          const cookie = await firecampFunctions.cookieManager.getCookies(
            _env.applyVariables(raw_url, envVar)
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

        const { url, config } = new ConfigGenerator({
          raw_url: state_Ref?.current?.request?.raw_url || raw_url || '',
          config: state_Ref?.current?.request?.config || request.config || {},

          // Omit queryParams from connection as they will be sent through raw_url
          connection: _object.omit(connection, ['queryParams']) || {},

          ssl_manager: sslManager || [],
          proxy_manager: proxyManager || [],
          envVariables,
        }).prepare();

        const executor =
          _misc.firecampAgent() !== EFirecampAgent.desktop
            ? new Executor({
                io: {
                  v2,
                  v3,
                  v4,
                },
                agent:
                  _misc.firecampAgent() === EFirecampAgent.desktop
                    ? EFirecampAgent.desktop
                    : EFirecampAgent.extension,
                connectionId,
                url,
                config,
                envVariables,
              })
            : window.fc.io({
                agent: EFirecampAgent.desktop,
                connectionId,
                url,
                config,
                envVariables,
              });

        if (executor) {
          executor.connectionState((result) => {
            _socketFns.onStateChange(connectionId, result);
          });

          executor.subscribe((result) => {
            _socketFns.onSubscribe(connectionId, result);
          });

          executor.connect();

          SocketInstances_Ref.set(connectionId, executor);
        }
      } catch (e) {
        console.log('Error while connect in Socket.IO: ', e);
      }
    },

    onEmit: async (connectionId = '', emitterToEmit = {}) => {
      if (!connectionId || !connectionId.length) {
        connectionId = runtime_activeConnection;
      }

      let instance = SocketInstances_Ref.get(connectionId);
      let resConn =
        store_client?.getState()?.connections?.get(runtime_activeConnection) ||
        {};

      if (
        !instance ||
        (resConn?.meta?.state !== EConnectionState.Open &&
          !instance?.connected())
      ) {
        _responseConnectionLogFns.addErrorLog(
          SYSTEM_LOGS.notConnected,
          runtime_activeConnection
        );
        return;
      }

      let emitter = {};

      if (_object.isEmpty(emitterToEmit)) {
        emitter = _cloneDeep(
          state_Ref?.current?.request?.playground || request.playground
        );
      } else {
        emitter = _cloneDeep(emitterToEmit);
      }

      if (!emitter?.name) return;

      let args = [];

      if (Array.isArray(emitter.body)) {
        for await (const arg of emitter.body) {
          if (arg.meta.type === EMITTER_PAYLOAD_TYPES.file && arg.payload) {
            arg.name = arg?.payload?.name;
            arg.payload = await _file.readAsArrayBuffer(arg.payload);
          }
          if (arg.meta.type !== EMITTER_PAYLOAD_TYPES.no_body) {
            args.push(arg);
          }
        }
      }

      if (emitter.meta && emitter.meta.ack === true) {
        instance.emitWithAck(emitter.name || '', args, emitter.meta.interval);
      } else {
        instance.emit(emitter.name || '', args, emitter.meta.interval);
      }

      _commonFns.setHistory(connectionId);
    },
    onAddListener: (connectionId = '', name = '') => {
      let instance = SocketInstances_Ref.get(connectionId);
      if (!instance) return;
      // console.log(`onAddListener`, name, instance);
      instance.addListener(name);
    },
    onAddListeners: (connectionId = '', listeners = []) => {
      let instance = SocketInstances_Ref.get(connectionId);
      if (!instance) return;
      instance.addListeners(listeners);
    },
    onRemoveListener: (connectionId = '', name = '') => {
      let instance = SocketInstances_Ref.get(connectionId);
      if (!instance) return;
      instance.removeListener(name);
    },
    onRemoveListeners: (connectionId = '', listeners = []) => {
      let instance = SocketInstances_Ref.get(connectionId);
      if (!instance) return;
      instance.removeListeners(listeners);
    },
    onRemoveAllListeners: (connectionId = '') => {
      let instance = SocketInstances_Ref.get(connectionId);
      if (!instance) return;
      instance.removeAllListeners();
    },
    onStateChange: async (connectionId = '', payload = {}) => {
      _responseConnectionLogFns.addLog(payload, connectionId);

      if (
        payload.meta &&
        payload.meta.event === 'connect' &&
        payload.meta.color === 'success'
      ) {
        let instance = SocketInstances_Ref.get(connectionId);
        if (!instance) return;

        _responseConnectionFns.update(connectionId, {
          meta: {
            state: EConnectionState.Open,
            socketId: instance.socketID() || '',
          },
        });

        let resConn =
          store_client?.getState()?.connections?.get(connectionId) || {};

        //listen all listeners who's value is true
        /*  if (
           resConn &&
           resConn.listeners &&
           typeof resConn.listeners === 'object'
         ) {
           let listenersList = [];
           for (let name in resConn.listeners) {
             if (resConn.listeners[name] === true) {
               listenersList.push(name);
             }
           }
           if (listenersList && listenersList.length) {
             _socketFns.onAddListeners(connectionId, listenersList);
           }
         } */

        _resConnListenerFns.updateListenersOnConnect(connectionId);
      }

      if (
        [
          'connect_error',
          'connect_timeout',
          'error',
          'disconnect',
          'reconnect_error',
          'reconnect_failed',
        ].includes(payload.meta.event)
      ) {
        await _responseConnectionFns.update(connectionId, {
          meta: {
            state: EConnectionState.Closed,
            socketId: '',
          },
        });
      }

      if (
        [
          'connecting',
          'reconnect',
          'reconnect_attempt',
          'reconnecting',
        ].includes(payload.meta.event)
      ) {
        await _responseConnectionFns.update(connectionId, {
          meta: {
            state: EConnectionState.Connecting,
            socketId: '',
          },
        });
      }
    },

    onSubscribe: async (connectionId = '', payload = {}) => {
      _responseConnectionLogFns.addLog(payload, connectionId);
    },
    onPing: (connectionId = '', interval, pingOff = false) => {
      // console.log(`ping`, interval);
      let foundConnection =
        state_Ref.current &&
        state_Ref.current.request &&
        state_Ref.current.request.connections
          ? state_Ref.current.request.connections.find(
              (conn) => conn.id === connectionId
            )
          : undefined;

      let intervalValue = interval;

      if (foundConnection && intervalValue === undefined) {
        intervalValue = foundConnection['pingInterval'];
      }

      let instance = SocketInstances_Ref.get(connectionId);
      // console.log(`instance`, instance);
      if (!instance) return;
      if (pingOff === false) {
        // console.log(`intervalValue`, intervalValue);
        instance.ping(intervalValue);
      } else {
        instance.stopPinging();
      }
    },

    disconnect: (connectionId = '') => {
      try {
        const executor = SocketInstances_Ref.get(connectionId);
        if (!executor) return;

        executor.close();
      } catch (e) {}
    },
  };

  /**
   * _commonFns: Client common fns
   * @type {{getMergedVariables: (())}
   * @private
   */
  let _commonFns = {
    getMergedVariables: () => {
      let mergedVars = {};
      const collectionId = tabData?.request?._meta?.collectionId || '';

      if (environments) {
        const defaultGlobalEnv =
          activeEnvs.workspace || environments.getDefaultEnvironment('global');
        const defaultProjectEnv =
          activeEnvs.project ||
          environments.getDefaultEnvironment(collectionId);

        mergedVars =
          environments.getVariablesByTabId({
            globalEnvID: defaultGlobalEnv || '',
            collectionId: collectionId || '',
            collectionEnvID: defaultProjectEnv || '',
          }) || {};
      }

      // console.log("mergedVars", mergedVars);
      return _cloneDeep(mergedVars);
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
     * @param collectionId: String// parent project id
     * @param folderId: String// parent module id
     * @private
     */
    onSave: async ({
      name,
      description,
      project: collectionId,
      module: folderId,
    }) => {
      await _commonFns.updateCacheEmitterOnSave();

      await propOnSave(
        {
          name,
          description,
          project: collectionId,
          module: folderId,
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
      await _commonFns.updateCacheEmitterOnSave();

      propsOnUpdateRequest(state_Ref.current);
    },

    setHistory: (connectionId = '') => {
      if (!connectionId || !connectionId.length) {
        connectionId = runtime_activeConnection;
      }

      let history_payload = {},
        history_connections = [];

      let connectionPayload = req_connections.find(
        (con) => con.id === connectionId
      );

      if (connectionPayload) {
        history_connections = [{ ...connectionPayload, isDefault: true }];
      }
      let request = _object.pick(state_Ref?.current?.request || request, [
        'raw_url',
        'url',
        'config',
        'listeners',
      ]);
      console.log(`hello`, state_Ref?.current?.request?.playground);

      if (state_Ref?.current?.request?.playground) {
        const leafId = id(),
          leafPayload =
            _object.pick(state_Ref?.current?.request?.playground, [
              'name',
              'body',
              'meta',
            ]) || {};

        leafPayload._meta = {
          id: leafId,
        };

        history_payload = {
          request: {
            ...request,
            connections: history_connections,
            meta: {
              version: '2.0',
              type: ERequestTypes.SocketIO,
              ['iOrders']: [leafId],
            },
          },
          leaf: leafPayload,
          _meta: (state_Ref?.current?.request || request)?._meta,
        };

        console.log(`SIO: history_payload`, history_payload);
        propOnSendMessage(Object.assign({}, history_payload));
      }
    },

    updateCacheEmitterOnSave: () => {
      if (request && request._dnp && request._dnp.active_emitter) {
        _cacheEmittersFns.onSave(request._dnp.active_emitter);
      }
    },

    setVisiblePanel: (panel) => {
      if (!panel) return;
      setVisiblePanel(panel);
    },
  };

  /**
   * _responseConnectionLogFns: Response emitters functions
   * @type {{addLog: *}}
   * @private
   */
  let _responseConnectionLogFns = {
    /**
     * addLog: To add log in socket response connection tab which is active
     * {title = "", message = "", meta:{type = "", color = ""}}
     * connectionId: String// id for which connection you want to set message.
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
        connectionId = ''
      ) => {
        if (!connectionId) return;

        store_client.setState((state) => {
          let connectionsLogs = state.connectionLogs || new Map();
          let resConnLogs = connectionsLogs.get(connectionId);
          let logPayload = Object.assign({}, InitLog, log, {
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
              log.meta.type !== ELogTypes.System
            ) {
              let newLog = Object.assign({}, logPayload, {
                meta: Object.assign({}, logPayload.meta, {
                  count: (lastLog.meta.count || 0) + 1,
                }),
              });
              // console.log(`newLog`, newLog);
              newLogs = [
                ...resConnLogs.slice(0, resConnLogs.length - 1),
                newLog,
              ];
            } else {
              //TODO: uncomment later
              newLogs = [...resConnLogs, logPayload];
            }
          } else {
            newLogs = [logPayload];
          }
          return {
            connectionLogs: new Map([
              ...connectionsLogs,
              [connectionId, newLogs],
            ]),
          };
        });
      },
      [store_client?.getState()?.connections?.values()]
    ),

    addErrorLog: (message = '', connectionId = '') => {
      _responseConnectionLogFns.addLog(
        {
          title: message || '',
          message: '',
          meta: {
            event: 'disconnected',
            type: ELogTypes.System,
            color: 'danger',
          },
        },
        connectionId
      );
    },

    clearAll: (connectionId) => {
      if (!connectionId) return;
      store_client.setState((state) => {
        let connectionsLogs = state.connectionLogs || new Map();
        connectionsLogs.delete(connectionId);
        return { connectionLogs: new Map([...connectionsLogs]) };
      });
    },
  };

  let _collectionFns = {
    emitters: {
      add: async ({ label = '', parent_id = '', path = '' }) => {
        if (
          !request?.playground?.name ||
          RESERVED_EMITTER_EVENTS.includes(request?.playground?.name)
        ) {
          return;
        }

        let emitterId = id();

        //TODO: update code arg wise
        /*if (
                request.playground.type === "no_body" ||
                request.playground.type === EMITTER_PAYLOAD_TYPES.file
            ) {
              return;
            }*/

        let emitterPayload = Object.assign(
          {},
          {
            name: request.playground.name,
            body: request.playground.body,
            meta: Object.assign({}, request.playground.meta, { label }),
            _meta: {
              id: emitterId,
              parent_id,
            },
          }
        );
        // console.log(`emitterPayload`, emitterPayload);

        await _cacheEmittersFns.add(
          Object.assign({}, request.playground, emitterPayload, { path })
        );
        await setState({
          type: ADD.COLLECTION_EMITTER,
          value: emitterPayload,
        });

        await _requestFns.updateDNP({ active_emitter: emitterId });

        //Update parent orders on add emitter
        await _collectionFns.updateOrders({
          action: 'add',
          key: 'iOrders',
          parent_id,
          id: emitterId,
        });

        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.ADD_COLLECTION_EMITTER,
          payload: emitterPayload,
        });
        _commonFns.onUpdateRequest(tabData);
      },

      update: async ({ id, key, value }) => {
        if (!id || !key) return;

        if (key !== 'path') {
          // console.log(`id`, id, key, value);
          await setState({ type: UPDATE.COLLECTION_EMITTER, id, key, value });
          _commonFns.onChange({
            action: ON_CHANGE_ACTIONS.UPDATE_COLLECTION_EMITTER,
            payload: { id, key, value },
          });
        }
        _cacheEmittersFns.update(id, { [key]: value });
      },

      remove: (id) => {
        if (!id) return;
        // console.log(`id`, id);

        let emitterFound = collection.emitters.find(
          (emitter) => emitter._meta.id === id
        );
        // console.log(`emitterFound`, emitterFound);
        if (emitterFound) {
          setState({ type: DELETE.COLLECTION_EMITTER, value: id });

          let parent_id = emitterFound._meta.parent_id || '';
          //Update parent orders on remove emitter
          _collectionFns.updateOrders({
            action: 'remove',
            key: 'iOrders',
            parent_id,
            id,
          });

          _commonFns.onChange({
            action: ON_CHANGE_ACTIONS.REMOVE_COLLECTION_EMITTER,
            payload: id,
          });

          _cacheEmittersFns.remove(id);
        }
      },

      set: (id = '', payload = {}) => {
        if (!id || !payload) return;

        setState({ type: SET.COLLECTION_EMITTER, id, value: payload });
        _commonFns.onChange({
          action: ON_CHANGE_ACTIONS.SET_COLLECTION_EMITTER,
          payload: { id, payload },
        });
      },
    },

    directories: {
      add: (payload = {}) => {
        // console.log(`payload`, payload);
        let { name = '', parent_id = '' } = payload,
          directoryID = id();

        let directoryPayload = {
          name,
          _meta: {
            id: directoryID,
            parent_id,
          },
          meta: {
            fOrders: [],
            iOrders: [],
          },
        };
        console.log(`directoryPayload`, directoryPayload);

        setState({ type: ADD.COLLECTION_DIRECTORY, value: directoryPayload });

        // debugger
        console.log(`coll`, collection);
        //Update parent orders on add directory
        _collectionFns.updateOrders({
          action: 'add',
          key: 'fOrders',
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
            key: 'fOrders',
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
          let emittersToRemoveIds = [];

          if (collection.directories) {
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

              // Child emitter ids
              let childemitterIds = collection.emitters
                .filter((childEmtr) => childEmtr._meta.parent_id === dirId)
                .map((childEmtr) => childEmtr._meta.id);

              if (!_array.isEmpty(childDirIds)) {
                dirsToRemoveIds = dirsToRemoveIds.concat(childDirIds);

                // Recall: getChildren if child directory is parent of another directory
                for await (const childDirId of childDirIds) {
                  await getChildren(childDirId);
                }
              }

              if (!_array.isEmpty(childemitterIds)) {
                emittersToRemoveIds =
                  emittersToRemoveIds.concat(childemitterIds);
              }
              return Promise.resolve(true);
            };
            await getChildren(id);

            //-----------------------------------------------------------------------------------//

            if (collection.emitters && emittersToRemoveIds) {
              // emitterRes: Collection emitters to set
              let emitterRes = collection.emitters.filter(
                (emtr) => !emittersToRemoveIds.includes(emtr._meta.id)
              );

              if (emitterRes && !equal(emitterRes, collection.emitters)) {
                _collectionFns.updateCollection('emitters', emitterRes);
              }
              _cacheEmittersFns.removeMultiple(emittersToRemoveIds);
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
      key = 'iOrders',
      parent_id = '',
      id = '',
    }) => {
      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parent_id && parent_id.length ? 'DIR' : ERequestTypes.SocketIO;

      //Get existing orders from parent
      if (parentType === ERequestTypes.SocketIO) {
        existingOrders = meta[key];
        // console.log(`existingOrders`, existingOrders);
      } else if (parentType === 'DIR' && parent_id.length) {
        if (collection.directories) {
          // console.log(`collection.directories`, collection.directories)
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
        // console.log(`existingOrders,`, existingOrders);
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
      if (parentType === ERequestTypes.SocketIO) {
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

  let _cacheEmittersFns = {
    setToPlayground: (payload) => {
      if (!payload?._meta?.id) return;
      _requestFns.setPlayground(payload);
    },

    add: (
      payload,
      setOriginal = false,
      appendExistingPayload = false,
      emit = false
    ) => {
      if (!payload?._meta?.id) return;

      // console.log(`payload`, payload)

      let emitter =
        state_Ref?.current?.collection?.emitters?.find(
          (emitter) => emitter._meta.id === payload._meta.id
        ) || {};
      let emitterToSetInPlayground = {};

      emitterToSetInPlayground = Object.assign({}, emitter, payload); //TODO: check

      store_client.setState((state) => {
        let collectionEmitters = state.collectionEmittersCache || new Map();
        if (collectionEmitters.has(payload._meta.id) && setOriginal === false) {
          let existingEmitter = collectionEmitters.get(payload._meta.id);

          // console.log(`appendExistingPayload`, appendExistingPayload)

          if (appendExistingPayload === true) {
            emitterToSetInPlayground = Object.assign(
              {},
              emitterToSetInPlayground,
              existingEmitter
            );
          } else {
            emitterToSetInPlayground = Object.assign(
              {},
              existingEmitter,
              emitterToSetInPlayground
            );
          }
          return { collectionEmittersCache: collectionEmitters };
        } else {
          return {
            collectionEmittersCache: new Map([
              ...collectionEmitters,
              [payload._meta.id, payload],
            ]),
          };
        }
      });

      // console.log(`emitterToSetInPlayground`, emitterToSetInPlayground);

      _cacheEmittersFns.setToPlayground(emitterToSetInPlayground);

      if (emit === true && emitterToSetInPlayground) {
        _socketFns.onEmit(runtime_activeConnection, emitterToSetInPlayground);
      }
    },

    update: (id = '', payload = {}) => {
      //console.log({ id, payload });
      if (
        request &&
        request._dnp &&
        request._dnp.active_emitter &&
        request._dnp.active_emitter === id
      ) {
        _requestFns.updateEmitter(payload);
      }

      store_client.setState((state) => {
        let collectionEmitters = state.collectionEmittersCache || new Map();
        if (collectionEmitters.has(id)) {
          let existingEmitter = collectionEmitters.get(id),
            newEmitter = Object.assign({}, existingEmitter, payload);
          return {
            collectionEmittersCache: new Map([
              ...collectionEmitters,
              [id, newEmitter],
            ]),
          };
        } else {
          return { collectionEmittersCache: collectionEmitters };
        }
      });
    },

    remove: (id) => {
      if (!id) return;

      store_client.setState((state) => {
        let collectionEmitters = state.collectionEmittersCache || new Map();
        collectionEmitters.delete(id);
        return { collectionEmittersCache: new Map([...collectionEmitters]) };
      });

      if (
        request &&
        request._dnp &&
        request._dnp.active_emitter &&
        request._dnp.active_emitter === id
      ) {
        _cacheEmittersFns.addNewEmitter();
      }
    },

    removeMultiple: (ids = []) => {
      store_client.setState((state) => {
        let collectionEmitters = state.collectionEmittersCache || new Map();
        ids.map((id) => {
          collectionEmitters.delete(id);
        });

        return { collectionEmittersCache: new Map([...collectionEmitters]) };
      });

      if (
        request &&
        request._dnp &&
        request._dnp.active_emitter &&
        ids.includes(request._dnp.active_emitter)
      ) {
        _cacheEmittersFns.addNewEmitter();
      }
    },

    setToOriginal: (id) => {
      if (state_Ref?.current?.collection?.emitters && id) {
        let oringinal = state_Ref?.current?.collection.emitters.find(
          (emitter) => emitter._meta.id === id
        );
        if (oringinal) {
          if (request.playground) {
            oringinal = Object.assign({}, oringinal, {
              path: request.playground.path || '',
            });
          }

          store_client.setState((state) => {
            let collectionEmitters = state.collectionEmittersCache || new Map();
            return {
              collectionEmittersCache: new Map([
                ...collectionEmitters,
                [id, oringinal],
              ]),
            };
          });

          _cacheEmittersFns.setToPlayground(oringinal);
        }
      }
    },

    onSave: async (id) => {
      let existingEmtrs = state_Ref?.current?.collection?.emitters;

      if (existingEmtrs) {
        let EmitterFound = existingEmtrs.find(
          (emitter) => emitter._meta.id === id
        );

        let collEmitters =
          store_client?.getState()?.collectionEmittersCache || new Map();

        if (EmitterFound && collEmitters && collEmitters.has(id)) {
          let emitterToSave = collEmitters.get(id);
          // console.log(`emitterToSave`, emitterToSave);
          if (emitterToSave) {
            let emitterInCollection = Object.assign(
              {},
              EmitterFound,
              emitterToSave
            );

            // console.log(`emitterInCollection`, emitterInCollection);

            if (emitterInCollection.name && !!emitterInCollection.name.trim()) {
              _collectionFns.emitters.set(id, emitterInCollection);
            }
          }
        }
      }
    },

    addNewEmitter: () => {
      _requestFns.setPlayground(InitPayload);
      _requestFns.updateDNP({ active_emitter: '' });
    },

    clearAll: () => {
      store_client.setState((state) => {
        let collectionEmitters = state.collectionEmittersCache || new Map();
        collectionEmitters.clear();
        return { collectionEmittersCache: new Map([...collectionEmitters]) };
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

    update: async (id, payload) => {
      if (!id || !payload) return;
      // console.log(`id, payload`, id, payload);
      // console.log(`from`, from);

      let updatedPayload = Object.assign({}, payload);

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        let existing = resConnectionList.get(id);
        if (existing) {
          updatedPayload = _object.mergeDeep(existing, payload);
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
        let connectionsLogs = state.connectionLogs || new Map();
        connectionsLogs.delete(id);
        return { connectionLogs: new Map([...connectionsLogs]) };
      });

      SocketInstances_Ref.delete(id);
    },

    clearAll: () => {
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.clear();
        return { connections: new Map([...resConnectionList]) };
      });
    },
  };

  let _resConnListenerFns = {
    //Add single listener to all connection
    addListener: (name = '', listen = false) => {
      let connections = [];

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.forEach((value, key) => {
          let instance = SocketInstances_Ref.get(key);
          let listeners = value.listeners || {};
          if (instance?.connected()) {
            listeners = Object.assign({}, listeners, { [name]: listen });
            connections.push(key);
          } else {
            listeners = Object.assign({}, listeners, { [name]: false });
            /*_responseConnectionLogFns.addErrorLog(
              SYSTEM_LOGS.notConnected,
              key
            );*/
          }
          resConnectionList.set(key, Object.assign({}, value, { listeners }));
        });
        return { connections: new Map([...resConnectionList]) };
      });
      if (connections && listen === true) {
        connections.map((conn) => {
          _socketFns.onAddListener(conn, name);
        });
      }
    },

    //Remove one listener from all connections
    removeListener: (name = '') => {
      let connListeners = {};

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.forEach((value, key) => {
          let listeners = value.listeners || {};
          listeners = _object.omit(listeners, [name]);
          connListeners = Object.assign({}, connListeners, {
            [key]: value.listeners,
          });
          // console.log({ listeners });
          resConnectionList.set(key, Object.assign({}, value, { listeners }));
        });
        return { connections: new Map([...resConnectionList]) };
      });

      if (connListeners) {
        for (let conn in connListeners) {
          if (connListeners[conn][name] === true) {
            _socketFns.onRemoveListener(conn, name);
          }
        }
      }
    },

    //Update single listener from single connection
    updateConnListener: (connectionId = '', name = '', listen = false) => {
      let instance = SocketInstances_Ref.get(connectionId);

      if (instance?.connected()) {
        store_client.setState((state) => {
          let resConnectionList = state.connections || new Map();
          let connection = resConnectionList.get(connectionId);
          if (!connection) return;
          let listeners = connection.listeners || {};

          listeners = Object.assign({}, listeners, { [name]: listen });
          resConnectionList.set(
            connectionId,
            Object.assign({}, connection, { listeners })
          );
          return { connections: new Map([...resConnectionList]) };
        });
      } else {
        _responseConnectionLogFns.addErrorLog(
          SYSTEM_LOGS.notConnected,
          connectionId
        );
      }

      if (listen === true) {
        _socketFns.onAddListener(connectionId, name);
      } else {
        _socketFns.onRemoveListener(connectionId, name);
      }
    },

    //Update all listeners for single connection
    updateAllListenersByConnID: (connectionId = '', listen = true) => {
      let listenerNames = [];
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        let instance = SocketInstances_Ref.get(connectionId);
        if (instance?.connected()) {
          let connection = resConnectionList.get(connectionId);
          if (!connection) return;
          let listeners = connection.listeners || {};
          if (!Array.isArray(listeners)) {
            for (let key in listeners) {
              listeners = Object.assign({}, listeners, { [key]: listen });
            }
          }
          resConnectionList.set(
            connectionId,
            Object.assign({}, connection, { listeners })
          );
          listenerNames = Object.keys(listeners || {});
        }
        return { connections: new Map([...resConnectionList]) };
      });

      if (listenerNames.length) {
        if (listen === true) {
          _socketFns.onAddListeners(connectionId, listenerNames);
        } else {
          _socketFns.onRemoveAllListeners(connectionId, listenerNames);
        }
      }
    },

    //Update listeners for single connection on connect, set listen true
    updateListenersOnConnect: (connectionId = '') => {
      let onConnectListeners =
        state_Ref.current?.request?.config?.on_connect_listeners || [];

      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        let instance = SocketInstances_Ref.get(connectionId);
        if (instance.connected()) {
          let connection = resConnectionList.get(connectionId);
          if (!connection) return;
          let listeners = Object.assign({}, connection.listeners);

          if (!Array.isArray(listeners)) {
            for (let key in listeners) {
              listeners = Object.assign({}, listeners, {
                [key]: onConnectListeners.includes(key),
              });
            }
          }

          resConnectionList.set(
            connectionId,
            Object.assign({}, connection, { listeners: listeners })
          );
        }
        return { connections: new Map([...resConnectionList]) };
      });

      _socketFns.onAddListeners(connectionId, onConnectListeners);
    },

    //Update all listeners for all connections
    updateAllConnListeners: (listen = true) => {
      let connections = {};
      store_client.setState((state) => {
        let resConnectionList = state.connections || new Map();
        resConnectionList.forEach((value, key) => {
          let instance = SocketInstances_Ref.get(key);
          if (instance.connected()) {
            let listeners = value.listeners || {};
            if (!Array.isArray(listeners)) {
              for (let key in listeners) {
                listeners = Object.assign({}, listeners, { [key]: listen });
              }
            }
            resConnectionList.set(key, Object.assign({}, value, { listeners }));
          }
          let listenerNames = Object.keys(listeners || {});
          connections = Object.assign({}, connections, {
            [key]: listenerNames,
          });
        });
        return { connections: new Map([...resConnectionList]) };
      });

      for (let conn in connections) {
        if (listen === true) {
          _socketFns.onAddListeners(conn, connections[conn]);
        } else {
          _socketFns.onRemoveAllListeners(conn, connections[conn]);
        }
      }
    },
  };

  let _storeClientFns = {
    updateResActiveConn: (connectionId) => {
      if (!connectionId) return;

      store_client.setState({ resActiveConn: connectionId });
    },
  };

  return (
    <SocketContext.Provider
      value={{
        //props
        ctx_firecampFunctions: firecampFunctions,
        ctx_constants: propConstants,
        ctx_tabData: tabData,
        ctx_environments: environments,

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
        ctx_socketFns: _socketFns,
        ctx_commonFns: _commonFns,
        ctx_collectionFns: _collectionFns,
        ctx_responseConnectionLogFns: _responseConnectionLogFns,
        ctx_cacheEmittersFns: _cacheEmittersFns,
        ctx_resConnListenerFns: _resConnListenerFns,

        ctx_emitter: emitterRef,
        ctx_onUpdateEnvironment: onUpdateEnvironment,

        // Zustand store functions
        ctx_storeClientFns: _storeClientFns,
      }}
    >
      <RootContainer className="fc-h-full w-full ws-tab">
        <Container className="fc-h-full with-divider">
          <Container.Header>
            <URLbar
              runtimeActiveConnection={runtime_activeConnection || ''}
              tabData={{
                id: tabData.id,
                meta: tabData.meta,
                type: tabData.type,
                ...tabData,
              }}
              raw_url={raw_url}
              version={config.version}
            />
          </Container.Header>
          <Container.Body>
            <Row className="with-divider" height={'100%'}>
              <Request
                collection={collection || []}
                meta={meta || {}}
                tabData={tabData || {}}
                runtimeActiveConnection={runtime_activeConnection || ''}
                config={config}
                connections={req_connections || []}
                playground={request.playground || {}}
                _dnp={request._dnp}
                visiblePanel={visiblePanel}
                listeners={request.listeners}
              />
              <Response
                runtimeActiveConnection={runtime_activeConnection}
                visiblePanel={visiblePanel}
                setVisiblePanel={_commonFns.setVisiblePanel}
                // Combination of listeners and emitters name to show filter event name
                eventsList={_array.uniq([
                  ...(request.listeners || []),
                  ...(collection.emitters || []).map((e) => e?.name || ''),
                ])}
              />
            </Row>
          </Container.Body>
        </Container>
      </RootContainer>
    </SocketContext.Provider>
  );
};
export default Socket;

Socket.defaultProps = {
  firecampFunctions: {},
  constants: {},
  tabData: {},
  tabFn: {},
  sslManager: [],
  proxyManager: [],

  request: {},
  collection: [],
  additionalComponents: {},
  onChange: () => {},
  onSave: () => {},
  onUpdate: () => {},
  onEmitMessage: () => {},
};

Socket.propTypes = {
  firecampFunctions: PropTypes.object.isRequired,
  constants: PropTypes.object.isRequired,
  tabData: PropTypes.object.isRequired,
  tabFns: PropTypes.object.isRequired,
  sslManager: PropTypes.array,
  proxyManager: PropTypes.array,

  request: PropTypes.object.isRequired,
  collection: PropTypes.object,
  additionalComponents: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onEmitMessage: PropTypes.func,
};
