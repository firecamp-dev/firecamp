import {
  EHttpMethod,
  ERequestTypes,
  EScriptLanguages,
  EScriptTypes,
  IRest,
} from '@firecamp/types';
import { testScript } from '..';

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
  it('fc.expect - pass test', async () => {
    const postScripts = [
      {
        ...request.postScripts[0],
        value: [
          `fc.test("Status code is 200", ()=> {`,
          `    fc.expect(200).to.equal(200);`,
          `});`,
        ],
      },
    ];
    const __request = { ...request, postScripts };
    const { fc } = await testScript(__request, {});
    const expected = {
      passed: 1,
      property: 'error',
      name: 'Status code is 200',
    };
    expect(fc.testResult.passed).toBe(expected.passed);
    expect(fc.testResult.tests[0]).not.toHaveProperty(expected.property);
    expect(fc.testResult.tests[0].name).toMatch(expected.name);
  });

  it('fc.expect - fail test', async () => {
    const postScripts = [
      {
        ...request.postScripts[0],
        value: [
          `fc.test("Status code is 200", ()=> {`,
          `    fc.expect(2).to.equal(20);`,
          `});`,
        ],
      },
    ];
    const __request = { ...request, postScripts };
    const { fc } = await testScript(__request, {});
    const expected = { failed: 1, property: 'error' };
    expect(fc.testResult.failed).toBe(expected.failed);
    expect(fc.testResult.tests[0]).toHaveProperty(expected.property);
  });

  it('fc.response.to.have.status(200) - pass test', async () => {
    const postScripts = [
      {
        ...request.postScripts[0],
        value: [
          `fc.test("Status code is 200", ()=> {`,
          `    fc.response.to.have.status(200);`,
          `});`,
        ],
      },
    ];
    const __request = { ...request, postScripts };
    const { fc } = await testScript(__request, {});
    const expected = { passed: 1 };
    expect(fc.testResult.failed).toBe(expected.passed);
  });
});
