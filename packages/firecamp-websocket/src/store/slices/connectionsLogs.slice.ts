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
  addConnectionLog: (connection_id: TId, log: ILog) => void;

  clearAllConnectionLogs: (connection_id: TId) => void;
}

const createConnectionsLogsSlice = (set, get): IConnectionsLogsSlice => ({
  connectionsLogs: {},

  addConnectionLog: (connection_id: TId, log: ILog) => {
    // console.log({ log });

    let connectionsLogs = get()?.connectionsLogs;
    if (connection_id in connectionsLogs) {
      let logs = connectionsLogs[connection_id];
      log = { ...emptyLog, ...log };

      set((s) => ({
        ...s,
        connectionsLogs: {
          ...s.connectionsLogs,
          [connection_id]: [...logs, log],
        },
      }));
    } else {
      set((s) => ({
        ...s,
        connectionsLogs: {
          ...s.connectionsLogs,
          [connection_id]: [log],
        },
      }));
    }
  },
  clearAllConnectionLogs: (connection_id: TId) => {
    let connectionsLogs = get()?.connectionsLogs;
    if (connection_id in connectionsLogs) {
      set((s) => ({
        ...s,
        connectionsLogs: {
          ...s.connectionsLogs,
          [connection_id]: [],
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
