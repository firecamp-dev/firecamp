// @ts-nocheck

import { nanoid as id } from 'nanoid';

import { METHODS, AUTH_TYPES, QUERY_TYPES } from './constants';

const STATE_PAYLOADS = {
  snippentData: {
    languages: [
      {
        id: 'c',
        name: 'C (LibCurl)',
      },
      {
        id: 'go',
        name: 'Go',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        clients: {
          jquery: { name: 'jQuery.ajax' },
          XMLHttpRequest: { name: 'XMLHttpRequest' },
        },
      },
      {
        id: 'java',
        name: 'Java',
        clients: {
          unirest: { name: 'Unirest' },
          okhttp: { name: 'OkHttp' },
        },
      },
      {
        id: 'node',
        name: 'NodeJs',
        clients: {
          native: { name: 'Native' },
          request: { name: 'Request' },
          unirest: { name: 'Unirest' },
        },
      },
      {
        id: 'objc',
        name: 'Objective-C',
      },
      {
        id: 'python',
        name: 'Python',
        clients: {
          python3: { name: 'Python 3' },
          requests: { name: 'Requests' },
        },
      },
      {
        id: 'ruby',
        name: 'Ruby',
      },
      {
        id: 'shell',
        name: 'Shell',
        clients: {
          curl: { name: 'cURL' },
          httpie: { name: 'HTTPie' },
          wget: { name: 'wget' },
        },
      },
      {
        id: 'swift',
        name: 'Swift',
      },
    ],
  },
  config: {
    methods: ['GET', 'POST'],
  },
  authTypes: {
    typeList: [{ name: 'No Auth', id: 'noAuth', enable: true }],
  },
  graphql_body: {
    queryTypeList: ['Query', 'Mutation', 'Subscription'],
    url: 'https://api.spacex.land/graphql',
    headers: [
      {
        key: 'Accept',
        value: 'application/json',
        disable: false,
        type: 'text',
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        disable: false,
        type: 'text',
      },
    ],
  },
};

const DEFAULT_QUERY = {
  _meta: { id: '' },
  name: '',
  body: '',
  meta: {
    type: '',
    variables: [],
  },
};

const NEW_QUERIES = {
  [QUERY_TYPES.QUERY]: {
    name: 'Query',
    body: `
  query Query{
  __typename 
  
  }
  `,
    meta: { type: QUERY_TYPES.QUERY },
  },
  [QUERY_TYPES.MUTATION]: {
    name: 'Mutation',
    body: `
  mutation Mutation{ 
  __typename
  
  }`,
    meta: { type: QUERY_TYPES.MUTATION },
  },
  [QUERY_TYPES.SUBSCRIPTION]: {
    name: 'Subscription',
    body: `
  subscription Subscription{ 
  __typename

  }`,
    meta: { type: QUERY_TYPES.SUBSCRIPTION },
  },
};

export { STATE_PAYLOADS, DEFAULT_QUERY, NEW_QUERIES };
