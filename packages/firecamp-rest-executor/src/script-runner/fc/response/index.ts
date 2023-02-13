import chai from 'chai';
import { IHeader, IRestResponse } from '@firecamp/types';
import { _object, _string, _table } from '@firecamp/utils';
import { IScriptResponse } from '../../types/response';

/** response script */
export class Response implements IScriptResponse {
  headersList: IHeader[] = [];
  data?: any;
  duration?: number | undefined;
  size?: number | undefined;
  statusCode?: number;
  statusMessage?: string | undefined;
  headers?: { [key: string]: string } = {};

  constructor(response: IRestResponse) {
    Object.assign(this, response);
    this.headersList = _table.objectToTable(this.headers || {});
  }

  to = {
    get() {
      return chai.expect(this).to;
    },
  };

  text(): string {
    return String(this?.data).valueOf();
  }

  json(): any {
    try {
      if (_object.isObject(this?.data)) return this.data;
      else if (!_string.isEmpty(this.data)) return JSON.parse(this.data);
    } catch (e: any) {
      return e.message;
    }
  }

  toJSON() {
    return {
      headersList: this.headersList,
      data: this.data,
      duration: this.duration,
      size: this.size,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      headers: this.headers,
    };
  }
}

/**
 * pm compatible fc script response
console.log('----- RESPONSE -----');
console.log('1. body', fc.response.body);
console.log('2. code', fc.response.code);
console.log('3. contentInfo()', fc.response.contentInfo());
console.log('4. cookies', fc.response.cookies);
console.log('5. dataURI()', fc.response.dataURI());
console.log('6. describe()', fc.response.describe());
console.log('7. disabled', fc.response.disabled);
console.log('8. findInParents', fc.response.findInParents);
console.log('9. findSubstitutions', fc.response.findSubstitutions);
console.log('10. forEachParent', fc.response.forEachParent);
console.log('11. headers', fc.response.headers);
console.log('12. id', fc.response.id);
console.log('13. json()', fc.response.json());
console.log('14. jsonp()', fc.response.jsonp());
console.log('15. meta()', fc.response.meta());
console.log('16. name', fc.response.name);
console.log('17. originalRequest', fc.response.originalRequest);
console.log('18. parent()', fc.response.parent());
console.log('19. reason()', fc.response.reason());
console.log('20. responseTime', fc.response.responseTime);
console.log('21. size()', fc.response.size());
console.log('22. status', fc.response.status);
console.log('23. text()', fc.response.text());
// console.log('24. to', fc.response.to.be.success)
console.log('25. toJSON()', fc.response.toJSON());

tests['user created'] = responseCode.code === 200;
tests['user added'] = () => true;
console.log('26. tests', tests);
console.log('27. responseCode', responseCode);
console.log('28. responseTime', responseTime);
*/
