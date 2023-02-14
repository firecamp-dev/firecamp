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
  const fc = new Fc(request, {}, variables);
  if (!request?.preScripts?.length) return { fc: fc.toJSON() };
  const script: IScript | undefined = request.preScripts.find(
    (s) => s.type == EScriptTypes.PreRequest
  );
  if (!script) return { fc: fc.toJSON() };
  const value = script.value.join('\n').trim();
  if (!value) return { fc: fc.toJSON() };

  try {
    const code = prepareCode(value);
    return await jsExecutor(code, { fc });
  } catch (e) {
    console.info(
      '%c pre-request script sandbox error',
      'color: red; font-size: 14px'
    );
    // console.info(e);
    return Promise.resolve({
      fc: fc.toJSON(),
      error: {
        name: e.name,
        message: e.message,
        // stack: e.stack,
      },
    });
  }
};

export const testScript: TTestScript = async (
  request: IRest,
  response: IRestResponse,
  variables = { globals: [], environment: [], collectionVariables: [] }
) => {
  const fc = new Fc(request, response, variables);
  if (!request?.postScripts?.length) return { fc: fc.toJSON() };
  const script: IScript | undefined = request.postScripts.find(
    (s) => s.type == EScriptTypes.Test
  );
  if (!script) return { fc: fc.toJSON() };
  const value = script.value.join('\n').trim();
  if (!value) return { fc: fc.toJSON() };

  try {
    const code = prepareCode(value);
    return await jsExecutor(code, { fc });
  } catch (e) {
    console.info('%c test-script sandbox error', 'color: red; font-size: 14px');
    // console.error('execute test script', e);
    return Promise.resolve({
      fc: fc.toJSON(),
      error: {
        name: e.name,
        message: e.message,
        // stack: e.stack,
      },
    });
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

export type TPreScript = (
  request: IRest,
  variables: {
    globals: TRuntimeVariable[];
    environment: TRuntimeVariable[];
    collectionVariables: TRuntimeVariable[];
  }
) => Promise<{
  fc: any;
  error: { name: string; message: string };
  result?: any;
}>;

export type TTestScript = (
  request: IRest,
  response: IRestResponse,
  variables?: {
    globals: TRuntimeVariable[];
    environment: TRuntimeVariable[];
    collectionVariables: TRuntimeVariable[];
  }
) => Promise<{
  fc: any;
  error: { name: string; message: string };
  result?: any;
}>;
