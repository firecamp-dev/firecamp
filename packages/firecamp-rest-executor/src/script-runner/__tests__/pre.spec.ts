import {
  EHttpMethod,
  ERequestTypes,
  EScriptLanguages,
  EScriptTypes,
  IRest,
} from '@firecamp/types';
import {
  preScript,
  // postScript
} from '../';

const request: IRest = {
  method: EHttpMethod.GET,
  preScripts: [
    {
      id: '123',
      language: EScriptLanguages.JavaScript,
      type: EScriptTypes.PreRequest,
      value: [
        `fc.globals.get('name', 'Firecamp')`,
        `fc.globals.set('founded', '2023')`,
        `console.log(fc.globals)`,
      ],
    },
  ],
  postScripts: [],
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

let preScriptRes;
// let postScriptResponse;

beforeAll(async () => {
  // preScriptRes = await preScript(request, { key: 'a', value: 'b' });
  // postScriptResponse = await postScript(
  //   //@ts-ignore
  //   request.postScripts || [],
  //   {
  //     statusCode: 202,
  //   },
  //   {}
  // );
});

describe('pre script', () => {
  beforeAll(async () => {
    preScriptRes = await preScript(request, { key: 'a', value: 'b' });
  });
  it('should set new header', () => {
    expect(preScriptRes).toMatchObject([
      { key: 'content-type', value: 'application/json' },
    ]);
  });

  // it('should set new header', () => {
  //   expect(preScriptRes.request.headers).toMatchObject([
  //     { key: 'content-type', value: 'application/json' },
  //   ]);
  // });

  // it('should set new query param', () => {
  //   expect(preScriptRes.request.url.queryParams).toMatchObject([
  //     { key: 'id', value: '1' },
  //   ]);
  // });

  // it('should set collection env variable', () => {
  //   expect(preScriptRes.environment.collection.variables).toMatchObject({
  //     token: 123,
  //   });
  // });

  // it('should set workspace env variable', () => {
  //   expect(preScriptRes.environment.workspace.variables).toMatchObject({
  //     id: 1,
  //   });
  // });
});

// describe('post script', () => {
//   it('should set collection env variable', () => {
//     expect(postScriptResponse.environment.collection.variables).toMatchObject({
//       token: 123,
//     });
//   });

//   it('should set workspace env variable', () => {
//     expect(postScriptResponse.environment.workspace.variables).toMatchObject({
//       id: 1,
//     });
//   });
// });
