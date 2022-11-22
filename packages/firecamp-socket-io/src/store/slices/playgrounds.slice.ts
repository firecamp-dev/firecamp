import equal from 'deep-equal';
import { IExecutor } from '@firecamp/ws-executor/dist/esm';

import { ISocketIOEmitter, TId } from '@firecamp/types';
import { EConnectionState } from '../../types';
import { _object } from '@firecamp/utils';
import { InitPayload } from '../../constants';

interface IEmitter extends ISocketIOEmitter {
  path: string;
}

// TODO: add key for active_emitter from collection

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

  getPlayground: (connectionId: TId) => void;
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
    emitter_id: TId | string
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

  updatePlaygrondListenersValue: (connectionId: TId, listen: boolean) => void;

  addListenresToAllPlaygrounds: (listenerName: string, listen: boolean) => void;
  deleteListenreFromAllPlaygrounds: (listenerName: string) => void;
}

const createPlaygroundsSlice = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
): IPlaygroundSlice => ({
  playgrounds: initialPlaygrounds,

  getPlayground: (connectionId: TId) => {
    return get()?.playgrounds?.[connectionId];
  },
  addPlayground: (connectionId: TId, playground: IPlayground) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: playground,
      },
    }));
  },

  changePlayground: (connectionId: TId, updates: object) => {
    set((s) => ({
      ...s,
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
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.connectionState = connectionState;

      set((s) => ({
        ...s,
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
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.logFilters = { type: updates.type };

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundEmitter: (connectionId: TId, emitter: IEmitter) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.emitter = emitter;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundEmitter: async (connectionId: TId, updates: object) => {
    let existingPlayground = await get()?.playgrounds?.[connectionId];

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
          ...s,
          playgrounds: {
            ...s.playgrounds,
            [connectionId]: updatedPlayground,
          },
        }));
        get()?.changePlaygroundTab(connectionId, {
          meta: {
            is_saved: !!updatedPlayground.emitter?._meta?.id,
            hasChange: true,
          },
        });
      } else {
        get()?.changePlaygroundTab(connectionId, {
          meta: {
            is_saved: !!updatedPlayground.emitter?._meta?.id,
            hasChange: false,
          },
        });
      }
    }
  },
  resetPlaygroundEmitter: (connectionId: TId) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.emitter = InitPayload;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setSelectedCollectionEmitter: (
    connectionId: TId,
    emitter_id: TId | string
  ) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.selectedCollectionEmitter = emitter_id;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  deletePlayground: (connectionId: TId) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      set((s) => ({
        ...s,
        playgrounds: s.playgrounds?.filter((c) => c.id != connectionId),
      }));

      // Listen off/ remove all listeners
      get()?.removeAllListenersFromExecutor(connectionId);
    }
  },

  deleteExecutor: (connectionId: TId) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.executor = {};

      // Listen off/ remove all listeners
      get()?.removeAllListenersFromExecutor(connectionId);

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundListeners: (connectionId: TId, listeners: object) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.listeners = listeners;
      console.log({ updatedPlayground });

      //TODO: add Listen on/ off all listeners

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  listenOnConnect: (connectionId: TId) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];

    if (existingPlayground) {
      for (let listen in existingPlayground.listeners) {
        if (existingPlayground.listeners[listen] === true) {
          get().addListenerToExecutor(connectionId, listen);
        }
      }
    }
  },
  updatePlaygroundListener: (
    connectionId: TId,
    name: string,
    listen: boolean
  ) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.listeners = Object.assign(updatedPlayground.listeners, {
        [name]: listen,
      });
      console.log({ updatedPlayground });

      if (listen) {
        get()?.addListenerToExecutor(connectionId, name);
      } else {
        get()?.removeListenerFromExecutor(connectionId, name);
      }

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  deletePlaygroundListener: (connectionId: TId, name: string) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.listeners = _object.omit(updatedPlayground.listeners, [
        name,
      ]);

      // Remove listener from executor/ listen off
      get()?.removeListenerFromExecutor(connectionId, name);

      // Update slice
      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  updatePlaygrondListenersValue: (connectionId: TId, listen: boolean) => {
    let existingPlayground = get()?.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      for (let key in updatedPlayground.listeners) {
        // TODO: add logic to listen on/ off
        updatedPlayground.listeners[key] = listen;
      }

      if (listen) {
        get()?.addListenersToExecutor(
          connectionId,
          updatedPlayground.listeners
        );
      } else {
        get()?.removeAllListenersFromExecutor(connectionId);
      }

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  addListenresToAllPlaygrounds: (listenerName: string, listen: boolean) => {
    let updatedPlaygrounds = get().playgrounds;

    for (let connectionId in updatedPlaygrounds) {
      try {
        let existingPlayground = updatedPlaygrounds[connectionId];

        // check if already exist or not
        if (!(listenerName in existingPlayground.listeners)) {
          existingPlayground.listeners = {
            ...existingPlayground.listeners,
            [listenerName]: listen,
          };

          // listen on if connected
          if (listen) {
            get()?.addListenerToExecutor(connectionId, listenerName);
          }
        }
      } catch (error) {
        console.info({
          API: 'socket.addListenresToAllPlaygrounds',
          connectionId,
          error,
        });
      }
    }

    // Set to store
    set((s) => ({
      ...s,
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
    }));
  },
  deleteListenreFromAllPlaygrounds: (listenerName: string) => {
    let updatedPlaygrounds = get().playgrounds;

    for (let connectionId in updatedPlaygrounds) {
      try {
        let existingPlayground = updatedPlaygrounds[connectionId];
        existingPlayground.listeners = _object.omit(
          existingPlayground.listeners,
          [listenerName]
        );

        // Set listen off
        get().removeListenerFromExecutor(connectionId, listenerName);
      } catch (error) {
        console.info({
          API: 'socket.deleteListenreFromAllPlaygrounds',
          connectionId,
          error,
        });
      }
    }

    // Set to store
    set((s) => ({
      ...s,
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
    }));
  },
});

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice };
