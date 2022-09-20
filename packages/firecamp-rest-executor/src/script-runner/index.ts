import { IRest, IRestResponse } from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import Joi from '@hapi/joi';
import tv4 from 'tv4';
import chai, { assert, should, expect } from 'chai';
import jsExecutor from './lib/js-executor';
import { Environment } from './environment';
import { Request } from './request';
import { Response } from './response';
import requestAssertionPlugin from './request/assertions';
import responseAssertionPlugin from './response/assertions';
import { TEnvVariable, TPostScript, TPreScript, TTestScript } from './types';
import editSuite from './lib/mocha/editSuite';
// Used mocha lib v8.3.0 cdn: https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.0/mocha.min.js
import './lib/mocha/mocha.min';

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
  if (_string.isEmpty(request?.scripts?.test || '')) return;

  try {
    const script = `
        ${request.scripts?.test};
        (() => {
          return new Promise ((resolve, reject) => {
            console.log('test runner started')
            
            mocha.run()
             .on("error", function(test, error) {
                console.error({
                  API: 'error in test script',
                  error
                });
                reject(error);
             })
             .on("end", function(suite) {
               resolve(editSuite(this));
             });
          });
        })()`;

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

    // Creating a new context to execute test-script code using vm module
    const result = await jsExecutor(script, {
      mocha: window['mocha'],
      describe: window.describe,
      it: window.it,
      chai,
      assert,
      should,
      expect,
      Promise,
      editSuite,
      request,
      response,
      environment: new Environment(variables),
      tv4,
      Joi,
      console,
    });

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
