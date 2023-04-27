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
  id?: TId;
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
interface IPlaygroundSlice {
  playground: IPlayground;
  setPlgExecutor: (executor: any) => void;
  openEmitterInPlayground: (emitterId: TId, forceFully?: boolean) => void;

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
  initialPlayground: IPlayground
) => ({
  playground: initialPlayground,

  setPlgExecutor: (executor: any) => {
    set((s) => ({
      playground: {
        ...s.playground,
        executor,
      },
    }));
  },

  openEmitterInPlayground: (emitterId: TId, forceFully = false) => {
    const {
      context,
      playground,
      collection: { items },
    } = get();

    //@ts-ignore TODO: fix type here later
    const item: ISocketIOEmitter = items.find((i) => i.__ref.id == emitterId);

    const openEmitterInPlg = () => {
      set((s) => ({
        playground: {
          ...s.playground,
          emitter: item,
          playgroundHasChanges: false,
          selectedEmitterId: emitterId,
        },
      }));
    };
    if (!playground.playgroundHasChanges || forceFully === true) {
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
      return {
        playground: {
          ...s.playground,
          activeArgIndex: index,
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
  },
  addPlgArgTab: () => {
    const state = get();
    const { emitter } = state.playground;
    if (!emitter.value?.length) emitter.value = [];
    const value = [
      ...emitter.value,
      {
        body: '',
        __meta: {
          type: EArgumentBodyType.Text,
        },
      },
    ];
    set((s) => ({
      playground: {
        ...s.playground,
        emitter: { ...s.playground.emitter, value },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  removePlgArgTab: (index: number) => {
    if (index == 0) return;
    const state = get();
    const { emitter } = state.playground;
    if (!emitter.value?.length) emitter.value = [];
    const value = [
      ...emitter.value.slice(0, index),
      ...emitter.value.slice(index + 1),
    ];
    set((s) => ({
      playground: {
        ...s.playground,
        emitter: { ...s.playground.emitter, value },
        activeArgIndex: index - 1,
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  changePlgArgType: (type: EArgumentBodyType) => {
    const state = get();
    const { activeArgIndex, emitter } = state.playground;
    const value = emitter.value.map((v, i) => {
      if (i == activeArgIndex) {
        return { ...v, __meta: { ...v.__meta, type } };
      }
      return v;
    });
    set((s) => ({
      playground: {
        ...s.playground,
        emitter: { ...emitter, value },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
  },
  changePlgArgValue: (body: string | number | boolean) => {
    const state = get();
    const { activeArgIndex, emitter } = state.playground;
    const value = emitter.value.map((v, i) => {
      if (i == activeArgIndex) {
        return { ...v, body };
      }
      return v;
    });
    set((s) => ({
      playground: {
        ...s.playground,
        emitter: { ...s.playground.emitter, value },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },
  changePlgEmitterName: (name: string) => {
    const state = get();
    set((s) => {
      return {
        playground: {
          ...s.playground,
          emitter: {
            ...s.playground.emitter,
            name,
          },
        },
        __manualUpdates: ++s.__manualUpdates,
      };
    });
    state.checkPlaygroundEquality();
  },
  changePlgEmitterAck: (ack: boolean) => {
    const state = get();
    set((s) => ({
      playground: {
        ...s.playground,
        emitter: {
          ...s.playground.emitter,
          __meta: { ...s.playground.emitter.__meta, ack },
        },
      },
      __manualUpdates: ++s.__manualUpdates,
    }));
    state.checkPlaygroundEquality();
  },

  // connection and logs
  changePlaygroundConnectionState: (connectionState: EConnectionState) => {
    set((s) => ({
      playground: {
        ...s.playground,
        connectionState,
      },
    }));
  },
  changePlaygroundLogFilters: (updates: { type: string }) => {
    set((s) => ({
      playground: {
        ...s.playground,
        logFilters: { type: updates.type, event: '' },
      },
    }));
  },
  checkPlaygroundEquality: () => {
    const {
      playground: { emitter },
      collection: { items },
    } = get();
    const originalEmitter =
      items.find((i) => i.__ref.id == emitter.__ref.id) ||
      (_deepClone(InitPlayground) as ISocketIOEmitter);

    // console.log(originalEmitter, emitter, 'comparing...');
    const hasChanges = !equal(originalEmitter, emitter);
    set((s) => ({
      playground: {
        ...s.playground,
        playgroundHasChanges: hasChanges,
      },
    }));
  },

  //emitter
  resetPlaygroundEmitter: () => {
    const resetPlg = () => {
      set((s) => {
        return {
          playground: {
            ...s.playground,
            emitter: _deepClone(InitPlayground) as ISocketIOEmitter,
            playgroundHasChanges: false,
            selectedEmitterId: '',
          },
        };
      });
    };

    const { playground, context } = get();
    if (!playground.playgroundHasChanges) resetPlg();
    else {
      context.window
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
    // listen off/ remove all listeners
    state.removeAllListenersFromExecutor();
    set((s) => ({
      playground: {
        ...s.playground,
        executor: null,
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
    const { activeListeners: aListeners } = state.playground;

    const {
      request: { listeners: rListeners },
    } = state;
    const listeners = rListeners.filter((l) => l.id != listener.id);
    const activeListeners = aListeners.filter((l) => l != listener.id);
    // remove listener from executor/ listen off
    state.removeListenersFromExecutor(listener.name);

    // update slice
    set((s) => ({
      request: {
        ...s.request,
        listeners,
      },
      playground: {
        ...s.playground,
        activeListeners,
      },
    }));
    state.equalityChecker({ listeners });
  },
  toggleListener: (bool, listener) => {
    const state = get();
    let {
      playground: { activeListeners },
      playground,
    } = state;
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
      playground: {
        ...s.playground,
        activeListeners,
      },
    }));
  },
  toggleAllListeners: (bool) => {
    const state = get();
    const { playground } = state;
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
      playground: {
        ...s.playground,
        activeListeners: activeLIds,
      },
    }));
  },
});

export { IPlayground, IPlaygroundSlice, createPlaygroundsSlice };
