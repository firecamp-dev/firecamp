import { IRest, IRestResponse } from '@firecamp/types'
import { IEnvironment } from './environment'
import { IScriptRequest } from './request'

export * from './environment'
export * from './request'
export * from './response'

export type TEnvVariable = { [key: string]: number | boolean | string }
export type TPreScript = (request: IRest, variables: TVariable) => Promise<{ request: IScriptRequest, environment: IEnvironment }>
export type TPostScript = (postScript: string, response: IRestResponse, variables: TVariable) => Promise<{ response: IRestResponse, environment: IEnvironment }>
export type TTestScript = (
    request: IRest,
    response: IRestResponse,
    variables: TVariable
) => Promise<any>


export enum EVariableType {
    text= 'text',
    number= 'number',
    boolean = 'boolean',
    secret = 'secret'
}

export type TVariable = {
    id?: string,
    key: string,
    value: string,
    type?: EVariableType,
    disable?: boolean
}