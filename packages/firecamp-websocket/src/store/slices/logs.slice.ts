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

interface ILogs {
  [key: TId]: Array<ILog>;
}

interface ILogsSlice {
  logs: ILogs;
  addLog: (connectionId: TId, log: ILog) => void;
  clearLogs: (connectionId: TId) => void;
}

const createLogsSlice = (set, get): ILogsSlice => ({
  logs: {},
  addLog: (connectionId: TId, log: ILog) => {
    // console.log({ log });

    const logs = get()?.logs;
    if (connectionId in logs) {
      const logs = logs[connectionId];
      log = { ...emptyLog, ...log };

      set((s) => ({
        ...s,
        logs: {
          ...s.logs,
          [connectionId]: [...logs, log],
        },
      }));
    } else {
      set((s) => ({
        ...s,
        logs: {
          ...s.logs,
          [connectionId]: [log],
        },
      }));
    }
  },
  clearLogs: (connectionId: TId) => {
    const logs = get()?.logs;
    if (connectionId in logs) {
      set((s) => ({
        ...s,
        logs: {
          ...s.logs,
          [connectionId]: [],
        },
      }));
    }
  },
});

export { emptyLog, ILogs, ILogsSlice, createLogsSlice };
