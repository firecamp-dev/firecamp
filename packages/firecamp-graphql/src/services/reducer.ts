// @ts-nocheck
import equal from 'deep-equal';

import { AUTH_TYPES } from '../constants/constants';

const ACTIONS = {
  UPDATE: {
    REQUEST: 'REQUEST',
    RAW_URL: 'RAW_URL',
    URL: 'URL',
    METHOD: 'METHOD',
    HEADERS: 'HEADERS',
    AUTH_HEADERS: 'AUTH_HEADERS',

    ACTIVE_AUTH: 'ACTIVE_AUTH',
    ACTIVE_AUTH_VALUE: 'ACTIVE_AUTH_VALUE',
    OAUTH2_ACTIVE_GRANT_TYPE: 'OAUTH2_ACTIVE_GRANT_TYPE',
    OAUTH2_ACTIVE_GRANT_TYPE_VALUE: 'OAUTH2_ACTIVE_GRANT_TYPE_VALUE',
    GRAPHQL_BODY: {
      QUERY: 'QUERY',
      RUNNER_QUERY: 'RUNNER_QUERY',
      QUERIES: 'QUERIES',
      ON_TOGGLE: 'ON_TOGGLE',
      GRAPHQL_SCHEMA: 'GRAPHQL_SCHEMA',
      QUERY_RESPONSE: 'QUERY_RESPONSE',
      FILES: 'FILES',
      SAVED_QUERY: 'SAVED_QUERY',
      CURRENT_QUERY: 'CURRENT_QUERY',
      ADD_GRAPHQL_BODY_QUERY: 'ADD_GRAPHQL_BODY_QUERY',
      UPDATE_GRAPHQL_BODY_QUERY: 'UPDATE_GRAPHQL_BODY_QUERY',
      DELETE_GRAPHQL_BODY_QUERY: 'DELETE_GRAPHQL_BODY_QUERY',
      PLAYGROUND: 'PLAYGROUND',
    },
  },
  SET: {
    STATE: 'STATE',
    RESPONSE: 'RESPONSE',
    RESPONSE_EMPTY: 'RESPONSE_EMPTY',
    SEND_BUTTON_TEXT: 'SEND_BUTTON_TEXT',
    IS_REQUEST_RUNNING: 'IS_REQUEST_RUNNING',
  },
};

const { UPDATE, SET } = ACTIONS;

