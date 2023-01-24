import { IRest, IRestResponse, IScript } from '@firecamp/types';
import { IScriptRequest } from './request';

export * from './request';
export * from './response';

export type TEnvVariable = { [key: string]: number | boolean | string };
export type TPreScript = (
  request: IRest,
  variables: TVariable
) => Promise<{ request: IScriptRequest; fc: any }>;
export type TPostScript = (
  postScript: string,
  response: IRestResponse,
  variables: TVariable
) => Promise<{ response: IRestResponse; environment: any }>;
export type TTestScript = (
  scripts: IScript,
  response: IRestResponse,
  variables: TVariable
) => Promise<any>;

export enum EVariableType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  secret = 'secret',
}

export type TVariable = {
  id?: string;
  key: string;
  value: string;
  type?: EVariableType;
  disable?: boolean;
};
