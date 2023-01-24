import { nanoid } from 'nanoid';
import { _object } from '@firecamp/utils';
import { EVariableType, TVariable } from './types';

export class Variables implements IVariables {
  private variables: TVariable[];
  private unsetVariables: TVariable[] = [];

  constructor(variables: TVariable[]) {
    this.variables = variables;
  }

  has(variableName: string | number): boolean {
    return !!this.variables.find((v) => v.key == variableName);
  }

  get(variableName: string | number) {
    const variable = this.variables.find((v) => v.key == variableName);
    if (!variable) return '';
    if (variable.type == 'text') return variable.value;
    else if (variable.type == 'number') return +variable.value;
    else if (variable.type == 'boolean') return !!variable.value;
    else return variable.value;
  }

  set(variableName: string, variableValue: string | number | boolean) {
    const variable = this.variables.find((v) => v.key == variableName);
    const varType: EVariableType | string = typeof variableValue;
    if (!['string', 'number', 'boolean'].includes(varType)) return;
    //@ts-ignore
    const type: EVariableType =
      varType == 'string' ? EVariableType.text : varType;

    if (variable) {
      this.variables.map((v) => {
        if (v.key == variableName) {
          v.value = '' + variableValue;
          v.type = type;
        }
        return v;
      });
    } else {
      this.variables = [
        ...this.variables,
        { id: nanoid(), key: variableName, value: '' + variableValue, type },
      ];
    }
  }

  unset(variableName: string) {
    const variable = this.variables.find((v) => v.key == variableName);
    this.variables = this.variables.filter((v) => {
      return v.key != variableName;
    });
    if (variable) this.unsetVariables.push(variable);
  }

  clear() {
    this.variables = [];
    this.unsetVariables = [];
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.variables, null, 4));
  }
}

export interface IVariables {
  /**  variable exists */
  has: (variableName: string | number) => boolean;

  /** return the variable value */
  get: (variableName: string | number) => string | number | boolean | undefined;

  /** set variable name and value */
  set: (variableName: string, variableValue: string | number | boolean) => void;

  /** unset variable */
  unset: (variableName: string) => void;
}
