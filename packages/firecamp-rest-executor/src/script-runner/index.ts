// import Joi from '@hapi/joi';
// import tv4 from 'tv4';
import chai from 'chai';
import {
  EScriptTypes,
  IRest,
  IRestResponse,
  IScript,
  TRuntimeVariable,
} from '@firecamp/types';
import { _misc, _string } from '@firecamp/utils';
import jsExecutor from './lib/js-executor';
import requestAssertionPlugin from './fc/request/assertions';
import responseAssertionPlugin from './fc/response/assertions';
import Fc from './fc';
import { TPreScript, TTestScript } from './types';

export * from './types';
export * from './snippets';

chai.use(requestAssertionPlugin);
chai.use(responseAssertionPlugin);

export const preScript: TPreScript = async (
  request: IRest,
  variables: {
    globals: TRuntimeVariable[];
    environment: TRuntimeVariable[];
    collectionVariables: TRuntimeVariable[];
  }
) => {
  if (!request?.preScripts?.length) return {};
  const script: IScript | undefined = request.preScripts.find(
    (s) => s.type == EScriptTypes.PreRequest
  );
  if (!script) return {};
  const value = script.value.join('\n').trim();
  const fc = new Fc(request, {}, variables);
  if (!value) return { fc: fc.toJSON() };

  try {
    const code = prepareCode(value);
    return jsExecutor(code, {
      fc: new Fc(request, {}, variables),
    });
  } catch (error) {
    console.info(
      '%c pre-request script sandbox error',
      'color: red; font-size: 14px'
    );
    console.info(error);
    return Promise.reject(error.message);
  }
};

export const testScript: TTestScript = async (
  request: IRest,
  response: IRestResponse,
  variables = { globals: [], environment: [], collectionVariables: [] }
) => {
  if (!request?.postScripts?.length) return {};
  const script: IScript | undefined = request.postScripts.find(
    (s) => s.type == EScriptTypes.Test
  );
  if (!script) return {};
  const value = script.value.join('\n').trim();
  const fc = new Fc(request, response, variables);
  if (!value) return { fc: fc.toJSON() };
  try {
    const code = prepareCode(value);
    return jsExecutor(code, { fc });
  } catch (e) {
    console.info('%c test-script sandbox error', 'color: red; font-size: 14px');
    console.error('execute test script', e);
    return Promise.reject(e.message);
  }
};

const prepareCode = (value: string) => {
  return `(()=>{
            ${value}
            return {
              fc: fc.toJSON(),
              result: typeof result === 'undefined'? null: result, // for testing purpose to return the value, let result = fc.globals.get('name')
            }
          })()`;
};
