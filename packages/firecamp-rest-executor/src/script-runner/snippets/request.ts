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
          value: 'request.url',
        },
        {
          id: 'method',
          name: 'method',
          value: 'request.method',
        },
        {
          id: 'body',
          name: 'body',
          value: 'request.body',
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
          value: 'request.addHeader("headerName", "headerValue");',
        },
        {
          id: 'updateHeader',
          name: 'update header',
          value: 'request.updateHeader("headerName", "headerValue");',
        },
        {
          id: 'getHeader',
          name: 'get header',
          value: 'request.getHeader("header_name");',
        },
        {
          id: 'getHeaders',
          name: 'get headers object',
          value: 'request.getHeaders();',
        },
        {
          id: 'getHeadersList',
          name: 'get headers list',
          value: 'request.headers;',
        },
        {
          id: 'removeHeader',
          name: 'remove header',
          value:
            'request.removeHeader("headerName1", "headerName2",...,"headerName-n");',
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
          value: 'request.addQuery("queryName", "queryValue");',
        },
        {
          id: 'updateQuery',
          name: 'update query',
          value: 'request.updateQuery("queryName", "queryValue");',
        },
        {
          id: 'getQuery',
          name: 'get query',
          value: 'request.getQuery("queryName");',
        },
        {
          id: 'getQueries',
          name: 'get queries object',
          value: 'request.getQueries();',
        },
        {
          id: 'removeQuery',
          name: 'remove query',
          value:
            'request.removeQuery("queryName1", "queryName2",...,"queryName-n");',
        },
      ],
    },
  ],
};
