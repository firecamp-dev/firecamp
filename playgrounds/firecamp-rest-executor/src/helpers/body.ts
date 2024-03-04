import FormData from 'form-data';
import fs from 'fs';
import qs from 'qs';
import { isNode } from 'browser-or-node';
import { _array, _misc, _string, _table } from '@firecamp/utils';
import {
  ERestBodyTypes,
  EKeyValueTableRowType,
  IKeyValueTable,
  IRestBody,
  TGraphQLBody,
} from '@firecamp/types';

export default async (body: IRestBody): Promise<any> => {
  const { value, type } = body;
  if (!value) return;

  switch (type) {
    case ERestBodyTypes.None:
      return;
    case ERestBodyTypes.Binary:
      return value;
    case ERestBodyTypes.Json:
      return value;
    case ERestBodyTypes.Text:
      return value;
    case ERestBodyTypes.Xml:
      return value;

    // prepare form data
    case ERestBodyTypes.FormData:
      if (_array.isEmpty(value as any[])) return {};

      const form: FormData = new FormData();
      // append entries into form
      (value as any[]).forEach((row: IKeyValueTable) => {
        if (row?.type === EKeyValueTableRowType.File) {
          if (isNode) {
            //@ts-ignore
            const f = fs.createReadStream(row.file.path);
            form.append(row.key, f);
          } else {
            //@ts-ignore
            form.append(row.key, row.file);
          }
        } else {
          form.append(row.key, row.value);
        }
      });
      return form;

    // encode data using the qs library
    case ERestBodyTypes.UrlEncoded:
      return qs.stringify(_table.toObject(value as any[]));

    case ERestBodyTypes.GraphQL:
      const { query = '', variables = {} } = value as TGraphQLBody;
      return JSON.stringify({
        query: query,
        variables: variables,
      });

    default:
      return;
  }
};
