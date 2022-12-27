import { TId, ERequestTypes } from '@firecamp/types';
import { ILog } from '@firecamp/socket.io-executor/dist/esm';
import { InitPlayground } from '../../constants';
import { ELogColors, ELogTypes } from '../../types';
import { TStoreSlice } from '../store.type';

const emptyLog = {
  title: '',
  message: {
    name: '',
    payload: InitPlayground,
    __ref: {
      id: '',
      collectionId: '',
      requestId: '',
      requestType: ERequestTypes.SocketIO,
    },
  },
  __meta: {
    event: '',
    timestamp: 0,
    type: ELogTypes.System,
    color: ELogColors.Success,
    ackRef: '',
  },
};

interface ILogs {
  [key: TId]: ILog[];
}

interface ILogsSlice {
  logs: ILogs;
  addLog: (connectionId: TId, log: ILog) => void;
  addErrorLog: (connectionId: TId, message: string) => void;
  clearLogs: (connectionId: TId) => void;
}

const createLogsSlice: TStoreSlice<ILogsSlice> = (set, get) => ({
  logs: {},

  addLog: (connectionId: TId, log: ILog) => {
    // console.log({ log });
    const state = get();
    const logs = state.logs;
    if (connectionId in logs) {
      const cLogs = logs[connectionId];
      set((s) => ({
        logs: {
          ...s.logs,
          [connectionId]: [...cLogs, { ...emptyLog, ...log }],
        },
      }));
    } else {
      set((s) => ({
        logs: {
          ...s.logs,
          [connectionId]: [log],
        },
      }));
    }
  },
  addErrorLog: (connectionId: TId, message: string) => {
    const state = get();
    const log = {
      ...emptyLog,
      title: message || '',
      __meta: {
        ...emptyLog.__meta,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      },
    };
    state.addLog(connectionId, log);
  },
  clearLogs: (connectionId: TId) => {
    const state = get();
    const logs = state.logs;
    if (connectionId in logs) {
      set((s) => ({
        logs: {
          ...s.logs,
          [connectionId]: [],
        },
      }));
    }
  },
});

export { emptyLog, ILogs, ILogsSlice, createLogsSlice };
