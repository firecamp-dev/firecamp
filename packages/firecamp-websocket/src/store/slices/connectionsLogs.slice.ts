import { TId, EMessageBodyType } from '@firecamp/types';
import { ILog } from '@firecamp/ws-executor/dist/esm';

const emptyLog = {
  title: '',
  message: {
    body: '',
    meta: {
      type: EMessageBodyType.Text,
      envelope: '',
    },
  },
  meta: {
    id: '',
    event: '',
    timestamp: new Date().getTime(),
    type: '',
    color: '',
    ackRef: '',
  },
};

interface IConnectionsLogs {
  connectionsLogs: { [key: TId]: Array<ILog> };
}

interface IConnectionsLogsSlice extends IConnectionsLogs {
  addConnectionLog: (connectionId: TId, log: ILog) => void;
  clearAllConnectionLogs: (connectionId: TId) => void;
}

const createConnectionsLogsSlice = (set, get): IConnectionsLogsSlice => ({
  connectionsLogs: {},
  addConnectionLog: (connectionId: TId, log: ILog) => {
    // console.log({ log });

    let connectionsLogs = get()?.connectionsLogs;
    if (connectionId in connectionsLogs) {
      let logs = connectionsLogs[connectionId];
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
    let connectionsLogs = get()?.connectionsLogs;
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
