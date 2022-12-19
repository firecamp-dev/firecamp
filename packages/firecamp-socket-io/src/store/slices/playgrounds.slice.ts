import equal from 'deep-equal';
import { IExecutor } from '@firecamp/socket-io-executor/dist/esm';
import { _object } from '@firecamp/utils';
import { ISocketIOEmitter, TId } from '@firecamp/types';
import { EConnectionState } from '../../types';
import { InitPlayground } from '../../constants';

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
  executor?: IExecutor;
  listeners?: { [key: string]: boolean };
  socketId?: string;
}

interface IPlaygrounds {
  [key: TId]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;

  getActivePlayground: () => {
    activePlayground: TId;
    playground: IPlayground;
    plgTab: any; //IPlaygroundTab
  };
  addPlayground: (connectionId: TId, playground: IPlayground) => void;
  changePlayground: (connectionId: TId, updates: object) => void;

  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => void;
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => void;

  setPlaygroundEmitter: (connectionId: TId, emitter: IEmitter) => void;
  changePlaygroundEmitter: (connectionId: TId, updates: object) => void;
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

const createPlaygroundsSlice = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
): IPlaygroundSlice => ({
  playgrounds: initialPlaygrounds,

  getActivePlayground: () => {
    const state = get();
    const {
      playgrounds,
      runtime: { playgroundTabs, activePlayground },
    } = state;
    return {
      activePlayground,
      playground: playgrounds[activePlayground],
      plgTab: playgroundTabs.find((p) => p.id == activePlayground),
    };
  },
  addPlayground: (connectionId: TId, playground: IPlayground) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: playground,
      },
    }));
  },

  changePlayground: (connectionId: TId, updates: object) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...(s.playgrounds[connectionId] || {}),
          ...updates,
        },
      },
    }));
  },

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
      updatedPlayground.logFilters = { type: updates.type };
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundEmitter: (connectionId: TId, emitter: IEmitter) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.emitter = emitter;
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundEmitter: async (connectionId: TId, updates: object) => {
    const state = get();
    const existingPlayground = await state.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = Object.assign({}, existingPlayground);
      updatedPlayground.emitter = { ...updatedPlayground.emitter, ...updates };

      if (
        !equal(
          _object.omit(existingPlayground.emitter, ['path']),
          _object.omit(updatedPlayground.emitter, ['path'])
        )
      ) {
        set((s) => ({
          playgrounds: {
            ...s.playgrounds,
            [connectionId]: updatedPlayground,
          },
        }));
        state.changePlaygroundTab(connectionId, {
          __meta: {
            isSaved: !!updatedPlayground.emitter?.__ref.id,
            hasChange: true,
          },
        });
      } else {
        state.changePlaygroundTab(connectionId, {
          __meta: {
            isSaved: !!updatedPlayground.emitter?.__ref.id,
            hasChange: false,
          },
        });
      }
    }
  },
  resetPlaygroundEmitter: (connectionId: TId) => {
    const state = get();
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.emitter = InitPlayground;
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
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

  setPlaygroundListeners: (connectionId: TId, listeners: object) => {
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
      ]);

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
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
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
        );

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
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
    }));
  },
});

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice };
