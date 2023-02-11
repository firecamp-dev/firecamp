import { IHeader, IRestResponse } from '@firecamp/types';
import { _object, _string, _table } from '@firecamp/utils';
import { IScriptResponse } from '../../types/response';

/**
 * response script
 */
export class Response implements IScriptResponse {
  headersList: IHeader[] = [];
  data?: any;
  duration?: number | undefined;
  size?: number | undefined;
  statusCode: number;
  statusMessage?: string | undefined;
  headers?: { [key: string]: string } = {};

  constructor(response: IRestResponse) {
    Object.assign(this, response);

    this.headersList = _table.objectToTable(this.headers || {});
  }

  text(): string {
    return String(this?.data).valueOf();
  }

  json(): any {
    try {
      if (_object.isObject(this?.data)) return this.data;
      else if (!_string.isEmpty(this.data)) return JSON.parse(this.data);
    } catch (error) {
      return error.message;
    }
  }
}
