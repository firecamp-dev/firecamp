import { EAuthTypes } from '@firecamp/types';

const authUiFormState = {
  [EAuthTypes.Basic]: {
    inputList: [
      {
        id: 'username',
        name: 'Username',
      },
      {
        id: 'password',
        name: 'Password',
      },
    ],
  },
  [EAuthTypes.Bearer]: {
    inputList: [
      {
        id: 'token',
        name: 'Token',
      },
      {
        id: 'prefix',
        name: 'Prefix',
      },
    ],
  },
  [EAuthTypes.Digest]: {
    inputList: [
      {
        id: 'username',
        name: 'Username',
      },
      {
        id: 'password',
        name: 'Password',
      },
    ],
    advancedInputList: [
      {
        id: 'realm',
        name: 'Realm',
      },
      {
        id: 'nonce',
        name: 'Nonce',
      },
      {
        id: 'qop',
        name: 'Qop',
      },
      {
        id: 'nonceCount',
        name: 'Nonce count',
      },
      {
        id: 'clientNonce',
        name: 'Client nonce',
      },
      {
        id: 'opaque',
        name: 'Opaque',
      },
    ],
    algorithmList: ['MD5', 'MD5-sess'],
  },
  [EAuthTypes.OAuth1]: {
    inputList: [
      {
        id: 'consumerKey',
        name: 'Consumer Key',
      },
      {
        id: 'consumerSecret',
        name: 'Consumer Secret',
      },
      {
        id: 'tokenKey',
        name: 'Token Key',
      },
      {
        id: 'tokenSecret',
        name: 'Token Secret',
      },
    ],
    advancedInputList: [
      {
        id: 'version',
        name: 'Version',
      },
      {
        id: 'callbackUrl',
        name: 'Callback Url',
      },
      {
        id: 'verifier',
        name: 'Verifier',
      },
      {
        id: 'timestamp',
        name: 'Timestamp',
      },
      {
        id: 'nonce',
        name: 'Nonce',
      },
      {
        id: 'realm',
        name: 'Realm',
      },
    ],
    signatureMethodList: [
      'HMAC-SHA1',
      'HMAC-SHA256', //TODO: in future plan
      /*"RSA-SHA1",*/ 'PLAINTEXT',
    ],
  },
  [EAuthTypes.OAuth2]: {
    grantTypes: [
      {
        id: 'code',
        name: 'Code',
      },
      {
        id: 'password',
        name: 'Password',
      },
      {
        id: 'implicit',
        name: 'Implicit',
      },
      {
        id: 'clientCredentials',
        name: 'Client Credentials',
      },
    ],
    grantTypesPayload: {
      code: {
        inputList: [
          {
            id: 'callback',
            name: 'Callback',
          },
          {
            id: 'authUrl',
            name: 'Auth Url',
          },
          {
            id: 'accessTokenUrl',
            name: 'Access Token Url',
          },
          {
            id: 'clientId',
            name: 'Client ID',
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
          },
        ],
        advancedInputList: [
          {
            id: 'scope',
            name: 'Scope',
          },
          {
            id: 'state',
            name: 'State',
          },
        ],
      },
      implicit: {
        inputList: [
          {
            id: 'callback',
            name: 'Callback',
          },
          {
            id: 'authUrl',
            name: 'Auth Url',
          },
          {
            id: 'clientId',
            name: 'Client ID',
          },
        ],
        advancedInputList: [
          {
            id: 'scope',
            name: 'Scope',
          },
          {
            id: 'state',
            name: 'State',
          },
        ],
      },
      password: {
        inputList: [
          {
            id: 'accessTokenUrl',
            name: 'Access Token Url',
          },
          {
            id: 'username',
            name: 'Username',
          },
          {
            id: 'password',
            name: 'Password',
          },
          {
            id: 'clientId',
            name: 'Client ID',
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
          },
        ],
        advancedInputList: [
          {
            id: 'scope',
            name: 'Scope',
          },
        ],
      },
      clientCredentials: {
        inputList: [
          {
            id: 'accessTokenUrl',
            name: 'Access Token Url',
          },
          {
            id: 'clientId',
            name: 'Client ID',
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
          },
        ],
        advancedInputList: [
          {
            id: 'scope',
            name: 'Scope',
          },
        ],
      },
    },
  },
  [EAuthTypes.Hawk]: {
    inputList: [
      {
        id: 'id',
        name: 'Id',
      },
      {
        id: 'key',
        name: 'Key',
      },
    ],
    advancedInputList: [
      {
        id: 'user',
        name: 'User',
      },
      {
        id: 'nonce',
        name: 'Nonce',
      },
      {
        id: 'extraData',
        name: 'Extra Data',
      },
      {
        id: 'appId',
        name: 'App Id',
      },
      {
        id: 'delegation',
        name: 'Delegation',
      },
      {
        id: 'timestamp',
        name: 'Timestamp',
      },
    ],
    algorithmList: ['SHA256', 'SHA1'],
  },
  [EAuthTypes.AwsV4]: {
    inputList: [
      {
        id: 'accessKey',
        name: 'Access Key',
      },
      {
        id: 'secretKey',
        name: 'Secret Key',
      },
    ],
    advancedInputList: [
      {
        id: 'region',
        name: 'Region',
      },
      {
        id: 'service',
        name: 'Service',
      },
      {
        id: 'sessionToken',
        name: 'Session Token',
      },
    ],
  },
  [EAuthTypes.Ntlm]: {
    inputList: [
      {
        id: 'username',
        name: 'Username',
      },
      {
        id: 'Password',
        name: 'Password',
      },
    ],
    advancedInputList: [
      {
        id: 'domain',
        name: 'Domain',
      },
      {
        id: 'workstation',
        name: 'Workstation',
      },
    ],
  },
};

const authTypeList = [
  { name: 'None', id: EAuthTypes.None, enable: true },
  { name: 'Inherit', id: EAuthTypes.Inherit, enable: true },
  { name: 'Bearer', id: EAuthTypes.Bearer, enable: true },
  { name: 'Basic', id: EAuthTypes.Basic, enable: true },
  { name: 'Digest', id: EAuthTypes.Digest, enable: true },
  { name: 'OAuth 1', id: EAuthTypes.OAuth1, enable: true },
  // { name: 'OAuth 2', id: EAuthTypes.OAuth2, enable: false },
  // { name: 'Hawk', id: EAuthTypes.Hawk, enable: false },
  { name: 'AWS', id: EAuthTypes.AwsV4, enable: true },
  // { name: 'NTLM', id: EAuthTypes.Ntlm, enable: false },
  // { name: 'Atlassian', id: EAuthTypes.Atlassian, enable: false },
  // { name: 'Netrc', id: EAuthTypes.Nertc, enable: false },
];

export { authUiFormState, authTypeList };
