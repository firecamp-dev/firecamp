export default [
  {
    target: 'c',
    clients: ['libcurl'],
  },
  {
    target: 'clojure',
    clients: ['clj_http'],
  },
  {
    target: 'csharp',
    clients: ['httpclient', 'restsharp'],
  },
  {
    target: 'go',
    clients: ['native'],
  },
  {
    target: 'http',
    clients: ['http1.1'],
  },
  {
    target: 'java',
    clients: ['asynchttp', 'nethttp', 'okhttp', 'unirest'],
  },
  {
    target: 'javascript',
    clients: ['xhr', 'axios', 'fetch', 'jquery'],
  },
  {
    target: 'kotlin',
    clients: ['okhttp'],
  },
  {
    target: 'node',
    clients: ['native', 'request', 'unirest', 'axios', 'fetch'],
  },
  {
    target: 'objc',
    clients: ['nsurlsession'],
  },
  {
    target: 'ocaml',
    clients: ['cohttp'],
  },
  {
    target: 'php',
    clients: ['curl', 'guzzle', 'http1', 'http2'],
  },
  {
    target: 'powershell',
    clients: ['webrequest', 'restmethod'],
  },
  {
    target: 'python',
    clients: ['python3', 'requests'],
  },
  {
    target: 'r',
    clients: ['httr'],
  },
  {
    target: 'ruby',
    clients: ['native'],
  },
  {
    target: 'shell',
    clients: ['curl', 'httpie', 'wget'],
  },
  {
    target: 'swift',
    clients: ['nsurlsession'],
  },
];
