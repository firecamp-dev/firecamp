import {
  ERestBodyTypes,
  EHttpMethod,
  ERequestTypes,
  IRest,
} from '@firecamp/types';
import { postScript, preScript } from '../';

const request: IRest = {
  meta: {
    name: 'script',
    type: ERequestTypes.Rest,
    version: '2.0.0',
    active_body_type: ERestBodyTypes.NoBody,
  },
  method: EHttpMethod.GET,
  _meta: {
    id: '',
    collectionId: '',
  },
  scripts: {
    pre: `request.addHeader('content-type', 'application/json')
        request.addQueryParam('id', '1')
        environment.collection.set('token', 123)
        environment.workspace.set('id', 1)`,
    post: `environment.collection.set('token', 123)
        environment.workspace.set('id', 1)`,
  },
};

let preScriptResponse;
let postScriptResponse;

beforeAll(async () => {
  preScriptResponse = await preScript(request, {});
  postScriptResponse = await postScript(
    request.scripts?.post || '',
    {
      statusCode: 202,
    },
    {}
  );
});

describe('pre script', () => {
  it('should set new header', () => {
    expect(preScriptResponse.request.headers).toMatchObject([
      { key: 'content-type', value: 'application/json' },
    ]);
  });

  it('should set new query param', () => {
    expect(preScriptResponse.request.url.queryParams).toMatchObject([
      { key: 'id', value: '1' },
    ]);
  });

  it('should set collection env variable', () => {
    expect(preScriptResponse.environment.collection.variables).toMatchObject({
      token: 123,
    });
  });

  it('should set workspace env variable', () => {
    expect(preScriptResponse.environment.workspace.variables).toMatchObject({
      id: 1,
    });
  });
});

describe('post script', () => {
  it('should set collection env variable', () => {
    expect(postScriptResponse.environment.collection.variables).toMatchObject({
      token: 123,
    });
  });

  it('should set workspace env variable', () => {
    expect(postScriptResponse.environment.workspace.variables).toMatchObject({
      id: 1,
    });
  });
});
