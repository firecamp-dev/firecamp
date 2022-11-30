import {
  ERestBodyTypes,
  EHttpMethod,
  EHttpVersion,
  IKeyValueTable,
  IRest,
} from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';
import { Request } from 'har-format';
import _url from '@firecamp/url';

const transformKeyValueTable = (
  keyValueTable: IKeyValueTable[]
): { name: string; value: string; comment: string }[] => {
  if (_array.isEmpty(keyValueTable)) return [];
  else
    return keyValueTable.reduce((result, row) => {
      if ('disable' in row && row.disable === true) {
        return result;
      } else
        result.push({
          name: row?.key || '',
          value: row?.value || '',
          comment: row?.description || '',
        });

      return result;
    }, []);
};

/**
 * transform Firecamp REST request into HAR format request
 */
export default (request: IRest): Request => {
  const harRequest: Request = {
    method: request.method || EHttpMethod.GET,
    url: request.url.raw || 'https://example.com',
    httpVersion: request?.config?.http_version || EHttpVersion.V2Tls,
    cookies: [],
    headers: [],
    queryString: [],
    headersSize: -1,
    bodySize: -1,
  };

  // transform request headers
  harRequest.headers = transformKeyValueTable(
    request.headers as IKeyValueTableWithID[]
  );

  // transform request query params
  harRequest.queryString = transformKeyValueTable(
    request?.url?.queryParams as IKeyValueTableWithID[]
  );

  // transform request body
  if (
    !_object.isEmpty(request.body) &&
    Object.values(ERestBodyTypes).includes(request?.meta?.activeBodyType) &&
    request.__meta.activeBodyType !== ERestBodyTypes.NoBody
  ) {
    switch (request.__meta.activeBodyType) {
      case ERestBodyTypes.FormData:
        harRequest.postData = {
          mimeType: ERestBodyTypes.FormData,
          params: _array.isEmpty(
            request?.body?.[ERestBodyTypes.FormData]?.value
          )
            ? []
            : transformKeyValueTable(
                request?.body?.[ERestBodyTypes.FormData]
                  ?.value as IKeyValueTableWithID[]
              ),
        };

        break;

      case ERestBodyTypes.GraphQL:
        harRequest.postData = {
          mimeType: ERestBodyTypes.Json,
          text: JSON.stringify({
            query: request?.body?.[ERestBodyTypes.GraphQL]?.value,
            variables: request?.body?.[ERestBodyTypes.GraphQL]?.variables || {},
          }),
        };
        harRequest.bodySize = harRequest.postData.text.length;
        break;

      case ERestBodyTypes.Json:
        harRequest.postData = {
          mimeType: ERestBodyTypes.Json,
          text: request?.body?.[ERestBodyTypes.Json]?.value || '',
        };
        harRequest.bodySize = harRequest.postData.text.length;
        break;

      case ERestBodyTypes.Text:
        harRequest.postData = {
          mimeType: 'text/plain',
          text: request?.body?.[ERestBodyTypes.Text]?.value || '',
        };

        harRequest.bodySize = harRequest.postData.text.length;
        break;

      case ERestBodyTypes.UrlEncoded:
        harRequest.postData = {
          mimeType: ERestBodyTypes.FormData,
          params: _array.isEmpty(
            request?.body?.['application/x-www-form-urlencoded']?.value
          )
            ? []
            : transformKeyValueTable(
                request?.body?.[ERestBodyTypes.UrlEncoded]
                  ?.value as IKeyValueTableWithID[]
              ),
        };
        break;

      case ERestBodyTypes.Xml:
        harRequest.postData = {
          mimeType: ERestBodyTypes.Xml,
          text: request?.body?.[ERestBodyTypes.Xml]?.value || '',
        };
        harRequest.bodySize = harRequest.postData.text.length;
        break;
    }
  }

  // parse path params from the URL string
  harRequest.url = _url.replacePathParams(
    harRequest.url,
    request?.url?.pathParams
  );

  // add protocol if not exist
  if (!harRequest.url.includes('http'))
    harRequest.url = `http://${harRequest.url}`;

  return harRequest;
};
