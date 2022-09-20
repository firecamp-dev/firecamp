export default {
  id: 'response snippets',
  name: 'response snippets',
  snippets: [
    {
      id: 'common',
      name: 'Common',
      snippets: [
        {
          id: 'data',
          name: 'data',
          snippet: 'response.data;',
        },
        {
          id: 'duration',
          name: 'duration',
          snippet: 'response.duration;',
        },
        {
          id: 'size',
          name: 'size',
          snippet: 'response.size;',
        },
        {
          id: 'status_code',
          name: 'status code',
          snippet: 'response.statusCode;',
        },
        {
          id: 'status_message',
          name: 'status message',
          snippet: 'response.statusMessage;',
        },
        {
          id: 'headers',
          name: 'headers',
          snippet: 'response.headers;',
        },
        {
          id: 'headers_list',
          name: 'headers list',
          snippet: 'response.headersList;',
        },
        {
          id: 'body_in_text',
          name: 'get body as a text',
          snippet: 'response.text();',
        },
        {
          id: 'body_in_json',
          name: 'get body as a json',
          snippet: 'response.json();',
        },
      ],
    },
  ],
};
