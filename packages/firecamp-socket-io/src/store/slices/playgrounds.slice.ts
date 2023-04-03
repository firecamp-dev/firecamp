import _deepClone from 'lodash/clone';
import { IExecutorInterface } from '@firecamp/socket.io-executor/dist/esm';
import { _object } from '@firecamp/utils';
import {
  EArgumentBodyType,
  ISocketIOEmitter,
  ISocketIOListener,
  TId,
} from '@firecamp/types';
import { InitPlayground } from '../../constants';
import { EConnectionState } from '../../types';
import { TStoreSlice } from '../store.type';

interface IPlayground {
  id: TId;
  connectionState: EConnectionState;
  logFilters: {
    type: string;
    event: string;
  };
  emitter: ISocketIOEmitter;
  selectedCollectionEmitter: TId;
  executor?: IExecutorInterface;
  activeListeners: TId[];
  socketId?: string;
  activeArgIndex: number;
}

interface IPlaygrounds {
  [key: TId]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;

  getPlayground: (connectionId?: TId) => IPlayground;
  setPlgExecutor: (connectionId: TId, executor: any) => void;
  addPlayground: (connectionId: TId, playground: IPlayground) => void;
  //arguments
  selectPlgArgTab: (index: number) => void;
  addPlgArgTab: () => void;
  removePlgArgTab: (index: number) => void;
  changePlgArgType: (type: EArgumentBodyType) => void;
  changePlgArgValue: (value: string | number | boolean) => void;
  changePlgEmitterName: (name: string) => void;
  changePlgEmitterAck: (value: boolean) => void;

  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => void;
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => void;
  resetPlaygroundEmitter: (connectionId: TId) => void;

  setSelectedCollectionEmitter: (
    connectionId: TId,
    emitterId: TId | string
  ) => void;
  deleteExecutor: (connectionId: TId) => void;

  deleteListener: (listener: ISocketIOListener, connectionId?: TId) => void;
  toggleListener: (
    bool: boolean,
    listener: ISocketIOListener,
    connectionId?: TId
  ) => void;
  toggleAllListeners: (bool: boolean, connectionId?: TId) => void;
}

const createPlaygroundsSlice: TStoreSlice<IPlaygroundSlice> = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
) => ({
  playgrounds: initialPlaygrounds,

  getPlayground: (connectionId?: TId) => {
    const state = get();
    const {
      runtime: { activePlayground },
      playgrounds,
    } = state;
    return playgrounds[connectionId || activePlayground];
  },
  setPlgExecutor: (connectionId: TId, executor: any) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...s.playgrounds[connectionId],
          executor,
        },
      },
    }));
  },
  addPlayground: (connectionId: TId, playground: IPlayground) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: playground,
      },
    }));
  },

  // emitter and arguments
  selectPlgArgTab: (index: number) => {
    console.log(index, 789789);
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: {
            ...plg,
            activeArgIndex: index,
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  addPlgArgTab: () => {
    set((s) => {
      const { activePlayground } = s.runtime;
      const plg = s.playgrounds[activePlayground];
      if (!plg.emitter.value?.length) plg.emitter.value = [];
      plg.emitter.value = [
        ...plg.emitter.value,
        {
          body: '',
          __meta: {
            type: EArgumentBodyType.Text,
          },
        },
      ];
      // console.log(plg.emitter.payload, 'emitter.payload ...555');
      return {
        playgrounds: {
          ...s.playgrounds,
          [activePlayground]: {
            ...plg,
            activeArgIndex: plg.emitter.value.length - 1,
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  removePlgArgTab: (index: number) => {
    if (index == 0) return;
    set((s) => {
      const { activePlayground } = s.runtime;
      const plg = s.playgrounds[activePlayground];
      if (!plg.emitter.value?.length) plg.emitter.value = [];
      plg.emitter.value = [
        ...plg.emitter.value.slice(0, index),
        ...plg.emitter.value.slice(index + 1),
      ];

      return {
        playgrounds: {
          ...s.playgrounds,
          [activePlayground]: {
            ...plg,
            activeArgIndex: index - 1,
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  changePlgArgType: (type: EArgumentBodyType) => {
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      const { activeArgIndex } = plg;
      plg.emitter.value[activeArgIndex].__meta.type = type;
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: plg,
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  changePlgArgValue: (value: string | number | boolean) => {
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      const { activeArgIndex } = plg;
      plg.emitter.value[activeArgIndex].body = value;
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: plg,
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  changePlgEmitterName: (name: string) => {
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: {
            ...plg,
            emitter: {
              ...plg.emitter,
              name,
            },
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  changePlgEmitterAck: (ack: boolean) => {
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      plg.emitter.__meta.ack = ack;
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: plg,
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },

  // connection and logs
  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.connectionState = connectionState;
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.logFilters = { type: updates.type, event: '' };
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  //emitter
  resetPlaygroundEmitter: () => {
    set((s) => {
      const plg = s.playgrounds[s.runtime.activePlayground];
      plg.emitter = _deepClone(InitPlayground) as ISocketIOEmitter;
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: plg,
        },
      };
    });
  },
  setSelectedCollectionEmitter: (
    connectionId: TId,
    emitterId: TId | string
  ) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.selectedCollectionEmitter = emitterId;
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  deleteExecutor: (connectionId: TId) => {
    const state = get();
    const playground = state.getPlayground[connectionId];
    if (playground?.id === connectionId) {
      // listen off/ remove all listeners
      state.removeAllListenersFromExecutor(connectionId);
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: {
            ...playground,
            executor: null,
          },
        },
      }));
    }
  },

  //listeners
  toggleListener: (bool, listener, connectionId) => {
    const state = get();
    connectionId = connectionId || state.getActiveConnectionId();
    const playground = state.playgrounds[connectionId];
    if (playground?.id !== connectionId) return;
    let activeListeners = [];

    if (bool) {
      activeListeners.push(listener.id);
      state.addListenerToExecutor(connectionId, listener.name);
    } else {
      activeListeners = activeListeners.filter((l) => l != listener.id);
      state.removeListenerFromExecutor(connectionId, listener.name);
    }

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...playground,
          activeListeners,
        },
      },
    }));
  },
  deleteListener: (listener: ISocketIOListener, connectionId?: TId) => {
    const state = get();
    connectionId = connectionId || state.getActiveConnectionId();
    const playground = state.playgrounds[connectionId];
    if (playground?.id !== connectionId) return;

    const {
      request: { listeners },
    } = state;
    const _listeners = listeners.filter((l) => l.id != listener.id);
    const activeListeners = playground.activeListeners.filter(
      (l) => l != listener.id
    );

    // remove listener from executor/ listen off
    state.removeListenerFromExecutor(connectionId, listener.name);

    // update slice
    set((s) => ({
      request: {
        ...s.request,
        listeners: _listeners,
      },
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...playground,
          activeListeners,
        },
      },
    }));
  },
  toggleAllListeners: (bool, connectionId) => {
    const state = get();
    connectionId = connectionId || state.getActiveConnectionId();
    const playground = state.playgrounds[connectionId];
    if (playground?.id !== connectionId) return;

    const {
      request: { listeners },
    } = state;
    let activeLIds = [];

    if (bool === true) {
      const lNames = listeners.map((l) => l.name);
      activeLIds = listeners.map((l) => l.id);
      state.addListenersToExecutor(connectionId, lNames);
    } else {
      state.removeAllListenersFromExecutor(connectionId);
    }

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...playground,
          activeListeners: activeLIds,
        },
      },
    }));
  },
});

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice };
