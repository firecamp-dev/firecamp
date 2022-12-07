import { TId, EMessageBodyType } from '@firecamp/types';
import { ILog } from '@firecamp/ws-executor/dist/esm';

const emptyLog = {
  title: '',
  message: {
    body: '',
    __meta: {
      type: EMessageBodyType.Text,
      typedArrayView: '',
    },
  },
  __meta: {
    event: '',
    timestamp: new Date().getTime(),
    type: '',
    color: '',
    ackRef: '',
  },
  __ref: {
    id: '',
  },
};

interface IConnectionsLogs {
  [key: TId]: Array<ILog>;
}

interface IConnectionsLogsSlice {
  connectionsLogs: IConnectionsLogs;
  addConnectionLog: (connectionId: TId, log: ILog) => void;
  clearAllConnectionLogs: (connectionId: TId) => void;
}

const createConnectionsLogsSlice = (set, get): IConnectionsLogsSlice => ({
  connectionsLogs: {},
  addConnectionLog: (connectionId: TId, log: ILog) => {
    // console.log({ log });

    const connectionsLogs = get()?.connectionsLogs;
    if (connectionId in connectionsLogs) {
      const logs = connectionsLogs[connectionId];
      log = { ...emptyLog, ...log };

      set((s) => ({
        ...s,
        connectionsLogs: {
          ...s.connectionsLogs,
          [connectionId]: [...logs, log],
        },
      }));
    } else {
      set((s) => ({
        ...s,
        connectionsLogs: {
          ...s.connectionsLogs,
          [connectionId]: [log],
        },
      }));
    }
  },
  clearAllConnectionLogs: (connectionId: TId) => {
    const connectionsLogs = get()?.connectionsLogs;
    if (connectionId in connectionsLogs) {
      set((s) => ({
        ...s,
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
