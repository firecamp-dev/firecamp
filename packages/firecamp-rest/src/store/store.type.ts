import { GetState, SetState } from 'zustand';
import { IRest, IRestResponse, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';

import {
  IRequestSlice,
  IRuntime,
  IRuntimeSlice,
  IResponseSlice,
  IUi,
  IUiSlice,
  IRequestChangeStateSlice,
  IExecutionSlice
} from './slices';

interface IStore
  extends IRequestSlice,
    IRuntimeSlice,
    IResponseSlice,
    IUiSlice,
    IRequestChangeStateSlice,
    IExecutionSlice {
  originalRequest?: IRest;
  context?: any;
  setContext: (ctx: any) => void;
  initialise: (request: IRest, tabId: TId) => void;
}

interface IStoreState {
  originalRequest?: IRest;
  request?: IRest;
  runtime?: IRuntime;
  response?: IRestResponse;
  ui?: IUi;
}

type TStoreSlice<T> = (
  set: SetState<IStore>,
  get: GetState<IStore>,
  ...k: any
) => T;

export { IStoreState, IStore, TStoreSlice };
