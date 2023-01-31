import Joi from '@hapi/joi';
import tv4 from 'tv4';
import chai from 'chai';
import { EScriptTypes, IRest, IRestResponse, IScript } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';

import jsExecutor from './lib/js-executor';
import { Variables } from './variables';
// import { Request } from './request';
import { Response } from './response';
import requestAssertionPlugin from './request/assertions';
import responseAssertionPlugin from './response/assertions';
import Runner from '../test-runner/runner';
import {
  TEnvVariable,
  TPostScript,
  TPreScript,
  TTestScript,
  TVariable,
} from './types';

export * from './types';
export * from './snippets';

chai.use(requestAssertionPlugin);
chai.use(responseAssertionPlugin);

class Fc {
  globals: Variables;
  environment: Variables;
  collectionVariables: Variables;
  constructor(
    globalVars: TVariable[] = [],
    envVars: TVariable[] = [],
    collectionVars: TVariable[] = []
  ) {
    this.globals = new Variables(globalVars);
    this.environment = new Variables(envVars);
    this.collectionVariables = new Variables(collectionVars);
  }
  public variables = {
    get: (variableName: string) => {
      /**
       * variable find priorities
       * 1. first find in collection variables
       * 2. if not found then find in environnent variables
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
}

export const preScript: TPreScript = async (
  request: IRest,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => {
  const script: IScript | undefined = request.preScripts.find(
    (s) => s.type == EScriptTypes.PreRequest
  );
  if (!script) return {};
  try {
    const code = `(()=>{
            ${script.value.join('\n')};
            if(!result) var result;
            return {
              variables: {
                globals: fc.globals.toJSON(),
                environment: fc.environment.toJSON(),
                collection: fc.collectionVariables.toJSON(),
              },
              result, // for testing purpose to return the value, let result = fc.globals.get('name')
            }
          })()`;
    return jsExecutor(code, {
      // request: new Request(request),
      fc: new Fc(
        variables.globals,
        variables.environment,
        variables.collection
      ),
    });
  } catch (error) {
    console.info('%cpre-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    return Promise.reject(error.message);
  }
};

export const postScript: TPostScript = async (
  script: string,
  response: IRestResponse,
  variables: TEnvVariable
) => {
  if (!script) return {};
  try {
    const _script = `(()=>{
            ${script};
            return {
              response,
              environment
            }
          })()`;
    return jsExecutor(_script, {
      response: new Response(response),
      fc: new Fc(),
    });
  } catch (error) {
    console.info('%cpost-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    return Promise.reject(error.message);
  }
};

//@ts-ignore
export const testScript: TTestScript = async (
  request: IRest,
  response: IRestResponse,
  variables: TEnvVariable
) => {
  //@ts-ignore
  if (!request?.scripts?.test) return;

  Object.defineProperty(request, 'to', {
    get() {
      return chai.expect(this).to;
    },
  });

  Object.defineProperty(response, 'to', {
    get() {
      return chai.expect(this).to;
    },
  });

  try {
    //@ts-ignore
    const runner = new Runner(request.scripts.test as string);
    const result = await runner.run({
      Promise,
      request,
      response,
      //@ts-ignore
      environment: new Environment(variables),
      tv4,
      Joi,
      console,
    });
    console.log(result, 'test-runner result');
    return Promise.resolve(result);
  } catch (error) {
    console.info('%ctest-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    console.error({
      API: 'execute test script',
      error,
    });

    return Promise.reject(error.message);
  }
};
