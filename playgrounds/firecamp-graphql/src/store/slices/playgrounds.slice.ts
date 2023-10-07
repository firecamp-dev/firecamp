import { IRestResponse, TId } from '@firecamp/types';
import { EGraphQLOperationType, IGraphQLPlayground } from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';
import isEqual from 'react-fast-compare';
import { nanoid } from 'nanoid';

import {
  getCurrentOperation,
  getOperations,
  getOperationNames,
  getPlaygroundName,
  prettifyQueryString,
} from '../../services/graphql.service';
import { TStoreSlice } from '../store.type';

export interface IPlaygroundRequest
  extends Omit<IGraphQLPlayground, '__ref' | '__meta'> {
  __ref?: any;
  __meta?: any;
}
export interface IPlayground {
  originalRequest?: IPlaygroundRequest;
  request: IPlaygroundRequest;
  response: Partial<IRestResponse>;
}

export interface IPlaygrounds {
  [key: string]: IPlayground;
}

export interface IPlaygroundsSlice {
  playgrounds?: IPlaygrounds;
  addPlayground: (defaultValue?: string) => void;
  openPlayground: (plgId: TId) => void;
  removePlayground: (playgroundId: string) => void;
  changePlgValueFromExplorer: (playgroundId: string, value: string) => void;
  changePlaygroundValue: (playgroundId: string, value: string) => void;
  changePlaygroundVariables: (playgroundId: string, variables: string) => void;
  setPlaygroundOperation: (opName: string, playgroundId?: TId) => void;
  undoPlaygroundChanges: (plgId: string) => void;
  /** generate plg name from the operations written in plg's editor, useful to suggest ready to use name */
  prepareRuntimeActivePlgName: () => string;
  setPlaygroundResponse: (response: any) => void;
}

