import { ERestBodyTypes, IRestConfig } from '@firecamp/types';

// body type and name mapping
export const bodyTypeNames = {
  [ERestBodyTypes.FormData]: 'Multipart',
  [ERestBodyTypes.UrlEncoded]: 'Form URL Encode',
  [ERestBodyTypes.GraphQL]: 'GraphQL Queries',
  [ERestBodyTypes.Json]: 'Json',
  [ERestBodyTypes.Xml]: 'Xml',
  [ERestBodyTypes.Text]: 'Text',
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
      {
        name: bodyTypeNames[ERestBodyTypes.Xml],
        id: ERestBodyTypes.Xml,
      },
      {
        name: bodyTypeNames[ERestBodyTypes.Text],
        id: ERestBodyTypes.Text,
      },
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
        name: 'No Body',
        id: '',
        isEmpty: true,
      },
    ],
  },
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
  [ERestBodyTypes.Xml]: {
    value: '',
  },
  [ERestBodyTypes.Text]: {
    value: '',
  },
  [ERestBodyTypes.Binary]: {
    value: '',
  },
};

// empty config state
export const configState: IRestConfig = {
  followLocation: true,
  maxRedirects: 21,
  rejectUnauthorized: false,
  requestTimeout: 0,
};
