import { EMessageBodyType } from '@firecamp/types';
import { ELogColors, ELogTypes, ILog } from '@firecamp/ws-executor/dist/esm';
import { TStoreSlice } from '../store.type';

const emptyLog: ILog = {
  title: '',
  value: {
    value: '',
    type: EMessageBodyType.Text,
  },
  __meta: {
    event: '',
    timestamp: new Date().getTime(),
    type: ELogTypes.System,
    color: ELogColors.Success,
    ackRef: '',
  },
  __ref: {
    id: '',
  },
};

interface ILogsSlice {
  logs: ILog[];
  addLog: (log: ILog) => void;
  clearLogs: () => void;
}

const createLogsSlice: TStoreSlice<ILogsSlice> = (set, get) => ({
  logs: [],
  addLog: (log: ILog) => {
    // console.log({ log });
    set((s) => ({
      logs: [...s.logs, { ...emptyLog, ...log }],
    }));
  },
  clearLogs: () => {
    set((s) => ({ logs: [] }));
  },
});

export { emptyLog, ILogsSlice, createLogsSlice };
export type { ILog };