export const createPlaygroundsSlice: TStoreSlice<IPlaygroundsSlice> = (
  set,
  get
): IPlaygroundsSlice => ({
  /**
   * {
      'playground-1': {
        originalRequest: null,
        request: {
          __ref: { id: 'playground-1' },
          value: { query: 'query MyQuery {\n  __typename\n}', variables: variables: `{ "key": "value" }`,},
          // value: { query: '{\n  __typename\n  company {\n    ceo\n    coo\n    cto\n    cto_propulsion\n    employees\n  }\n}\n', variables: `{ "key": "value" }`,},
          __meta: {
            type: EGraphQLOperationType.Query,
          },
          name: 'Playground 1',
        },
        response: {},
      },
    };
   */
  playgrounds: {}, //dummyPlayground,

  addPlayground: (defaultValue) => {
    const state = get();
    const playgroundId = nanoid();
    const plgsCount = state.runtime?.playgroundTabs?.length;
    const name = `playground-${plgsCount + 1}`;
    const query = defaultValue || 'query MyQuery {\n  __typename\n}';
    const plg: IGraphQLPlayground = {
      name,
      value: { query, variables: `{ }` },
      __meta: {},
      //@ts-ignore
      __ref: { id: playgroundId },
    };

    set((s) => {
      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: { request: plg, response: {} },
        },
        runtime: {
          ...s.runtime,
          playgroundTabs: [
            ...s.runtime.playgroundTabs,
            { id: playgroundId, name },
          ],
          playgroundsMeta: {
            ...s.runtime.playgroundsMeta,
            [playgroundId]: {
              isSaved: false,
              operationNames: getOperationNames(plg.value.query).names,
            },
          },
          activePlayground: playgroundId,
        },
      };
    });
  },

  // open saved playground in tab
  openPlayground: (plgId: TId) => {
    const state = get();
    const plg = state.collection.items?.find(
      (i) => i.__ref.id == plgId
    ) as IGraphQLPlayground;
    if (!plg) return;
    // if variables is table like array from old version then convert then in JSON string
    if (Array.isArray(plg.value?.variables)) {
      const variables = plg.value.variables.reduce((p, n) => {
        p[n.key] = n.value;
        return p;
      }, {});
      plg.value.variables = JSON.stringify(variables, null, 4);
    }

    set((s) => {
      const pId = plg.__ref.id;
      const plgExits = !!s.playgrounds[pId];
      const playgrounds = plgExits
        ? s.playgrounds
        : {
            ...s.playgrounds,
            [pId]: { originalRequest: plg, request: plg, response: {} },
          };
      const plgRuntimeTabs = plgExits
        ? s.runtime.playgroundTabs
        : [...s.runtime.playgroundTabs, { id: pId, name: plg.name }];
      const plgsMeta = plgExits
        ? s.runtime.playgroundsMeta
        : {
            ...s.runtime.playgroundsMeta,
            [pId]: {
              isSaved: true,
              hasChange: false,
              isRequestRunning: false,
              operationNames: getOperationNames(plg.value.query).names,
            },
          };

      return {
        playgrounds,
        runtime: {
          ...s.runtime,
          playgroundTabs: plgRuntimeTabs,
          playgroundsMeta: plgsMeta,
          activePlayground: pId,
        },
      };
    });
  },

  removePlayground: (playgroundId: string) => {
    set((s) => {
      let pIndex = s.runtime.playgroundTabs.findIndex(
        (p) => p.id == playgroundId
      );
      if (pIndex == -1) return s;
      let { activePlayground } = s.runtime;
      let rTimePlaygrounds = _array.removeItem(
        s.runtime.playgroundTabs,
        pIndex
      );
      if (playgroundId == activePlayground) {
        if (rTimePlaygrounds[pIndex]) {
          activePlayground = rTimePlaygrounds[pIndex].id;
        } else if (rTimePlaygrounds[pIndex - 1]) {
          activePlayground = rTimePlaygrounds[pIndex - 1].id;
        } else {
          //if the last playground is being removed then set active playground null
          activePlayground = null;
        }
      }

      // console.log(
      //   activePlayground,
      //   s.playgrounds,
      //   playgroundId,
      //   's.playgrounds, playgroundId'
      // );

      return {
        runtime: {
          ...s.runtime,
          activePlayground: activePlayground,
          playgroundTabs: rTimePlaygrounds,
        },
        playgrounds: {
          ..._object.omit(s.playgrounds, [playgroundId]),
        },
      };
    });
  },

  changePlgValueFromExplorer: (playgroundId: string, queryValue: string) => {
    const state = get();
    // if no playground is active/open then open new plg with default value
    if (!playgroundId || !state.playgrounds[playgroundId]) {
      state.addPlayground(queryValue);
    } else {
      state.changePlaygroundValue(playgroundId, queryValue);
    }
  },

  changePlaygroundValue: (playgroundId: string, queryValue: string) => {
    const state = get();
    // console.log(getOperations(queryValue), "getOperations");
    const { names, error } = getOperationNames(queryValue);
    console.log(names, 'opsNames...');
    // console.log(getPlaygroundName(queryValue), "getPlaygroundName");

    const plg = state.playgrounds[playgroundId];
    let hasChange = false;
    const plgMeta = state.runtime.playgroundsMeta[playgroundId];

    if (plg.originalRequest?.value.query != queryValue && plgMeta.isSaved)
      hasChange = true;

    set((s) => {
      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...s.playgrounds[playgroundId],
            request: {
              ...plg.request,
              value: {
                ...plg.request.value,
                query: queryValue,
              },
            },
          },
        },
        runtime: {
          ...s.runtime,
          playgroundsMeta: {
            ...s.runtime.playgroundsMeta,
            [playgroundId]: {
              ...plgMeta,
              hasChange,
              operationNames: names?.length ? names : plgMeta.operationNames, // opsNames will always be empty array if syntax has error, in such case use previous value
            },
          },
        },
      };
    });
  },

  changePlaygroundVariables: (playgroundId: string, variables: string) => {
    set((s) => {
      const plg = s.playgrounds[playgroundId];
      let hasChange = false;
      if (!isEqual(plg.originalRequest?.value.variables, variables))
        hasChange = true;

      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...plg,
            request: {
              ...plg.request,
              value: {
                ...plg.request.value,
                variables,
              },
            },
          },
        },
        runtime: {
          ...s.runtime,
          playgroundsMeta: {
            ...s.runtime.playgroundsMeta,
            [playgroundId]: {
              ...s.runtime.playgroundsMeta[playgroundId],
              hasChange,
            },
          },
        },
      };
    });
  },

  setPlaygroundOperation: (opName: string, playgroundId?: TId) => {
    set((s) => {
      const plgsMeta = s.runtime.playgroundsMeta;
      const plgId = playgroundId || s.runtime.activePlayground;
      return {
        runtime: {
          ...s.runtime,
          playgroundsMeta: {
            ...plgsMeta,
            [plgId]: {
              ...plgsMeta[plgId],
              activeOperation: opName,
            },
          },
        },
      };
    });
  },

  /** undo changes and reset the previously saved plg's state */
  undoPlaygroundChanges: (playgroundId: string) => {
    if (!playgroundId) return;
    set((s) => {
      const plg = s.playgrounds[playgroundId];
      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...s.playgrounds[playgroundId],
            request: plg.originalRequest,
          },
        },
        runtime: {
          ...s.runtime,
          playgroundsMeta: {
            ...s.runtime.playgroundsMeta,
            [playgroundId]: {
              ...s.runtime.playgroundsMeta[playgroundId],
              hasChange: false,
            },
          },
        },
      };
    });
  },

  prepareRuntimeActivePlgName: () => {
    const state = get();
    const editorValue =
      state.playgrounds[state.runtime.activePlayground]?.request?.value?.query;
    let name = getPlaygroundName(editorValue);
    return name;
  },

  setPlaygroundResponse: (response: any) => {
    set((s) => {
      const playgroundId = s.runtime.activePlayground;
      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...s.playgrounds[playgroundId],
            response,
          },
        },
      };
    });
  },
});
