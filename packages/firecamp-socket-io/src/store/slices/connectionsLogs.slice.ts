import { TId, ERequestTypes } from '@firecamp/types';
import { ILog } from '@firecamp/socket.io-executor/dist/esm';
import { InitPlayground } from '../../constants';
import { ELogColors, ELogTypes } from '../../types';

const emptyLog = {
  title: '',
  message: {
    name: '',
    body: InitPlayground,
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

interface IConnectionsLogs {
  [key: TId]: Array<ILog>;
}

interface IConnectionsLogsSlice {
  connectionsLogs: IConnectionsLogs;
  addConnectionLog: (connectionId: TId, log: ILog) => void;
  addErrorLog: (connectionId: TId, message: string) => void;

  clearAllConnectionLogs: (connectionId: TId) => void;
}

const createConnectionsLogsSlice = (set, get): IConnectionsLogsSlice => ({
  connectionsLogs: {},

  addConnectionLog: (connectionId: TId, log: ILog) => {
    // console.log({ log });
    const state = get();
    const connectionsLogs = state.connectionsLogs;
    if (connectionId in connectionsLogs) {
      const logs = connectionsLogs[connectionId];
      log = { ...emptyLog, ...log };

      set((s) => ({
        connectionsLogs: {
          ...s.connectionsLogs,
          [connectionId]: [...logs, log],
        },
      }));
    } else {
      set((s) => ({
        connectionsLogs: {
          ...s.connectionsLogs,
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
    state.addConnectionLog(connectionId, log);
  },
  clearAllConnectionLogs: (connectionId: TId) => {
    const state = get();
    const connectionsLogs = state.connectionsLogs;
    if (connectionId in connectionsLogs) {
      set((s) => ({
        connectionsLogs: {
          ...s.connectionsLogs,
          [connectionId]: [],
        },
      }));
    }
  },
});

export {
  emptyLog,
  IConnectionsLogs,
  IConnectionsLogsSlice,
  createConnectionsLogsSlice,
};