const reducer = (state, action) => {
  if (!Object.keys(action).length || !Object.keys(action).includes('type'))
    return;

  switch (action.type) {
    case SET.STATE:
      return action.value;

    case UPDATE.REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          [action.key]: action.value,
        },
      };

    case UPDATE.URL:
      if (!action.value) {
        return state;
      }

      return {
        ...state,
        request: {
          ...state.request,
          raw_url: action.value.raw_url || '',
          url: action.value.url || {},
        },
      };

    case UPDATE.METHOD:
      return {
        ...state,
        request: {
          ...state.request,
          method: action.value,
        },
      };
    case UPDATE.ACTIVE_AUTH:
      return {
        ...state,
        request: {
          ...state.request,
          active_auth_type: action.value,
        },
      };

    case UPDATE.ACTIVE_AUTH_VALUE:
      return {
        ...state,
        request: {
          ...state.request,
          auth: {
            ...state.request.auth,
            [action.value.type]: Object.assign(
              state.request.auth[action.value.type],
              { [action.value.key]: action.value.value }
            ),
          },
        },
      };
    case UPDATE.OAUTH2_ACTIVE_GRANT_TYPE:
      return {
        ...state,
        request: {
          ...state.request,
          auth: {
            ...state.request.auth,
            [AUTH_TYPES.OAUTH2]: Object.assign(
              state.request.auth[AUTH_TYPES.OAUTH2],
              {
                active_grant_type: action.value,
              }
            ),
          },
        },
      };

    case UPDATE.OAUTH2_ACTIVE_GRANT_TYPE_VALUE:
      return {
        ...state,
        request: {
          ...state.request,
          auth: {
            ...state.request.auth,
            [AUTH_TYPES.OAUTH2]: Object.assign(
              state.request.auth[AUTH_TYPES.OAUTH2],
              {
                grant_types: {
                  ...state.request.auth[AUTH_TYPES.OAUTH2].grant_types,
                  [action.value.type]: Object.assign(
                    state.request.auth[AUTH_TYPES.OAUTH2].grant_types[
                      action.value.type
                    ],
                    {
                      [action.value.key]: action.value.value,
                    }
                  ),
                },
              }
            ),
          },
        },
      };
    case UPDATE.HEADERS:
      return {
        ...state,
        request: {
          ...state.request,
          headers: action.value,
        },
      };
    case SET.SEND_BUTTON_TEXT:
      return {
        ...state,
        sendButtonText: action.value,
      };
    case UPDATE.SNIPPET_DATA:
      if (action.action === 'onChangeLangunage') {
        const { language, client = '', snippet = '' } = action.value;
        return {
          ...state,
          snippetData: {
            ...state.snippetData,
            activeLanguage: language,
            activeClient: client.length ? client : '',
            snippet,
          },
        };
      }
      if (action.action === 'toggleSnippet') {
        return {
          ...state,
          snippetData: {
            ...state.snippetData,
            isOpen: !state.snippetData.isOpen,
          },
        };
      }
      break;

    case SET.IS_REQUEST_RUNNING:
      return {
        ...state,
        isRequestRunning: action.value,
      };

    case SET.RESPONSE:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          response: { ...action.value },
        },
      };

    case SET.RESPONSE_EMPTY:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          response: {},
        },
      };

    case UPDATE.AUTH_HEADERS:
      return {
        ...state,
        auth_headers: action.value,
      };

    case UPDATE.CONFIG:
      return {
        ...state,
        request: {
          ...state.request,
          config: {
            ...state.request.config,
            [action.key]: action.value,
          },
        },
      };
    case UPDATE.GRAPHQL_BODY.QUERY:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          body: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.RUNNER_QUERY:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          runner_query: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.QUERIES:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          queries: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.ON_TOGGLE:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          [action.key]: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.GRAPHQL_SCHEMA:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          schema: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.QUERY_RESPONSE:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          response: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.FILES:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          files: action.value,
        },
      };

    case UPDATE.GRAPHQL_BODY.ADD_GRAPHQL_BODY_QUERY:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          queries: {
            ...state.graphql_body.queries,
            [action.value._meta.id]: { ...action.value },
          },
        },
      };

    case UPDATE.GRAPHQL_BODY.UPDATE_GRAPHQL_BODY_QUERY:
      return {
        ...state,
        graphql_body: {
          ...state.graphql_body,
          queries: {
            ...state.graphql_body.queries,
            [action.value._meta.id]: {
              ...state.graphql_body.queries[action.value._meta.id],
              ...action.value,
            },
          },
        },
      };

    case UPDATE.GRAPHQL_BODY.DELETE_GRAPHQL_BODY_QUERY:
      if (Object.keys(state.graphql_body.queries).includes(action.value)) {
        const queriesAfterDeleteQuery = {
          ...state.graphql_body.queries,
        };
        delete queriesAfterDeleteQuery[action.value];

        return {
          ...state,
          graphql_body: {
            ...state.graphql_body,
            queries: { ...queriesAfterDeleteQuery },
          },
        };
      }

      break;

    case UPDATE.GRAPHQL_BODY.CURRENT_QUERY:
      if (!equal(state.graphql_body.current_query, action.value)) {
        return {
          ...state,
          graphql_body: {
            ...state.graphql_body,
            current_query: { ...action.value },
          },
        };
      }

      return { ...state };

    default:
  }
};

export { reducer, ACTIONS };
