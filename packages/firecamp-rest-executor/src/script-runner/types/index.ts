import { IRest, IRestResponse, TVariable } from '@firecamp/types';
import { IScriptRequest } from './request';

export * from './request';
export * from './response';

export type TPreScript = (
  request: IRest,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => Promise<{ request?: IScriptRequest; [k: string]: any }>;
export type TPostScript = (
  postScripts: IRest['postScripts'],
  response: IRestResponse,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => Promise<{ response: IRestResponse; environment: any }>;
export type TTestScript = (
  request: IRest,
  response: IRestResponse,
  variables?: {
    globals?: TVariable[];
    environment: TVariable[];
    collection?: TVariable[];
  }
) => Promise<any>;
