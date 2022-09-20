import { ERestBodyTypes, IRestConfig } from '@firecamp/types';

// body type and name mapping
export const bodyTypeNames = {
  [ERestBodyTypes.NoBody]: 'No Body',
  [ERestBodyTypes.FormData]: 'Multipart',
  [ERestBodyTypes.UrlEncoded]: 'Form URL Encode',
  [ERestBodyTypes.GraphQL]: 'GraphQL Queries',
  [ERestBodyTypes.Json]: 'JSON',
  [ERestBodyTypes.Xml]: 'XML',
  [ERestBodyTypes.Text]: 'TEXT',
  [ERestBodyTypes.Binary]: 'Binary',
};

// dropdown values for body types
export const bodyTypesDDValues = {
  formAndQuery: {
    header: 'Form and query',
    list: [
      {
        name: bodyTypeNames[ERestBodyTypes.FormData],
        id: ERestBodyTypes.FormData,
      },
      {
        name: bodyTypeNames[ERestBodyTypes.UrlEncoded],
        id: ERestBodyTypes.UrlEncoded,
      },
      {
        name: bodyTypeNames[ERestBodyTypes.GraphQL],
        id: ERestBodyTypes.GraphQL,
      },
    ],
  },
  raw: {
    header: 'Raw',
    list: [
      {
        name: bodyTypeNames[ERestBodyTypes.Json],
        id: ERestBodyTypes.Json,
      },
      // {name: 'Javascript', id: 'application/javascript'},
      {
        name: bodyTypeNames[ERestBodyTypes.Xml],
        id: ERestBodyTypes.Xml,
      },
      //{name: 'XML/text', id: 'text/xml'},
      //{name: 'HTML', id: 'text/html'},
      {
        name: bodyTypeNames[ERestBodyTypes.Text],
        id: ERestBodyTypes.Text,
      },
      //{name: 'text/plain', id: 'text/plain'}
    ],
  },
  other: {
    header: 'Others',
    list: [
      {
        name: bodyTypeNames[ERestBodyTypes.Binary],
        id: ERestBodyTypes.Binary,
      },
      {
        name: bodyTypeNames[ERestBodyTypes.NoBody],
        id: ERestBodyTypes.NoBody,
        isEmpty: true,
      },
    ],
  } /* ,
  empty: {
    header: "Empty",
    list: [
      {
        name: "No Body",
        id: ERestBodyTypes.NoBody,
        isEmpty: true
      }
    ]
  } */,
};

// empty body state
export const bodyState = {
  [ERestBodyTypes.FormData]: {
    value: [],
  },
  [ERestBodyTypes.UrlEncoded]: {
    value: [],
  },
  [ERestBodyTypes.GraphQL]: {
    value: '',
    variables: '',
  },
  [ERestBodyTypes.Json]: {
    value: '',
  },
  /* "application/javascript": {
   value: ""
   },*/
  [ERestBodyTypes.Xml]: {
    value: '',
  },
  /* "text/xml": {
   value: ""
   },
   "text/html": {
   value: ""
   },*/
  [ERestBodyTypes.Text]: {
    value: '',
  },
  /* "text/plain": {
   value: ""
   },*/
  [ERestBodyTypes.Binary]: {
    value: '',
  },
  [ERestBodyTypes.NoBody]: null,
};

// empty config state
export const configState: IRestConfig = {
  follow_location: true,
  max_redirects: 21,
  reject_unauthorized: false,
  request_timeout: 0,
};

// headers mapping by body types
export const headersByBodyType = {
  [ERestBodyTypes.FormData]: ERestBodyTypes.FormData,
  [ERestBodyTypes.UrlEncoded]: ERestBodyTypes.UrlEncoded,
  [ERestBodyTypes.GraphQL]: ERestBodyTypes.GraphQL,
  [ERestBodyTypes.Json]: ERestBodyTypes.Json,
  // "application/javascript": "application/javascript",
  [ERestBodyTypes.Xml]: ERestBodyTypes.Xml,
  // "text/xml": "text/xml",
  // "text/html": "text/html",
  [ERestBodyTypes.Text]: 'text/plain',
  // "text/plain": "text/plain",
  [ERestBodyTypes.Binary]: 'text/plain',
  protocol_buffer: 'application/octet-stream',
};
