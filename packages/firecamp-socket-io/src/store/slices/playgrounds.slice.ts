import { nanoid } from 'nanoid';
import equal from 'react-fast-compare';
import _deepClone from 'lodash/clone';
import { IExecutorInterface } from '@firecamp/socket.io-executor/dist/esm';
import { _object } from '@firecamp/utils';
import {
  TId,
  EArgumentBodyType,
  ISocketIOEmitter,
  ISocketIOListener,
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
  playgroundHasChanges: boolean;
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
  checkPlaygroundEquality: () => void;
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
    return { ...playgrounds[activePlayground] };
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
      context,
      runtime: { activePlayground: connectionId },
      collection: { items },
      getPlayground,
      changePlaygroundTab,
    } = get();

    //@ts-ignore TODO: fix type here later
    const item: ISocketIOEmitter = items.find((i) => i.__ref.id == emitterId);
    const playground = getPlayground();
    if (!playground) return;

    const openEmitterInPlg = () => {
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: {
            ...playground,
            emitter: item,
            playgroundHasChanges: false,
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
    };
    if (!playground.playgroundHasChanges) {
      openEmitterInPlg();
      return;
    }

    context.window
      .confirm({
        title:
          'The current emitter has unsaved changes. Do you want to continue without saving them?',
        texts: {
          btnConfirm: 'Yes, open it.',
        },
      })
      .then((s) => {
        openEmitterInPlg();
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
    const state = get();
    const { activePlayground } = state.runtime;
    const plg = state.getPlayground();
    if (!plg.emitter.value?.length) plg.emitter.value = [];
    const value = [
      ...plg.emitter.value,
      {
        body: '',
        __meta: {
          type: EArgumentBodyType.Text,
        },
      },
    ];
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [activePlayground]: {
          ...plg,
          emitter: { ...plg.emitter, value },
          activeArgIndex: plg.emitter.value.length - 1,
        },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  removePlgArgTab: (index: number) => {
    if (index == 0) return;
    const state = get();
    const { activePlayground } = state.runtime;
    const plg = state.getPlayground();
    if (!plg.emitter.value?.length) plg.emitter.value = [];
    const value = [
      ...plg.emitter.value.slice(0, index),
      ...plg.emitter.value.slice(index + 1),
    ];
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [activePlayground]: {
          ...plg,
          emitter: { ...plg.emitter, value },
          activeArgIndex: index - 1,
        },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  changePlgArgType: (type: EArgumentBodyType) => {
    const state = get();
    const plg = state.getPlayground();
    const { activeArgIndex } = plg;
    const value = plg.emitter.value.map((v, i) => {
      if (i == activeArgIndex) {
        return { ...v, __meta: { ...v.__meta, type } };
      }
      return v;
    });
    set((s) => {
      return {
        playgrounds: {
          ...s.playgrounds,
          [s.runtime.activePlayground]: {
            ...plg,
            emitter: { ...plg.emitter, value },
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  changePlgArgValue: (body: string | number | boolean) => {
    const state = get();
    const plg = state.getPlayground();
    const { activeArgIndex } = plg;
    const value = plg.emitter.value.map((v, i) => {
      if (i == activeArgIndex) {
        return { ...v, body };
      }
      return v;
    });
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [s.runtime.activePlayground]: {
          ...plg,
          emitter: { ...plg.emitter, value },
        },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  changePlgEmitterName: (name: string) => {
    const state = get();
    const plg = state.getPlayground();
    set((s) => {
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
    state.checkPlaygroundEquality();
  },
  changePlgEmitterAck: (ack: boolean) => {
    const state = get();
    const plg = state.getPlayground();
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [s.runtime.activePlayground]: {
          ...plg,
          emitter: { ...plg.emitter, __meta: { ...plg.emitter.__meta, ack } },
        },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
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
  checkPlaygroundEquality: () => {
    const {
      getPlayground,
      collection: { items },
    } = get();
    const plg = getPlayground();
    const originalEmitter =
      items.find((i) => i.__ref.id == plg.emitter.__ref.id) ||
      (_deepClone(InitPlayground) as ISocketIOEmitter);

    // console.log(originalEmitter, plg.emitter, 'comparing...');
    const hasChanges = !equal(originalEmitter, plg.emitter);
    set((s) => ({
      playgrounds: {
        [s.runtime.activePlayground]: {
          ...s.playgrounds[s.runtime.activePlayground],
          playgroundHasChanges: hasChanges,
        },
      },
    }));
  },

  //emitter
  resetPlaygroundEmitter: () => {
    const resetPlg = () => {
      set((s) => {
        const { activePlayground } = s.runtime;
        return {
          playgrounds: {
            ...s.playgrounds,
            [activePlayground]: {
              ...s.playgrounds[activePlayground],
              emitter: _deepClone(InitPlayground) as ISocketIOEmitter,
              playgroundHasChanges: false,
              selectedEmitterId: '',
            },
          },
        };
      });
    };

    const state = get();
    const plg = state.getPlayground();
    if (!plg.playgroundHasChanges) resetPlg();
    else {
      state.context.window
        .confirm({
          title:
            'The current emitter has unsaved changes. Do you want to continue without saving them?',
          texts: {
            btnConfirm: 'Yes, reset it.',
          },
        })
        .then((s) => {
          resetPlg();
        });
    }
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
