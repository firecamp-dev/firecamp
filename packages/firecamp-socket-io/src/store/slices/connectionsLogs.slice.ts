import { TId, ISocketIOEmitter, ERequestTypes } from '@firecamp/types';
import { ILog } from '@firecamp/socket.io-executor/dist/esm';

import { INIT_PLAYGROUND } from '../../constants/StatePayloads';
import { ELogColors, ELogTypes } from '../../constants/index';

const emptyLog = {
  title: '',
  message: {
    name: '',
    body: INIT_PLAYGROUND,
    _meta: {
      id: '',
      collection_id: '',
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
  addConnectionLog: (connection_id: TId, log: ILog) => void;
  addErrorLog: (connection_id: TId, message: string) => void;

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
  addErrorLog: (connection_id: TId, message: string) => {
    let log = {
      ...emptyLog,
      title: message || '',
      meta: {
        ...emptyLog.meta,
        type: ELogTypes.System,
        color: ELogColors.Danger,
      },
    };
    get()?.addConnectionLog(connection_id, log);
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
