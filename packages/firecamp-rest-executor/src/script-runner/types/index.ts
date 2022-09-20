import { IRest, IRestResponse } from '@firecamp/types'
import { IEnvironment } from './environment'
import { IScriptRequest } from './request'

export * from './environment'
export * from './request'
export * from './response'

export type TEnvVariable = { [key: string]: number | boolean | string }

export type TPreScript = (request: IRest, variables: TEnvVariable) => Promise<{ request: IScriptRequest, environment: IEnvironment }>

export type TPostScript = (postScript: string, response: IRestResponse, variables: TEnvVariable) => Promise<{ response: IRestResponse, environment: IEnvironment }>

export type TTestScript = (
    request: IRest,
    response: IRestResponse,
    variables: TEnvVariable
) => Promise<any>