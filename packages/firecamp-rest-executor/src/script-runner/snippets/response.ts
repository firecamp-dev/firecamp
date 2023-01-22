export default {
  id: 'responseSnippets',
  name: 'Response Snippets',
  groups: [
    {
      id: 'common',
      name: 'Common',
      snippets: [
        {
          id: 'data',
          name: 'data',
          value: ['fc.response.data;'],
        },
        {
          id: 'duration',
          name: 'duration',
          value: ['fc.response.duration;'],
        },
        {
          id: 'size',
          name: 'size',
          value: ['fc.response.size;]',
        },
        {
          id: 'statusCode',
          name: 'status code',
          value: ['fc.response.statusCode;'],
        },
        {
          id: 'statusMessage',
          name: 'status message',
          value: ['fc.response.statusMessage;'],
        },
        {
          id: 'headers',
          name: 'headers',
          value: ['fc.response.headers;'],
        },
        {
          id: 'headersList',
          name: 'headers list',
          value: ['fc.response.headersList;'],
        },
        {
          id: 'bodyInText',
          name: 'get response body as a text',
          value: ['fc.response.text();'],
        },
        {
          id: 'bodyInJson',
          name: 'get response body as a json',
          value: ['fc.response.json();'],
        },
      ],
    },
  ],
};
