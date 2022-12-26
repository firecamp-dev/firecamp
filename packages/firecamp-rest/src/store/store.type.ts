import { GetState, SetState } from 'zustand';
import { EFirecampAgent, IRest, IRestResponse, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';

import {
  IRequestSlice,
  IRuntime,
  IRuntimeSlice,
  IResponseSlice,
  IUi,
  IUiSlice,
  IPullSlice,
  IRequestChangeStateSlice,
} from './slices';
import { IRestClientRequest } from '../types';

interface IStore
  extends IRequestSlice,
    IRuntimeSlice,
    IResponseSlice,
    IUiSlice,
    IPullSlice,
    IRequestChangeStateSlice {
  originalRequest?: IRest;
  context?: any;
  setContext: (ctx: any) => void;
  initialise: (request: IRest, tabId: TId) => void;
  execute(
    variables: {
      merged: {};
      workspace: {};
      collection?: {};
    },
    fcAgent: EFirecampAgent,
    onChangeVariables: TOnChangeVariables
  ): void;
}

type TOnChangeVariables = ({
  workspace,
  collection,
}: {
  workspace: { [key: string]: any };
  collection?: { [key: string]: any };
}) => void;

interface IStoreState {
  request?: IRestClientRequest;
  runtime?: IRuntime;
  response?: IRestResponse;
  ui?: IUi;
}

type TStoreSlice<T> = (
  set: SetState<IStore>,
  get: GetState<IStore>,
  ...k: any
) => T;

export { IStoreState, IStore, TStoreSlice, TOnChangeVariables };
