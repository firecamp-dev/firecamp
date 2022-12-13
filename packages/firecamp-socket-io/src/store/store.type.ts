import create, { GetState, SetState } from 'zustand';
import { ISocketIO, TId } from '@firecamp/types';

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
  IPlaygrounds,
  IPlaygroundSlice,
  // connections logs
  IConnectionsLogsSlice,
  IConnectionsLogs,
  // req changes
  IRequestChangeStateSlice,
  // execute slice
  IHandleConnectionExecutorSlice,
  // ui
  IUiSlice,
  IUi,
} from './slices';
import { _object } from '@firecamp/utils';
interface ISocket {
  request?: ISocketIO;
  collection?: ICollection;
  runtime?: IRuntime;
  playgrounds?: IPlaygrounds;
  connectionsLogs?: IConnectionsLogs;
  ui?: IUi;
}

interface ISocketStore 
  extends IRequestSlice,
  IRuntimeSlice,
  ICollectionSlice,
  IPlaygroundSlice,
  IConnectionsLogsSlice,
  IHandleConnectionExecutorSlice,
  IUiSlice,
  IRequestChangeStateSlice {
  initialise: (request: Partial<ISocketIO>, tabId: TId) => void;
}

type TStoreSlice<T> = (
  set: SetState<ISocketStore>,
  get: GetState<ISocketStore>,
  ...k: any
) => T;

export { ISocketStore, ISocket, TStoreSlice };
