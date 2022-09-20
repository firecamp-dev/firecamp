export default {
    id: 'request_snippets',
    name: 'Request Snippets',
    snippets: [
        {
            id: 'common',
            name: 'Common',
            snippets: [
                {
                    id: 'url',
                    name: 'url',
                    snippet: 'request.url'
                },
                {
                    id: 'method',
                    name: 'method',
                    snippet: 'request.method'
                },
                {
                    id: 'body',
                    name: 'body',
                    snippet: 'request.body'
                }
            ]
        },
        {
            id: "header",
            name: "Header",
            snippets: [
                {
                    id: 'add_header',
                    name: 'add header',
                    snippet: 'request.addHeader("headerName", "headerValue");'
                },
                {
                    id: 'update_header',
                    name: 'update header',
                    snippet: 'request.updateHeader("headerName", "headerValue");'
                },
                {
                    id: 'get_header',
                    name: 'get header',
                    snippet: 'request.getHeader("header_name");'
                },
                {
                    id: 'get_headers',
                    name: 'get headers object',
                    snippet: 'request.getHeaders();'
                },
                {
                    id: 'get_headers_list',
                    name: 'get headers list',
                    snippet: 'request.headers;'
                },
                {
                    id: 'remove_header',
                    name: 'remove header',
                    snippet: 'request.removeHeader("headerName1", "headerName2",...,"headerName-n");'
                }
            ]
        },
        {
            id: "query",
            name: "Query",
            snippets: [
                {
                    id: 'add_query',
                    name: 'add query',
                    snippet: 'request.addQuery("queryName", "queryValue");'
                },
                {
                    id: 'update_query',
                    name: 'update query',
                    snippet: 'request.updateQuery("queryName", "queryValue");'
                },
                {
                    id: 'get_query',
                    name: 'get query',
                    snippet: 'request.getQuery("queryName");'
                },
                {
                    id: 'get_queries',
                    name: 'get queries object',
                    snippet: 'request.getQueries();'
                },
                {
                    id: 'remove_query',
                    name: 'remove query',
                    snippet: 'request.removeQuery("queryName1", "queryName2",...,"queryName-n");'
                }
            ]
        }
    ]
}