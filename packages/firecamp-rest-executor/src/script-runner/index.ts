import { IRest, IRestResponse } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import Joi from '@hapi/joi';
import tv4 from 'tv4';
import chai from 'chai';

import jsExecutor from './lib/js-executor';
import { Environment } from './environment';
import { Request } from './request';
import { Response } from './response';
import requestAssertionPlugin from './request/assertions';
import responseAssertionPlugin from './response/assertions';
import { TEnvVariable, TPostScript, TPreScript, TTestScript } from './types';
import Runner from '../test-runner/runner';

export * from './types';
export * from './snippets';

chai.use(requestAssertionPlugin);
chai.use(responseAssertionPlugin);

export const preScript: TPreScript = async (
  request: IRest,
  variables: TEnvVariable
) => {
  try {
    const script = `(()=>{
            ${request.scripts?.pre};
            return {
              request,
              environment
            }
          })()`;

    return jsExecutor(script, {
      request: new Request(request),
      environment: new Environment(variables),
    });
  } catch (error) {
    console.info('%cpre-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);

    return Promise.reject(error.message);
  }
};

export const postScript: TPostScript = async (
  postScript: string,
  response: IRestResponse,
  variables: TEnvVariable
) => {
  try {
    const script = `(()=>{
            ${postScript};
            return {
              response,
              environment
            }
          })()`;

    return jsExecutor(script, {
      response: new Response(response),
      environment: new Environment(variables),
    });
  } catch (error) {
    console.info('%cpost-script sandbox error', 'color: red; font-size: 14px');
    console.info(error);

    return Promise.reject(error.message);
  }
};

export const testScript: TTestScript = async (
  request: IRest,
  response: IRestResponse,
  variables: TEnvVariable
) => {
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
    const runner = new Runner(request.scripts.test as string);
    const result = await runner.run({
      Promise,
      request,
      response,
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
