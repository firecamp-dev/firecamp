import { TId, ISocketIOEmitter, ERequestTypes } from '@firecamp/types';
import { ILog } from '@firecamp/socket.io-executor/dist/esm';

import { InitPayload } from '../../constants';
import { ELogColors, ELogTypes } from '../../types';

const emptyLog = {
  title: '',
  message: {
    name: '',
    body: InitPayload,
    _meta: {
      id: '',
      collectionId: '',
      request_id: '',
      request_type: ERequestTypes.SocketIO,
    },
  },
  meta: {
    id: '',
    event: '',
    timestamp: 0,
    type: ELogTypes.System,
    color: ELogColors.Success,
    ackRef: '',
  },
};

interface IConnectionsLogs {
  connectionsLogs: { [key: TId]: Array<ILog> };
}

interface IConnectionsLogsSlice extends IConnectionsLogs {
  addConnectionLog: (connectionId: TId, log: ILog) => void;
  addErrorLog: (connectionId: TId, message: string) => void;

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
  addErrorLog: (connectionId: TId, message: string) => {
    let log = {
      ...emptyLog,
      title: message || '',
      meta: {
        ...emptyLog.meta,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      },
    };
    get()?.addConnectionLog(connectionId, log);
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
