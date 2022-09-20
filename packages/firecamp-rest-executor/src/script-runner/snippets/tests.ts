export default {
  id: 'tests',
  name: 'tests',
  snippets: [
    {
      id: 'request_tests',
      name: 'request tests',
      snippets: [
        {
          id: 'url',
          name: 'should have request URL same',
          snippet: 'request.to.have.url(urlObject);',
        },
        {
          id: 'method',
          name: 'should have request method same',
          snippet: 'request.to.have.method("methodName");',
        },
        {
          id: 'query',
          name: 'should have query',
          snippet: 'request.to.have.query("queryName");',
        },
        {
          id: 'header',
          name: 'should have header',
          snippet: 'request.to.have.header("headerName");',
        },
        {
          id: 'body',
          name: 'should have body set',
          snippet: 'request.to.have.body();',
        },
        {
          id: 'body',
          name: 'should have body of content type',
          snippet: 'request.to.have.body("contentType");',
        },
      ],
    },
    {
      id: 'response_tests',
      name: 'response tests',
      snippets: [
        {
          id: 'accepted',
          name: 'status code must be 202',
          snippet: 'response.to.be.accepted;',
        },
        {
          id: 'badRequest',
          name: 'status code must be 400',
          snippet: 'response.to.be.badRequest;',
        },
        {
          id: 'clientError',
          name: 'checks stats code between 400 and 500',
          snippet: 'response.to.be.clientError;',
        },
        {
          id: 'forbidden',
          name: 'status code should be 403',
          snippet: 'response.to.be.forbidden;',
        },
        {
          id: 'info',
          name: 'checks status code between 100 and 200',
          snippet: 'response.to.be.info;',
        },
        {
          id: 'notFound',
          name: 'status code should be 404',
          snippet: 'response.to.be.notFound;',
        },
        {
          id: 'ok',
          name: 'status code should be 200',
          snippet: 'response.to.be.ok;',
        },
        {
          id: 'rateLimited',
          name: 'status code should be 429',
          snippet: 'response.to.be.rateLimited;',
        },
        {
          id: 'redirection',
          name: 'status code should between 299 and 400',
          snippet: 'response.to.be.redirection;',
        },
        {
          id: 'serverError',
          name: 'status code should between 499 and 600',
          snippet: 'response.to.be.serverError;',
        },
        {
          id: 'success',
          name: 'status code should between 199 and 300',
          snippet: 'response.to.be.success;',
        },
        {
          id: 'unauthorized',
          name: 'status code should be 401',
          snippet: 'response.to.be.unauthorized;',
        },
        {
          id: 'body',
          name: 'response should have body',
          snippet: 'response.to.have.body();',
        },
        {
          id: 'header',
          name: 'response should have header',
          snippet: 'response.to.have.header("headerName");',
        },
        {
          id: 'json_body',
          name: 'response should have json body',
          snippet: 'response.to.have.jsonBody();',
        },
        {
          id: 'json_schema',
          name: 'response should match json schema',
          snippet: 'response.to.have.jsonSchema("schema");',
        },
        {
          id: 'status_code',
          name: 'response should have status code',
          snippet: 'response.to.have.statusCode();',
        },
      ],
    },
  ],
};
