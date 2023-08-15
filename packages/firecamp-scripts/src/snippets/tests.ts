export default {
  id: 'tests',
  name: 'TestCases Snippets',
  groups: [
    // {
    //   id: 'requestTests',
    //   name: 'request tests',
    //   snippets: [
    //     {
    //       id: 'url',
    //       name: 'should have request URL same',
    //       value: ['request.to.have.url(urlObject);'],
    //     },
    //     {
    //       id: 'method',
    //       name: 'should have request method same',
    //       value: ['request.to.have.method("methodName");'],
    //     },
    //     {
    //       id: 'query',
    //       name: 'should have query',
    //       value: ['request.to.have.query("queryName");'],
    //     },
    //     {
    //       id: 'header',
    //       name: 'should have header',
    //       value: ['request.to.have.header("headerName");'],
    //     },
    //     {
    //       id: 'body',
    //       name: 'should have body set',
    //       value: ['request.to.have.body();'],
    //     },
    //     {
    //       id: 'body',
    //       name: 'should have body of content type',
    //       value: ['request.to.have.body("contentType");'],
    //     },
    //   ],
    // },
    {
      id: 'responseTests',
      name: 'response tests',
      snippets: [
        {
          id: 'test-1',
          name: 'status: Code is 200',
          value: [
            'fc.test("Status code is 200", ()=> {',
            '    fc.response.to.have.status(200);',
            '});',
          ],
        },
        {
          id: 'test-2',
          name: 'status: successful POST request',
          value: [
            'fc.test("Successful POST request", ()=> {',
            '    fc.expect(fc.response.code).to.be.oneOf([201, 202]);',
            '});',
          ],
        },
        {
          id: 'test-3',
          name: 'status: code name has string',
          value: [
            'fc.test("Status code name has string", ()=> {',
            '    fc.response.to.have.status("Created");',
            '});',
          ],
        },
        {
          id: 'test-4',
          name: 'body: Contains string',
          value: [
            'fc.test("Body matches string", ()=> {',
            '    fc.expect(fc.response.text()).to.include("string_you_want_to_search");',
            '});',
          ],
        },
        {
          id: 'test-5',
          name: 'body: JSON value check',
          value: [
            'fc.test("Your test name", ()=> {',
            '    const jsonData = fc.response.json();',
            '    fc.expect(jsonData.value).to.eql(100);',
            '});',
          ],
        },
        {
          id: 'test-6',
          name: 'body: is equal to string',
          value: [
            'fc.test("Body is correct", ()=> {',
            '    fc.response.to.have.body("response_body_string");',
            '});',
          ],
        },
        {
          id: 'test-7',
          name: 'headers: Content-Type header check',
          value: [
            'fc.test("Content-Type is present", ()=> {',
            '    fc.response.to.have.header("Content-Type");',
            '});',
          ],
        },
        {
          id: 'test-8',
          name: 'time: less than 200ms',
          value: [
            'fc.test("Response time is less than 200ms", ()=> {',
            '    fc.expect(fc.response.responseTime).to.be.below(200);',
            '});',
          ],
        },
        // {
        //   id: 'test-9',
        //   name: 'Response body: Convert XML body to JSON Object',
        //   value: ['let jsonObject = xml2Json(responseBody);'],
        // },
        // {
        //   id: 'test-10',
        //   name: 'Use tiny validator for JSON data',
        //   value: [
        //     'let schema = {',
        //     '  "items": {',
        //     '    "type": "boolean"',
        //     '  }',
        //     '};',
        //     '',
        //     'let data1 = [true, false];',
        //     'let data2 = [true, 888];',
        //     '',
        //     "fc.test('Schema is valid', ()=> {",
        //     '  fc.expect(tv4.validate(data1, schema)).to.be.true;',
        //     '  fc.expect(tv4.validate(data2, schema)).to.be.true;',
        //     '});',
        //   ],
        // },
      ],
      _snippets: [
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
          id: 'code',
          name: 'response should have status code',
          value: 'response.to.have.code(200);',
        },
      ],
    },
  ],
};
