import { EArgumentBodyType } from '@firecamp/types';
import { ILog } from '@firecamp/socket.io-executor/dist/esm';
import { ELogColors, ELogTypes } from '../../types';
import { TStoreSlice } from '../store.type';

const emptyLog = {
  title: '',
  value: [{ value: '', type: EArgumentBodyType.Text }],
  __meta: {
    event: '',
    timestamp: 0,
    type: ELogTypes.System,
    color: ELogColors.Success,
    ackRef: '',
  },
};

interface ILogsSlice {
  logs: ILog[];
  addLog: (log: ILog) => void;
  addErrorLog: (message: string) => void;
  clearLogs: () => void;
}

const createLogsSlice: TStoreSlice<ILogsSlice> = (set, get) => ({
  logs: [],

  addLog: (log: ILog) => {
    set((s) => ({
      logs: [...s.logs, { ...emptyLog, ...log }],
    }));
  },
  addErrorLog: (message: string) => {
    const state = get();
    const log = {
      ...emptyLog,
      title: message || '',
      __meta: {
        ...emptyLog.__meta,
        type: ELogTypes.System,
        color: ELogColors.Danger,
        event: '-',
      },
      __ref: { id: '' },
    };
    state.addLog(log);
  },
  clearLogs: () => {
    set((s) => ({ logs: [] }));
  },
});

export { emptyLog, ILogsSlice, createLogsSlice };
export type { ILog };
