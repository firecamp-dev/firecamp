import {
  EHttpMethod,
  ERequestTypes,
  EScriptLanguages,
  EScriptTypes,
  IRest,
} from '@firecamp/types';
import {
  // preScript,
  testScript,
} from '..';

const request: IRest = {
  method: EHttpMethod.GET,
  preScripts: [],
  postScripts: [
    {
      id: 'test-scripts',
      language: EScriptLanguages.JavaScript,
      type: EScriptTypes.Test,
      value: [],
    },
  ],
  __meta: {
    name: 'script',
    type: ERequestTypes.Rest,
    version: '2.0.0',
  },
  __ref: {
    id: '',
    collectionId: '',
  },
};

describe('post[x]-script, x = tests', () => {
  it('fc.test("name", fn)', async () => {
    const script = [
      `fc.test("Status code is 200", ()=> {`,
      `    fc.expect(2).to.equal(20);`,
      // `    fc.response.to.have.status(200);`,
      `});`,
    ];
    const __request = {
      ...request,
      postScripts: [
        {
          ...request.postScripts[0],
          value: script,
        },
      ],
    };
    const { fc } = await testScript(
      __request,
      {},
      {
        globals: [],
        environment: [],
        collection: [],
      }
    );
    // const expected = {};
    console.log(fc.testResult.tests[0].error);
    expect(fc.testResult.failed).toBe(1);
  });
});
