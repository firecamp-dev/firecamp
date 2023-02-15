import {
  EHttpMethod,
  ERequestTypes,
  EScriptLanguages,
  EScriptTypes,
  IRest,
} from '@firecamp/types';
import { testScript } from '..';
import { Response } from '../fc/response';

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

  it('chain: fc.response.to.be', () => {
    const r200 = new Response({ code: 200 });
    expect(r200).toHaveProperty('to.be.ok');

    const r202 = new Response({ code: 202 });
    expect(r202).toHaveProperty('to.be.accepted');

    const r400 = new Response({ code: 400 });
    expect(r400).toHaveProperty('to.be.badRequest');

    const r405 = new Response({ code: 405 });
    expect(r405).toHaveProperty('to.be.clientError');

    const r403 = new Response({ code: 403 });
    expect(r403).toHaveProperty('to.be.forbidden');

    const r105 = new Response({ code: 105 });
    expect(r105).toHaveProperty('to.be.info');

    const r404 = new Response({ code: 404 });
    expect(r404).toHaveProperty('to.be.notFound');

    const r429 = new Response({ code: 429 });
    expect(r429).toHaveProperty('to.be.rateLimited');

    const r302 = new Response({ code: 302 });
    expect(r302).toHaveProperty('to.be.redirection');

    const r500 = new Response({ code: 500 });
    expect(r500).toHaveProperty('to.be.serverError');

    const r210 = new Response({ code: 210 });
    expect(r210).toHaveProperty('to.be.success');

    const r401 = new Response({ code: 401 });
    expect(r401).toHaveProperty('to.be.unauthorized');
  });

  it('chain: fc.response.to.have', () => {
    const rBody = new Response({ body: { name: 'Ramanujan' } });

    // TODO: need to write tests
    // expect(rBody.to.have.body).toContainEqual({ name: 'Ramanujan' });
    // expect(rBody).toHaveProperty('to.have.body', { name: 'Ramanujan' });

    // expect(r401).toHaveProperty('to.have.header');
    // expect(r401).toHaveProperty('to.have.jsonBody');
    // expect(r401).toHaveProperty('to.have.jsonSchema');
    // expect(r401).toHaveProperty('to.have.status');
  });
});
