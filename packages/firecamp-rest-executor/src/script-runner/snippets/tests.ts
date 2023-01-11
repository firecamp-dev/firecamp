export default {
  id: 'tests',
  name: 'TestCases Snippets',
  groups: [
    {
      id: 'requestTests',
      name: 'request tests',
      snippets: [
        {
          id: 'url',
          name: 'should have request URL same',
          value: 'request.to.have.url(urlObject);',
        },
        {
          id: 'method',
          name: 'should have request method same',
          value: 'request.to.have.method("methodName");',
        },
        {
          id: 'query',
          name: 'should have query',
          value: 'request.to.have.query("queryName");',
        },
        {
          id: 'header',
          name: 'should have header',
          value: 'request.to.have.header("headerName");',
        },
        {
          id: 'body',
          name: 'should have body set',
          value: 'request.to.have.body();',
        },
        {
          id: 'body',
          name: 'should have body of content type',
          value: 'request.to.have.body("contentType");',
        },
      ],
    },
    {
      id: 'responseTests',
      name: 'response tests',
      snippets: [
        {
          id: 'accepted',
          name: 'status code must be 202',
          value: 'response.to.be.accepted;',
        },
        {
          id: 'badRequest',
          name: 'status code must be 400',
          value: 'response.to.be.badRequest;',
        },
        {
          id: 'clientError',
          name: 'checks stats code between 400 and 500',
          value: 'response.to.be.clientError;',
        },
        {
          id: 'forbidden',
          name: 'status code should be 403',
          value: 'response.to.be.forbidden;',
        },
        {
          id: 'info',
          name: 'checks status code between 100 and 200',
          value: 'response.to.be.info;',
        },
        {
          id: 'notFound',
          name: 'status code should be 404',
          value: 'response.to.be.notFound;',
        },
        {
          id: 'ok',
          name: 'status code should be 200',
          value: 'response.to.be.ok;',
        },
        {
          id: 'rateLimited',
          name: 'status code should be 429',
          value: 'response.to.be.rateLimited;',
        },
        {
          id: 'redirection',
          name: 'status code should between 299 and 400',
          value: 'response.to.be.redirection;',
        },
        {
          id: 'serverError',
          name: 'status code should between 499 and 600',
          value: 'response.to.be.serverError;',
        },
        {
          id: 'success',
          name: 'status code should between 199 and 300',
          value: 'response.to.be.success;',
        },
        {
          id: 'unauthorized',
          name: 'status code should be 401',
          value: 'response.to.be.unauthorized;',
        },
        {
          id: 'body',
          name: 'response should have body',
          value: 'response.to.have.body();',
        },
        {
          id: 'header',
          name: 'response should have header',
          value: 'response.to.have.header("headerName");',
        },
        {
          id: 'jsonBody',
          name: 'response should have json body',
          value: 'response.to.have.jsonBody();',
        },
        {
          id: 'jsonSchema',
          name: 'response should match json schema',
          value: 'response.to.have.jsonSchema("schema");',
        },
        {
          id: 'statusCode',
          name: 'response should have status code',
          value: 'response.to.have.statusCode();',
        },
      ],
    },
  ],
};
