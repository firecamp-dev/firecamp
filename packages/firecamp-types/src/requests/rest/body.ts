import { IKeyValueTable } from '../../common';

export enum ERestBodyTypes {
  None = 'none',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  GraphQL = 'application/graphql',
  Json = 'application/json',
  Xml = 'application/xml',
  Text = 'text',
  Binary = 'binary',
}

export type TFormDataBody = IKeyValueTable[];
export type TUrlEncodedBody = IKeyValueTable[];

export interface TGraphQLBody {
  // value: string,
  query: string;
  variables?: string;
}

export type TJsonBody = string;

export type TXmlBody = string;

export type TTextBody = string;

export type TBinaryBody = Promise<File> | string | ArrayBuffer;

/**
 * rest request body
 */
export interface IRestBody {
  value:
    | TFormDataBody
    | TUrlEncodedBody
    | TGraphQLBody
    | TJsonBody
    | TXmlBody
    | TTextBody
    | TBinaryBody;
  type: ERestBodyTypes;
}
