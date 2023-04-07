import { nanoid } from 'nanoid';
import _deepClone from 'lodash/clone';
import { IExecutorInterface } from '@firecamp/socket.io-executor/dist/esm';
import { _object } from '@firecamp/utils';
import {
  EArgumentBodyType,
  ISocketIOEmitter,
  ISocketIOListener,
  TId,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { InitPlayground } from '../../constants';
import { EConnectionState } from '../../types';

interface IPlayground {
  id: TId;
  connectionState: EConnectionState;
  logFilters: {
    type: string;
    event: string;
  };
  emitter: ISocketIOEmitter;
  selectedEmitterId: TId;
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

  getPlayground: () => IPlayground;
  setPlgExecutor: (executor: any) => void;
  openEmitterInPlayground: (emitterId: TId) => void;

  //arguments
  selectPlgArgTab: (index: number) => void;
  addPlgArgTab: () => void;
  removePlgArgTab: (index: number) => void;
  changePlgArgType: (type: EArgumentBodyType) => void;
  changePlgArgValue: (value: string | number | boolean) => void;
  changePlgEmitterName: (name: string) => void;
  changePlgEmitterAck: (value: boolean) => void;

  changePlaygroundConnectionState: (connectionState: EConnectionState) => void;
  changePlaygroundLogFilters: (updates: { type: string }) => void;
  resetPlaygroundEmitter: () => void;

  deleteExecutor: () => void;

  addListener: (listener: ISocketIOListener) => void;
  deleteListener: (listener: ISocketIOListener) => void;
  toggleListener: (bool: boolean, listener: ISocketIOListener) => void;
  toggleAllListeners: (bool: boolean) => void;
}

const createPlaygroundsSlice: TStoreSlice<IPlaygroundSlice> = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
) => ({
  playgrounds: initialPlaygrounds,

  getPlayground: () => {
    const state = get();
    const {
      runtime: { activePlayground },
      playgrounds,
    } = state;
    return playgrounds[activePlayground];
  },
  setPlgExecutor: (executor: any) => {
    const conId = get().getActiveConnectionId();
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...s.playgrounds[conId],
          executor,
        },
      },
    }));
  },

  openEmitterInPlayground: (emitterId: TId) => {
    const {
      runtime: { activePlayground: connectionId },
      collection: { items },
      getPlayground,
      changePlaygroundTab,
    } = get();

    //@ts-ignore TODO: fix type here later
    const item: ISocketIOEmitter = items.find((i) => i.__ref.id == msgId);
    const playground = getPlayground();
    if (!playground) return;
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...playground,
          emitter: item,
          selectedEmitterId: emitterId,
        },
      },
    }));
    changePlaygroundTab(connectionId, {
      __meta: {
        isSaved: true,
        hasChange: false,
      },
    });
  },

  // emitter and arguments
  selectPlgArgTab: (index: number) => {
    set((s) => {
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
      const plg = s.getPlayground();
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
  changePlaygroundConnectionState: (connectionState: EConnectionState) => {
    const state = get();
    const playground = state.getPlayground();
    const conId = state.getActiveConnectionId();
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          connectionState,
        },
      },
    }));
  },
  changePlaygroundLogFilters: (updates: { type: string }) => {
    const state = get();
    const playground = state.getPlayground();
    const conId = state.getActiveConnectionId();

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          logFilters: { type: updates.type, event: '' },
        },
      },
    }));
  },

  //emitter
  resetPlaygroundEmitter: () => {
    set((s) => {
      const plg = s.getPlayground();
      plg.emitter = _deepClone(InitPlayground) as ISocketIOEmitter;
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: plg,
        },
      };
    });
  },

  deleteExecutor: () => {
    const state = get();
    const playground = state.getPlayground();
    const conId = state.getActiveConnectionId();
    // listen off/ remove all listeners
    state.removeAllListenersFromExecutor();
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          executor: null,
        },
      },
    }));
  },

  //listeners
  addListener: (listener) => {
    const state = get();
    const {
      request: { listeners: rListeners },
      context,
    } = state;
    const l = { id: nanoid(), name: listener.name, description: '' };
    const listenerExists = rListeners.find((l) => l.name == listener.name);
    if (listenerExists) {
      context.app.notify.warning(
        'The listener with same name is already exists'
      );
      return;
    }
    const listeners = [...rListeners, l];
    set((s) => ({
      request: {
        ...s.request,
        listeners,
      },
    }));
    state.equalityChecker({ listeners });
  },
  deleteListener: (listener) => {
    const state = get();
    const conId = state.getActiveConnectionId();
    const playground = state.getPlayground();

    const {
      request: { listeners: rListeners },
    } = state;
    const listeners = rListeners.filter((l) => l.id != listener.id);
    const activeListeners = playground.activeListeners.filter(
      (l) => l != listener.id
    );

    // remove listener from executor/ listen off
    state.removeListenersFromExecutor(listener.name);

    // update slice
    set((s) => ({
      request: {
        ...s.request,
        listeners,
      },
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          activeListeners,
        },
      },
    }));
    state.equalityChecker({ listeners });
  },
  toggleListener: (bool, listener) => {
    const state = get();
    const conId = state.getActiveConnectionId();
    const playground = state.getPlayground();
    let { activeListeners } = playground;
    if (playground.connectionState !== EConnectionState.Open) {
      state.context.app.notify.alert('The connection is not open.');
      return;
    }

    if (bool) {
      activeListeners = [...activeListeners, listener.id];
      state.addListenersToExecutor(listener.name);
    } else {
      activeListeners = activeListeners.filter((l) => l != listener.id);
      state.removeListenersFromExecutor(listener.name);
    }

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          activeListeners,
        },
      },
    }));
  },
  toggleAllListeners: (bool) => {
    const state = get();
    const conId = state.getActiveConnectionId();
    const playground = state.getPlayground();

    if (playground.connectionState !== EConnectionState.Open) {
      state.context.app.notify.alert('The connection is not open.');
      return;
    }
    const {
      request: { listeners },
    } = state;
    let activeLIds = [];

    if (bool === true) {
      const lNames = listeners.map((l) => l.name);
      activeLIds = listeners.map((l) => l.id);
      state.addListenersToExecutor(lNames);
    } else {
      state.removeAllListenersFromExecutor();
    }

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [conId]: {
          ...playground,
          activeListeners: activeLIds,
        },
      },
    }));
  },
});

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice };
