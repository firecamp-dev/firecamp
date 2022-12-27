import { IRestResponse, TId } from '@firecamp/types';
import { EGraphQLOperationType, IGraphQLPlayground } from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';
import { nanoid } from 'nanoid';

import {
  getCurrentOperation,
  getOperations,
  getOperationNames,
  getPlaygroundName,
  prettifyQueryString,
} from '../../services/GraphQLservice';
import { TStoreSlice } from '../store.type';

export interface IPlaygroundRequest
  extends Omit<IGraphQLPlayground, '__ref' | '__meta'> {
  __ref?: any;
  __meta?: any;
}
export interface IPlayground {
  lastRequest?: IPlaygroundRequest;
  request: IPlaygroundRequest;
  response: Partial<IRestResponse>;
}

export interface IPlaygrounds {
  [key: string]: IPlayground;
}

export interface IPlaygroundsSlice {
  playgrounds?: IPlaygrounds;

  addPlayground: () => void;
  openPlayground: (plg: any) => void;
  removePlayground: (playgroundId: string) => void;
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
        lastRequest: null,
        request: {
          __ref: { id: 'playground-1' },
          body: 'query MyQuery {\n  __typename\n}',
          // body: '{\n  __typename\n  company {\n    ceo\n    coo\n    cto\n    cto_propulsion\n    employees\n  }\n}\n',
          __meta: {
            type: EGraphQLOperationType.Query,
            variables: `{ "key": "value" }`,
          },
          name: 'Playground 1',
        },
        response: {},
      },
    };
   */
  playgrounds: {}, //dummyPlayground,

  addPlayground: () => {
    set((s) => {
      const playgroundId = nanoid();
      const plgsCount = s.runtime?.playgroundTabs?.length;
      const name = `playground-${plgsCount + 1}`;

      const plg = {
        name,
        body: 'query MyQuery {\n  __typename\n}',
        __meta: { type: EGraphQLOperationType.Query, variables: `{ }` },
        __ref: { id: playgroundId },
      };

      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: { request: plg },
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
              operationNames: getOperationNames(plg.body).names,
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
    const plg: IGraphQLPlayground = state.collection.items?.find(
      (i) => i.__ref.id == plgId
    );
    if (!plg) return;
    // If variables is table like array from old version then convert then in JSON string
    if (Array.isArray(plg.__meta?.variables)) {
      const variables = plg.__meta?.variables.reduce((p, n) => {
        p[n.key] = n.value;
        return p;
      }, {});
      plg.__meta.variables = JSON.stringify(variables, null, 4);
    }

    set((s) => {
      const pId = plg.__ref.id;
      const plgExits = !!s.playgrounds[pId];
      const playgrounds = plgExits
        ? s.playgrounds
        : { ...s.playgrounds, [pId]: { lastRequest: plg, request: plg } };
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
              operationNames: getOperationNames(plg.body).names,
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

      console.log(
        activePlayground,
        s.playgrounds,
        playgroundId,
        's.playgrounds, playgroundId'
      );

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

  changePlaygroundValue: (playgroundId: string, value: string) => {
    // console.log(getOperations(value), "getOperations");
    let { names, error } = getOperationNames(value);
    console.log(names, 'opsNames...');
    // console.log(getPlaygroundName(value), "getPlaygroundName");

    set((s) => {
      const plg = s.playgrounds[playgroundId];
      let hasChange = false;
      const plgMeta = s.runtime.playgroundsMeta[playgroundId];

      if (plg.lastRequest?.body != value && plgMeta.isSaved) hasChange = true;

      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...s.playgrounds[playgroundId],
            request: {
              ...plg.request,
              body: value,
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
      if (plg.lastRequest?.__meta.variables != variables) hasChange = true;

      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...plg,
            request: {
              ...plg.request,
              __meta: {
                ...plg.request.__meta,
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

  /** undo changes and reset the the previously saved plg's state */
  undoPlaygroundChanges: (playgroundId: string) => {
    if (!playgroundId) return;
    set((s) => {
      const plg = s.playgrounds[playgroundId];
      return {
        playgrounds: {
          ...s.playgrounds,
          [playgroundId]: {
            ...s.playgrounds[playgroundId],
            request: plg.lastRequest,
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
      state.playgrounds[state.runtime.activePlayground]?.request?.body;
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
