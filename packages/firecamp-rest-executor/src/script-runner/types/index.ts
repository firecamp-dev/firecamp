import { IRest, IRestResponse, TRuntimeVariable } from '@firecamp/types';
import { IScriptRequest } from './request';

export * from './request';
export * from './response';

export type TPreScript = (
  request: IRest,
  variables: {
    globals: TRuntimeVariable[];
    environment: TRuntimeVariable[];
    collectionVariables: TRuntimeVariable[];
  }
) => Promise<{ request?: IScriptRequest; [k: string]: any }>;

export type TTestScript = (
  request: IRest,
  response: IRestResponse,
  variables?: {
    globals: TRuntimeVariable[];
    environment: TRuntimeVariable[];
    collectionVariables: TRuntimeVariable[];
  }
) => Promise<any>;
