import { GetState, SetState } from 'zustand';
import { IWebSocket, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import {
  // request
  IRequestSlice,

  // runtime
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

  // request changes
  IRequestChangeStateSlice,

  // handle execution
  IHandleConnectionExecutorSlice,

  // ui
  IUi,
  IUiSlice,
} from './slices';

interface IStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    ILogsSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice,
    IRequestChangeStateSlice {
  originalRequest?: IWebSocket;
  context?: any;
  setContext: (ctx: any) => void;
  initialise: (request: Partial<IWebSocket>, tabId: TId) => void;
}
interface IStoreState {
  request?: IWebSocket;
  collection?: ICollection;
  runtime?: IRuntime;
  playground?: IPlayground;
  logs?: ILog[];
  ui?: IUi;
}
type TStoreSlice<T> = (
  set: SetState<IStore>,
  get: GetState<IStore>,
  ...k: any
) => T;

export { IStoreState, IStore, TStoreSlice };
