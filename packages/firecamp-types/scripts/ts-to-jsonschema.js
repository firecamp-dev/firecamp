const tsj = require('ts-json-schema-generator');
const fs = require('fs');

const KeysToMap = {
  OAuth2Code: 'oauth2Code',
  OAuth2Implicit: 'oauth2Implicit',
  OAuth2Password: 'oauth2Password',
  OAuth2ClientCredentials: 'oauth2ClientCredentials',
  Collection: 'collection',
  IAuth: 'auth',
  IAuthAwsV4: 'authAwsV4',
  IAuthBasic: 'authBasic',
  IAuthBearer: 'authBearer',
  IAuthDigest: 'authDigest',
  IOAuth1: 'oauth1',
  IOAuth2: 'oauth2',
  IResponse: 'response',
  EOAuth2Types: 'oauth2Types',
  IRestScripts: 'restScripts',
  EAuthTypes: 'authTypes',
  Auth: 'auth',
  Folder: 'folder',
  Header: 'header',
  Rest: 'rest',
  WebSocket: 'websocket',
  SocketIO: 'socketIO',
  GraphQL: 'graphql',
  EHttpMethod: 'method',
  IRestConfig: 'restConfig',
  EHttpVersion: 'httpVersion',
  IRestBody: 'restBody',
  ERestBodyTypes: 'restBodyTypes',
  QueryParam: 'queryParam',
  PathParam: 'pathParam',
  KeyValueTable: 'keyValueTable',
  Example: 'example',
  EResponseBodyTypes: 'responseBodyTypes',
  CollectionVersions: 'collectionVersions',
  EKeyValueTableRowType: 'keyValueTableRowType',
  EOAuth1Signature: 'oauth1Signature',
  Url: 'url',
  IWebSocketConfig: 'wsConfig',
  RequestFolder: 'requestFolder',
  RequestItem: 'requestItem',
  WebSocketMessage: 'wsMessage',
  SocketIOEmitter: 'socketIOEmitter',
  ESocketIOClientVersion: 'socketIOClientVersion',
  ISocketIOConfig: 'socketIOConfig',
  SocketIOConnection: 'socketIoConnection',
  WebSocketConnection: 'wsConnection',
  EMessageBodyType: 'messageBodyType',
  ETypedArrayView: 'typedArrayView',
  IArgument: 'emitterArgument',
  EArgumentBodyType: 'emitterArgumentBodyType',
  GraphQLPlayground: 'graphQLPlayground',
  EGraphQLOperationType: 'graphQLOperationType',
  TGraphQLBody: 'graphQLBody',
  TJsonBody: 'jsonBody',
  TXmlBody: 'xmlBody',
  TTextBody: 'textBody',
  TBinaryBody: 'binaryBody',
  TFormDataBody: 'formDataBody',
  TUrlEncodedBody: 'urlEncodedBody',
  EmitterCollection: 'emitterCollection',
  MessageCollection: 'messageCollection',
  PlaygroundCollection: 'playgroundCollection',
  GraphQLDirectory: 'graphQLDirectory',
  WebSocketDirectory: 'websocketDirectory',
  SocketIODirectory: 'socketIODirectory',
  Request: 'request',
  Environment: 'environment',
  File: 'file',
  EFileDataType: 'fileDataType',
  TId: 'id',
  ERequestTypes: 'requestTypes',
};

// config to generate json schema
const configs = [
  {
    path: 'src/collection-export/collection.ts',
    tsconfig: 'tsconfig.json',
    type: 'Collection', // Or <type-name> if you want to generate schema for that one type only
    outputPath: 'src/collection-export/schemas/collection.json',
  },
  {
    path: 'src/collection-export/requests/file.ts',
    tsconfig: 'tsconfig.json',
    type: 'File',
    outputPath: 'src/collection-export/schemas/file.json',
  },
  {
    path: 'src/collection-export/requests/graphql.ts',
    tsconfig: 'tsconfig.json',
    type: 'GraphQL',
    outputPath: 'src/collection-export/schemas/graphql.json',
  },
  {
    path: 'src/collection-export/requests/rest.ts',
    tsconfig: 'tsconfig.json',
    type: 'Rest',
    outputPath: 'src/collection-export/schemas/rest.json',
  },
  {
    path: 'src/collection-export/requests/socketio.ts',
    tsconfig: 'tsconfig.json',
    type: 'SocketIO',
    outputPath: 'src/collection-export/schemas/socketio.json',
  },
  {
    path: 'src/collection-export/requests/websocket.ts',
    tsconfig: 'tsconfig.json',
    type: 'WebSocket',
    outputPath: 'src/collection-export/schemas/websocket.json',
  },
];

const replaceSchemaKeys = (object) => {
  if (typeof object !== 'object') return object;

  for (const key in object) {
    // Replace '$ref' definition with keys to map
    if (key === '$ref') {
      Object.keys(KeysToMap).forEach((_key) => {
        if (
          typeof object[key] === 'string' &&
          object[key].includes(_key) &&
          object[key].length === `#/definitions/${_key}`.length
        ) {
          object[key] = object[key].replace(_key, KeysToMap[_key]);
        }
      });

      continue;
    }

    /**
     * add current key value with mapped key
     * remove current key
     */
    if (KeysToMap[key]) {
      object[KeysToMap[key]] = object[key];

      delete object[key];

      if (typeof object[KeysToMap[key]] === 'object')
        replaceSchemaKeys(object[KeysToMap[key]]);
    } else if (typeof object[key] === 'object') replaceSchemaKeys(object[key]);
    /**
     * iterate key if object to map nested keys
     */
  }

  return object;
};

configs.forEach((config) => {
  /**
   * schema generate logic
   */
  const schema = tsj.createGenerator(config).createSchema(config.type);

  const schemaString = JSON.stringify(replaceSchemaKeys(schema), null, 4);

  fs.writeFile(config.outputPath, schemaString, (err) => {
    if (err) throw err;
  });
});
