// import Joi from '@hapi/joi';
// import tv4 from 'tv4';
import chai from 'chai';
import { TVariable } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import { Request } from './request';
import { Response } from './response';
import { Variables } from './variables';
import { Test } from './tests';

export default class Fc implements IFc {
  request: any;
  response: any;
  globals: Variables;
  environment: Variables;
  collectionVariables: Variables;
  private testManager = new Test();
  constructor(
    request: any,
    response: any,
    globalVars: TVariable[] = [],
    envVars: TVariable[] = [],
    collectionVars: TVariable[] = []
  ) {
    this.request = new Request(request);
    this.response = new Response(response);
    this.globals = new Variables(globalVars);
    this.environment = new Variables(envVars);
    this.collectionVariables = new Variables(collectionVars);
  }
  public variables = {
    get: (variableName: string) => {
      /**
       * variable find priorities
       * 1. first find in collection variables
       * 2. if not found then find in environment variables
       * 3. if not found then find in globals variables
       */
      let value = this.collectionVariables.get(variableName);
      if (value === undefined) {
        value = this.environment.get(variableName);
      } else {
        value = this.globals.get(variableName);
      }
      return value;
    },
  };
  public test = this.testManager.test;
  public expect = chai.expect;

  public toJSON() {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      globals: this.globals.toJSON(),
      environment: this.environment.toJSON(),
      collectionVariables: this.collectionVariables.toJSON(),
      testResult: this.testManager.toJSON(),
    };
  }
}

interface IFc {
  request: any;
  response: any;
  variables: any;
  collectionVariables: Variables;
  globals: Variables;
  test: (testName: string, specFunction: Function) => void;
  expect: Chai.ExpectStatic;
}

/** example */
// const fc = new Fc({}, {}, [], [], [{ key: 'name', value: 'Ramanujan' }]);
// const { collectionVariables } = fc.toJSON();
// console.log(
//   typeof collectionVariables,
//   collectionVariables,
//   Array.isArray(collectionVariables)
// );
