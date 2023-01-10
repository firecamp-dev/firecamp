import { _object } from '@firecamp/utils'
import { TEnvVariable } from './types'
import { IEnvironment } from './types/environment'

export class Environment implements IEnvironment {
    variables = {}

    constructor(variables: TEnvVariable) {
        this.variables = variables
    }

    has(variableName: string | number): boolean {
        if (this.variables[variableName]) return true
        else return false
    }

    get(variableName: string | number): string | number | boolean {
        return this.variables[variableName]
    }

    // TODO: Need to check logic to replace mock variables
    // replace(data: string): string {}

    collection = {
        variables: {},
        unsetVariables: [],
        name: '',
        clearEnvironment: false,
        set(variableName: string, variableValue: string | number | boolean) {
            this.variables[variableName] = variableValue
        },
        unset(...variableNames: string[]) {
            this.variables = _object.omit(this.variables, variableNames)

            this.unsetVariables = variableNames
        },
        clear() {
            this.clearEnvironment = true
            this.variables = {}
            this.unsetVariables = []
        }
    }
}