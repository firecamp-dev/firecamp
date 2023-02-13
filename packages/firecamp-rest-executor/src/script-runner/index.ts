import Joi from '@hapi/joi';
import tv4 from 'tv4';
import chai from 'chai';
import {
  EScriptTypes,
  IRest,
  IRestResponse,
  IScript,
  TVariable,
} from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import jsExecutor from './lib/js-executor';
import { Response } from './fc/response';
import requestAssertionPlugin from './fc/request/assertions';
import responseAssertionPlugin from './fc/response/assertions';
import Fc from './fc';
import Runner from '../test-runner/runner';
import { TPostScript, TPreScript, TTestScript } from './types';

export * from './types';
export * from './snippets';

chai.use(requestAssertionPlugin);
chai.use(responseAssertionPlugin);

export const preScript: TPreScript = async (
  request: IRest,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => {
  if (!request?.preScripts?.length) return {};
  const script: IScript | undefined = request.preScripts.find(
    (s) => s.type == EScriptTypes.PreRequest
  );
  if (!script) return {};
  try {
    const code = `(()=>{
            ${script.value.join('\n')};
            return {
              fc: fc.toJSON(),
              result: typeof result === 'undefined'? null: result, // for testing purpose to return the value, let result = fc.globals.get('name')
            }
          })()`;
    return jsExecutor(code, {
      // request: new Request(request),
      fc: new Fc(
        {},
        {},
        variables.globals,
        variables.environment,
        variables.collection
      ),
    });
  } catch (error) {
    console.info('%c pre-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    return Promise.reject(error.message);
  }
};

export const postScript: TPostScript = async (
  postScripts,
  response,
  variables
) => {
  if (!postScripts?.length) return {};
  const script: IScript | undefined = postScripts.find(
    (s) => s.type == EScriptTypes.Test
  );
  if (!script) return {};
  try {
    const _script = `(()=>{
            ${script.value.join('\n')};
            return {
              response,
              variables: {
                globals: fc.globals.toJSON(),
                environment: fc.environment.toJSON(),
                collection: fc.collectionVariables.toJSON(),
              },
            }
          })()`;
    return jsExecutor(_script, {
      response: new Response(response),
      fc: new Fc(
        variables.globals,
        variables.environment,
        variables.collection
      ),
    });
  } catch (error) {
    console.info('%c post-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    return Promise.reject(error.message);
  }
};

export const testScript: TTestScript = async (
  request: IRest,
  response: IRestResponse,
  variables: {
    globals: TVariable[];
    environment: TVariable[];
    collection: TVariable[];
  }
) => {
  if (!request?.postScripts?.length) return {};
  const script: IScript | undefined = request.postScripts.find(
    (s) => s.type == EScriptTypes.Test
  );
  if (!script) return {};
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
    const code = `(async()=>{
            await ${script.value.join('\n')};
            return {
              fc: fc.toJSON(),
              result: typeof result === 'undefined'? null: result, // for testing purpose to return the value, let result = fc.globals.get('name')
            }
          })()`;
    return jsExecutor(code, {
      fc: new Fc(
        request,
        response,
        variables.globals,
        variables.environment,
        variables.collection
      ),
    });
  } catch (e) {
    console.info('%c test-script sandbox error', 'color: red; font-size: 14px');
    console.error('execute test script', e);
    return Promise.reject(e.message);
  }

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
    console.info('%c test-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);
    console.error({
      API: 'execute test script',
      error,
    });

    return Promise.reject(error.message);
  }
};
