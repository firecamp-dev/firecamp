import { TId } from './general'
import { IKeyValueTable } from './key-value-table'

/** @deprecated */
export enum EEnvironmentScope {
  Workspace = 'WRS',
  Collection = 'C',
}

/**
 * @deprecated
 * firecamp environment for holding workspace and collection
 * scope variables which use directly into the request via: {{$variableName}}
 */
export interface IEnvironment {
  name: string
  variables?: object
  __meta: {
    type: EEnvironmentScope
  }
  __ref: {
    id: TId
    workspaceId?: TId
    collectionId?: TId
    createdAt?: Date | number
    createdBy: string
    updatedAt?: Date | number
    updatedBy: string
  }
}
export interface IEnv {
  name: string
  description?: string
  variables: IKeyValueTable<EVariableType>[]
  __meta?: { isGlobal?: boolean }
  __ref: {
    id: TId
    workspaceId?: TId
    createdAt?: Date | number
    createdBy?: TId
    updatedAt?: Date | number
    updatedBy?: TId
  }
}

/** RuntimeEnv is the merge of remote and local env, which is used for managing initial value and current value */
export interface IRuntimeEnv extends IEnv {
  variables: {
    id: TId
    key: string
    initialValue: string
    value: string
    type: EVariableType
  }[]
}

export enum EVariableType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  secret = 'secret',
}
export type TVariable = {
  id?: string
  key: string
  value: string
  type?: EVariableType
  disable?: boolean
}
export type TRuntimeVariable = TVariable & { initialValue: string }

/**
 * Variable group holds the runtime variables array of globals, environment and collectionVariables
 */
export interface IVariableGroup {
  globals: TRuntimeVariable[];
  environment: TRuntimeVariable[];
  collectionVariables: TRuntimeVariable[];
  __meta?: {
    environmentName?: string,
    collectionName?: string
  }
}
