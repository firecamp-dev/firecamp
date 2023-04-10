import { GetState, SetState } from 'zustand';
import { ISocketIO, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import {
  // request
  IRequestSlice,
  IRuntime,
  IRuntimeSlice,
  // collection
  ICollection,
  ICollectionSlice,
  // playground
  IPlayground,
  IPlaygroundSlice,
  // connections logs
  ILogsSlice,
  ILog,
  // req changes
  IRequestChangeStateSlice,
  // execute slice
  IHandleConnectionExecutorSlice,
  // ui
  IUiSlice,
  IUi,
} from './slices';

interface ISocket {
  request?: ISocketIO;
  collection?: ICollection;
  runtime?: IRuntime;
  playground?: IPlayground;
  logs?: ILog[];
  ui?: IUi;
}
interface IStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    ILogsSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice,
    IRequestChangeStateSlice {
  originalRequest?: ISocketIO;
  /** assigning new __manualUpdates key because zustand can't detect nested deep changes so useStore never detects reactive change, thus by incrementing this key tends zustand to detect change */
  __manualUpdates: number;
  context?: any;
  setContext: (ctx: any) => void;
  initialise: (request: Partial<ISocketIO>, tabId: TId) => void;
}
type TStoreSlice<T> = (
  set: SetState<IStore>,
  get: GetState<IStore>,
  ...k: any
) => T;

export { IStore, ISocket, TStoreSlice };
