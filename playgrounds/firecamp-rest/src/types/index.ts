export enum EReqChangeRootKeys {
  method = 'method',
  headers = 'headers',
  config = 'config',
  body = 'body',
  auth = 'auth',
  preScripts = 'preScripts',
  postScripts = 'postScripts',
}

export enum EReqChangeMetaKeys {
  name = 'name',
  description = 'description',
}

export enum EReqChangeUrlKeys {
  raw = 'raw',
  queryParams = 'queryParams',
  pathParams = 'pathParams',
}

export enum ERequestPanelTabs {
  Body = 'Body',
  Auths = 'Auths',
  Headers = 'Headers',
  Params = 'Params',
  PreRequestScript = 'Pre-request Script',
  Tests = 'Tests',
  Config = 'Config',
}

export enum EResponsePanelTabs {
  Body = 'Body',
  Headers = 'Headers',
  Cookies = 'Cookies',
  TestResult = 'TestResult',
}

export enum ERestConfigKeys {
  MaxRedirects = 'maxRedirects',
  FollowLocation = 'followLocation',
  RejectUnauthorized = 'rejectUnauthorized',
  RequestTimeout = 'requestTimeout',
}
