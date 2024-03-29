import { nanoid } from 'nanoid';
import { _object } from '@firecamp/utils';
import { EVariableType, TRuntimeVariable } from '@firecamp/types';

export class Variables implements IVariables {
  private variables: TRuntimeVariable[];
  // private unsetVariables: TRuntimeVariable[] = [];

  constructor(variables: TRuntimeVariable[]) {
    this.variables = variables;
  }

  has(variableName: string | number): boolean {
    return !!this.variables.find((v) => v.key == variableName);
  }

  get(variableName: string) {
    const variable = this.variables.find((v) => v.key == variableName);
    if (!variable) return '';
    if (variable.type == 'text') return variable.value;
    else if (variable.type == 'number') return +variable.value;
    else if (variable.type == 'boolean')
      return variable.value == 'true' ? true : false;
    else return variable.value;
  }

  set(variableName: string, variableValue: string | number | boolean) {
    if (!variableName) return;
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
        {
          id: nanoid(),
          key: variableName,
          initialValue: '',
          value: '' + variableValue,
          type,
        },
      ];
    }
  }

  unset(variableName: string) {
    // const variable = this.variables.find((v) => v.key == variableName);
    this.variables = this.variables.filter((v) => {
      return v.key != variableName;
    });
    // if (variable) this.unsetVariables.push(variable);
  }

  clear() {
    this.variables = [];
    // this.unsetVariables = [];
  }

  toJSON() {
    return this.variables;
  }
}

export interface IVariables {
  /**  variable exists */
  has: (variableName: string | number) => boolean;

  /** return the variable value */
  get: (variableName: string) => string | number | boolean | undefined;

  /** set variable name and value */
  set: (variableName: string, variableValue: string | number | boolean) => void;

  /** unset variable */
  unset: (variableName: string) => void;
}
