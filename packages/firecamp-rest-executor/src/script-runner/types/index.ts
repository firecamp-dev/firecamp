import { IRest, IRestResponse, IScript, TVariable } from '@firecamp/types';
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
  postScript: string,
  response: IRestResponse,
  variables: TVariable
) => Promise<{ response: IRestResponse; environment: any }>;
export type TTestScript = (
  scripts: IScript,
  response: IRestResponse,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => Promise<any>;
