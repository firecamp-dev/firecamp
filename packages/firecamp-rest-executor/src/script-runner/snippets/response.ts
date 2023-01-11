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
          value: 'response.data;',
        },
        {
          id: 'duration',
          name: 'duration',
          value: 'response.duration;',
        },
        {
          id: 'size',
          name: 'size',
          value: 'response.size;',
        },
        {
          id: 'statusCode',
          name: 'status code',
          value: 'response.statusCode;',
        },
        {
          id: 'statusMessage',
          name: 'status message',
          value: 'response.statusMessage;',
        },
        {
          id: 'headers',
          name: 'headers',
          value: 'response.headers;',
        },
        {
          id: 'headersList',
          name: 'headers list',
          value: 'response.headersList;',
        },
        {
          id: 'bodyInText',
          name: 'get response body as a text',
          value: 'response.text();',
        },
        {
          id: 'bodyInJson',
          name: 'get response body as a json',
          value: 'response.json();',
        },
      ],
    },
  ],
};
