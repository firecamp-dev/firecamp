export enum ESnippetTargets {
  C = 'c',
  Clojure = 'clojure',
  Csharp = 'csharp',
  Go = 'go',
  Http = 'http',
  Java = 'java',
  Javascript = 'javascript',
  Kotlin = 'kotlin',
  Node = 'node',
  Objc = 'objc',
  Ocaml = 'ocaml',
  Php = 'php',
  Powershell = 'powershell',
  Python = 'python',
  R = 'r',
  Ruby = 'ruby',
  Shell = 'shell',
  Swift = 'swift',
}

export enum ECClients {
  Libcurl = 'libcurl',
}

export enum EClojureClients {
  Clj_http = 'clj_http',
}

export enum ECsharpClients {
  Httpclient = 'httpclient',
  Restsharp = 'restsharp',
}

export enum EGoClients {
  Native = 'native',
}

export enum EHttpClients {
  'Http1.1' = 'http1.1',
}

export enum EJavaClients {
  Asynchttp = 'asynchttp',
  Nethttp = 'nethttp',
  Okhttp = 'okhttp',
  Unirest = 'unirest',
}

export enum EJavascriptClients {
  Xhr = 'xhr',
  Axios = 'axios',
  Fetch = 'fetch',
  Jquery = 'jquery',
}

export enum EKotlinClients {
  Okhttp = 'okhttp',
}

export enum ENodeClients {
  Native = 'native',
  Request = 'request',
  Unirest = 'unirest',
  Axios = 'axios',
  Fetch = 'fetch',
}

export enum EObjcClients {
  Nsurlsession = 'nsurlsession',
}

export enum EOcamlClients {
  Cohttp = 'cohttp',
}

export enum EPhpClients {
  Curl = 'curl',
  Guzzle = 'guzzle',
  Http1 = 'http1',
  Http2 = 'http2',
}

export enum EPowershellClients {
  Webrequest = 'webrequest',
  Restmethod = 'restmethod',
}

export enum EPythonClients {
  Python3 = 'python3',
  Requests = 'requests',
}

export enum ERClients {
  Httr = 'httr',
}

export enum ERuby {
  Native = 'native',
}

export enum EShellClients {
  Curl = 'curl',
  Httpie = 'httpie',
  Wget = 'wget',
}

export enum ESwiftClients {
  Nsurlsession = 'nsurlsession',
}

export type TTargetClients =
  | ECClients
  | EClojureClients
  | ECsharpClients
  | EGoClients
  | EHttpClients
  | EJavaClients
  | EJavascriptClients
  | EKotlinClients
  | ENodeClients
  | EObjcClients
  | EOcamlClients
  | EPhpClients
  | EPowershellClients
  | EPythonClients
  | ERClients
  | ERuby
  | EShellClients
  | ESwiftClients;
