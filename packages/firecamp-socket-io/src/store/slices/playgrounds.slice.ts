import _deepClone from 'lodash/clone';
import { IExecutorInterface } from '@firecamp/socket.io-executor/dist/esm';
import { _object } from '@firecamp/utils';
import { EArgumentBodyType, ISocketIOEmitter, TId } from '@firecamp/types';
import { InitPlayground } from '../../constants';
import { EConnectionState } from '../../types';
import { TStoreSlice } from '../store.type';

interface IEmitter extends ISocketIOEmitter {
  path: string;
}

interface IPlayground {
  id: TId;
  connectionState: EConnectionState;
  logFilters: {
    type: string;
    event: string;
  };
  emitter: IEmitter;
  selectedCollectionEmitter: TId;
  executor?: IExecutorInterface;
  listeners?: { [key: string]: boolean };
  socketId?: string;
  activeArgIndex: number;
}

interface IPlaygrounds {
  [key: TId]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;

  getActivePlayground: () => IPlayground;
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

  deletePlayground: (connectionId: TId) => void;
  deleteExecutor: (connectionId: TId) => void;

  setPlaygroundListeners: (connectionId: TId, listeners: object) => void;
  listenOnConnect: (connectionId: TId) => void;

  updatePlaygroundListener: (
    connectionId: TId,
    name: string,
    listen: boolean
  ) => void;

  deletePlaygroundListener: (connectionId: TId, name: string) => void;
  updatePlaygroundListenersValue: (connectionId: TId, listen: boolean) => void;
  addListenersToAllPlaygrounds: (listenerName: string, listen: boolean) => void;
  deleteListenerFromAllPlaygrounds: (listenerName: string) => void;
}

const createPlaygroundsSlice: TStoreSlice<IPlaygroundSlice> = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
) => ({
  playgrounds: initialPlaygrounds,

  getActivePlayground: () => {
    const state = get();
    return state.playgrounds[state.runtime.activePlayground];
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
  //delete
  deletePlayground: (connectionId: TId) => {
    const state = get();
    let existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      set((s) => ({
        playgrounds: s.playgrounds?.filter((c) => c.id != connectionId),
      }));

      // listen off/ remove all listeners
      state.removeAllListenersFromExecutor(connectionId);
    }
  },
  deleteExecutor: (connectionId: TId) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.executor = {};

      // Listen off/ remove all listeners
      state.removeAllListenersFromExecutor(connectionId);
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  //listeners
  setPlaygroundListeners: (connectionId: TId, listeners: { [k: string]: boolean }) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      const updatedPlayground = existingPlayground;
      updatedPlayground.listeners = listeners;
      console.log({ updatedPlayground });

      //TODO: add Listen on/ off all listeners
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  listenOnConnect: (connectionId: TId) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];

    if (existingPlayground) {
      for (let listen in existingPlayground.listeners) {
        if (existingPlayground.listeners[listen] === true) {
          state.addListenerToExecutor(connectionId, listen);
        }
      }
    }
  },
  updatePlaygroundListener: (
    connectionId: TId,
    name: string,
    listen: boolean
  ) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      const updatedPlayground = existingPlayground;
      updatedPlayground.listeners = Object.assign(updatedPlayground.listeners, {
        [name]: listen,
      });
      console.log({ updatedPlayground });

      if (listen) {
        state.addListenerToExecutor(connectionId, name);
      } else {
        state.removeListenerFromExecutor(connectionId, name);
      }

      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  deletePlaygroundListener: (connectionId: TId, name: string) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      const updatedPlayground = existingPlayground;
      updatedPlayground.listeners = _object.omit(updatedPlayground.listeners, [
        name,
      ]) as { [k: string]: boolean };

      // remove listener from executor/ listen off
      state.removeListenerFromExecutor(connectionId, name);

      // Update slice
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  updatePlaygroundListenersValue: (connectionId: TId, listen: boolean) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      const updatedPlayground = existingPlayground;
      for (let key in updatedPlayground.listeners) {
        // TODO: add logic to listen on/ off
        updatedPlayground.listeners[key] = listen;
      }

      if (listen) {
        state.addListenersToExecutor(connectionId, updatedPlayground.listeners);
      } else {
        state.removeAllListenersFromExecutor(connectionId);
      }

      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  addListenersToAllPlaygrounds: (listenerName: string, listen: boolean) => {
    const state = get();
    let updatedPlaygrounds = state.playgrounds;

    for (let connectionId in updatedPlaygrounds) {
      try {
        const existingPlayground = updatedPlaygrounds[connectionId];

        // check if already exist or not
        if (!(listenerName in existingPlayground.listeners)) {
          existingPlayground.listeners = {
            ...existingPlayground.listeners,
            [listenerName]: listen,
          };

          // listen on if connected
          if (listen) {
            state.addListenerToExecutor(connectionId, listenerName);
          }
        }
      } catch (error) {
        console.info({
          API: 'socket.addListenersToAllPlaygrounds',
          connectionId,
          error,
        });
      }
    }

    // Set to store
    set((s) => ({
      playgrounds: updatedPlaygrounds,
    }));
  },
  deleteListenerFromAllPlaygrounds: (listenerName: string) => {
    const state = get();
    let updatedPlaygrounds = state.playgrounds;

    for (let connectionId in updatedPlaygrounds) {
      try {
        const existingPlayground = updatedPlaygrounds[connectionId];
        existingPlayground.listeners = _object.omit(
          existingPlayground.listeners,
          [listenerName]
        ) as { [k: string]: boolean };

        // Set listen off
        state.removeListenerFromExecutor(connectionId, listenerName);
      } catch (error) {
        console.info({
          API: 'socket.deleteListenerFromAllPlaygrounds',
          connectionId,
          error,
        });
      }
    }

    // Set to store
    set((s) => ({
      playgrounds: updatedPlaygrounds,
    }));
  },
});

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice };
