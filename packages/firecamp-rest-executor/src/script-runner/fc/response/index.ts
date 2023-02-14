import chai from 'chai';
import { IHeader, IRestResponse } from '@firecamp/types';
import { _array, _object, _string, _table } from '@firecamp/utils';
import responseAssertionPlugin from './assertions';

/** response script */
export class Response {
  private body: any;
  private headers: IHeader[];
  private cookies: any[];
  private code?: number;
  private status: string;
  private responseTime: number;
  private responseSize: number;
  public to: any;

  constructor(response: IRestResponse) {
    this.body = response.body || '';
    this.headers = response.headers || [];
    this.cookies = response.cookies || [];
    this.code = response.code;
    this.status = response.status || '';
    this.responseTime = response.responseTime || 0;
    this.responseSize = response.responseSize || 0;
    // this.headers = _table.objectToTable(this.headers || {});
    chai.use(responseAssertionPlugin);
    this.to = chai.expect(this).to;
  }

  /** return response body in a text format */
  text(): string {
    try {
      if (_string.isString(this.body)) return this.body;
      else if (!_object.isObject(this.body) || Array.isArray(this.body))
        return JSON.stringify(this.body);
      else return '';
    } catch (e: any) {
      return '';
    }
  }

  /** return response body in a JSON string */
  json(): any {
    try {
      if (_object.isObject(this.body) || Array.isArray(this.body))
        return this.body;
      else if (!_string.isEmpty(this.body)) return JSON.parse(this.body);
      else return {};
    } catch (e: any) {
      // return e.message;
      return {};
    }
  }

  jsonp() {
    // TODO: implement jsonp here later
    return this.json();
  }

  dataURI() {
    // TODO: todo implement dataURI
  }

  reason(): string {
    // TODO: implement reason here
    return this.status;
  }

  /** get response size object containing body, header and total */
  size(): { body: number; header: number; total: number } {
    // TODO: implement size here
    return {
      body: this.responseSize,
      header: 0, // TODO: need to implement
      total: this.responseSize,
    };
  }

  toJSON(): IRestResponse {
    return {
      // id: '',
      headers: this.headers,
      body: this.body,
      // stream: {} //buffer,
      cookies: this.cookies,
      code: this.code,
      status: this.status,
      responseTime: this.responseTime,
      responseSize: this.responseSize,
    };
  }
}

/**
 * pm compatible fc script response
console.log('----- RESPONSE -----');
-[] console.log('1. body', fc.response.body); //@note will not do it
console.log('2. code', fc.response.code);
-[] console.log('3. contentInfo()', fc.response.contentInfo());
-[] console.log('4. cookies', fc.response.cookies);
-[] console.log('5. dataURI()', fc.response.dataURI());
-[] console.log('6. describe()', fc.response.describe());
-[] console.log('7. disabled', fc.response.disabled);
-[] console.log('8. findInParents', fc.response.findInParents);
-[] console.log('9. findSubstitutions', fc.response.findSubstitutions);
-[] console.log('10. forEachParent', fc.response.forEachParent);
console.log('11. headers', fc.response.headers);
-[] console.log('12. id', fc.response.id);
console.log('13. json()', fc.response.json());
console.log('14. jsonp()', fc.response.jsonp());
-[] console.log('15. meta()', fc.response.meta());
-[] console.log('16. name', fc.response.name);
-[] console.log('17. originalRequest', fc.response.originalRequest);
-[] console.log('18. parent()', fc.response.parent());
-[] console.log('19. reason()', fc.response.reason());
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

// const rs = new Response({ code: 200 });
// console.log(rs.to.have);
// console.log(rs.to.be.ok);
