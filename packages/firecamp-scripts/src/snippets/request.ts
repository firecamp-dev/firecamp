export default {
  id: 'requestSnippets',
  name: 'Request Snippets',
  groups: [
    {
      id: 'common',
      name: 'Common',
      snippets: [
        {
          id: 'url',
          name: 'url',
          value: ['fc.request.url'],
        },
        {
          id: 'method',
          name: 'method',
          value: ['fc.request.method'],
        },
        {
          id: 'body',
          name: 'body',
          value: ['fc.request.body'],
        },
      ],
    },
    {
      id: 'header',
      name: 'Header',
      snippets: [
        {
          id: 'addHeader',
          name: 'add header',
          value: ['fc.request.addHeader("headerName", "headerValue");'],
        },
        {
          id: 'updateHeader',
          name: 'update header',
          value: ['fc.request.updateHeader("headerName", "headerValue");'],
        },
        {
          id: 'getHeader',
          name: 'get header',
          value: ['fc.request.getHeader("header_name");'],
        },
        {
          id: 'getHeaders',
          name: 'get headers object',
          value: ['fc.request.getHeaders();'],
        },
        {
          id: 'getHeadersList',
          name: 'get headers list',
          value: ['fc.request.headers;'],
        },
        {
          id: 'removeHeader',
          name: 'remove header',
          value: [
            'fc.request.removeHeader("headerName1", "headerName2",...,"headerName-n");',
          ],
        },
      ],
    },
    {
      id: 'query',
      name: 'Query',
      snippets: [
        {
          id: 'addQuery',
          name: 'add query',
          value: ['fc.request.addQuery("queryName", "queryValue");'],
        },
        {
          id: 'updateQuery',
          name: 'update query',
          value: ['fc.request.updateQuery("queryName", "queryValue");'],
        },
        {
          id: 'getQuery',
          name: 'get query',
          value: ['fc.request.getQuery("queryName");'],
        },
        {
          id: 'getQueries',
          name: 'get queries object',
          value: ['fc.request.getQueries();'],
        },
        {
          id: 'removeQuery',
          name: 'remove query',
          value: [
            'fc.request.removeQuery("queryName1", "queryName2",...,"queryName-n");',
          ],
        },
      ],
    },
  ],
};
