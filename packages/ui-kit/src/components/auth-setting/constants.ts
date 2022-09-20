import { EAuthTypes } from '@firecamp/types';

const typePayload = {
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
        id: 'nonce_count',
        name: 'Nonce count',
      },
      {
        id: 'client_nonce',
        name: 'Client nonce',
      },
      {
        id: 'opaque',
        name: 'Opaque',
      },
    ],
    algorithmList:[ 'MD5', 'MD5-sess']
  },
  [EAuthTypes.OAuth1]: {
    inputList: [
      {
        id: 'consumer_key',
        name: 'Consumer Key',
      },
      {
        id: 'consumer_secret',
        name: 'Consumer Secret',
      },
      {
        id: 'token_key',
        name: 'Token Key',
      },
      {
        id: 'token_secret',
        name: 'Token Secret',
      },
    ],
    advancedInputList: [
      {
        id: 'version',
        name: 'Version',
      },
      {
        id: 'callback_URL',
        name: 'Callback URL',
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
    grant_types: [
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
        id: 'client_credentials',
        name: 'Client Credentials',
      },
    ],
    grant_types_payload: {
      code: {
        inputList: [
          {
            id: 'callback',
            name: 'Callback',
          },
          {
            id: 'auth_url',
            name: 'Auth URL',
          },
          {
            id: 'access_token_url',
            name: 'Access Token URL',
          },
          {
            id: 'client_id',
            name: 'Client ID',
          },
          {
            id: 'client_secret',
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
            id: 'auth_url',
            name: 'Auth URL',
          },
          {
            id: 'client_id',
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
            id: 'access_token_url',
            name: 'Access Token URL',
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
            id: 'client_id',
            name: 'Client ID',
          },
          {
            id: 'client_secret',
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
      client_credentials: {
        inputList: [
          {
            id: 'access_token_url',
            name: 'Access Token URL',
          },
          {
            id: 'client_id',
            name: 'Client ID',
          },
          {
            id: 'client_secret',
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
        id: 'extra_data',
        name: 'Extra Data',
      },
      {
        id: 'app_id',
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
  [EAuthTypes.Aws4]: {
    inputList: [
      {
        id: 'access_key',
        name: 'Access Key',
      },
      {
        id: 'secret_key',
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
        id: 'session_token',
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

const typeList = [
  { name: 'Inherit', id: EAuthTypes.Inherit, enable: true },
  { name: 'No Auth', id: EAuthTypes.NoAuth, enable: true },
  { name: 'Bearer', id: EAuthTypes.Bearer, enable: true },
  { name: 'Basic', id: EAuthTypes.Basic, enable: true },
  { name: 'Digest', id: EAuthTypes.Digest, enable: true },
  { name: 'OAuth 1', id: EAuthTypes.OAuth1, enable: true },
  { name: 'OAuth 2', id: EAuthTypes.OAuth2, enable: true },
  { name: 'Hawk', id: EAuthTypes.Hawk, enable: false }, //TODO: enable: true
  { name: 'AWS', id: EAuthTypes.Aws4, enable: true },
  { name: 'NTLM', id: EAuthTypes.Ntlm, enable: true },
  { name: 'Atlassian', id: EAuthTypes.Atlassian, enable: false },
  { name: 'Netrc', id: EAuthTypes.Nertc, enable: false },
];

export { typePayload, typeList };
