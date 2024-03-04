import * as rawBody from 'raw-body';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
  Response,
  HttpStatus,
  HttpCode,
  Patch,
  Delete,
  Head,
  Ip,
  Header,
  StreamableFile,
  Res,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { response } from 'express';
import * as Hawk from 'hawk';
import { Credentials } from 'hawk/lib/server';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createDeflate, createGzip } from 'zlib';
import { Readable } from 'stream';
import {
  echoUsername,
  echoPassword,
  hawkId,
  hawkKey,
  oathSigningKey,
} from 'src/assets/credentials';
import {
  buildOauthSignatureBase,
  parseAuthHeader,
} from 'src/utilities/restControllerUtilities';
import { get } from 'http';
import * as moment from 'moment';


@Controller('')
export class RestController {
  /** Methods  */

  @Get('get')
  get(@Req() req, @Query() queryParams, @Headers() headers) {
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const method = 'GET';
    return { url, method, args: queryParams, headers };
  }

  @Post('post')
  @HttpCode(HttpStatus.OK)
  async post(
    @Req() req,
    @Body() body,
    @Headers('Content-Type') ct,
    @Headers() headers
  ) {
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const method = 'POST';
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawBody(req);
      body = raw.toString().trim();
    }
    let data = {};
    let form = {};
    if (ct == 'application/x-www-form-urlencoded') form = body;
    else data = body;
    return { url, method, form, data, headers };
  }

  @Put('put')
  async put(
    @Req() req,
    @Body() body,
    @Headers('Content-Type') ct,
    @Headers() headers
  ) {
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const method = 'PUT';
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawBody(req);
      body = raw.toString().trim();
    }
    let data = {};
    let form = {};
    if (ct == 'application/x-www-form-urlencoded') form = body;
    else data = body;
    return { url, method, form, data, headers };
  }

  @Patch('patch')
  async patch(
    @Req() req,
    @Body() body,
    @Headers('Content-Type') ct,
    @Headers() headers
  ) {
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const method = 'PATCH';
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawBody(req);
      body = raw.toString().trim();
    }

    let data = {};
    let form = {};
    if (ct == 'application/x-www-form-urlencoded') form = body;
    else data = body;
    return { url, method, form, data, headers };
  }

  @Delete('delete')
  async delete(
    @Req() req,
    @Body() body,
    @Headers('Content-Type') ct,
    @Headers() headers
  ) {
    const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const method = 'PATCH';
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawBody(req);
      body = raw.toString().trim();
    }

    let data = {};
    let form = {};
    if (ct == 'application/x-www-form-urlencoded') form = body;
    else data = body;
    return { url, method, form, data, headers };
  }

  /** Headers */

  @Get('headers')
  headers(@Req() req, @Headers() headers) {
    // const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
    // const method = 'GET';
    return { headers };
  }

  @Get('response-headers')
  responseHeaders(
    @Req() req,
    @Query() queryParams,
    // @Headers() headers,
    @Response() res
  ) {
    Object.keys(queryParams).map((k) => {
      res.header(k, queryParams[k]);
    });
    return res.json(queryParams);
  }

  /** Authentication Methods */

  // Basic Auth
  @Get('basic-auth')
  basicAuth(@Query() queryParams, @Headers() headers, @Response() res) {
    if (!('authorization' in headers)) {
      return res.status(401).send('Unauthorized');
    }

    const split = headers.authorization.split(' ');

    const type = split[0];
    if (type != 'Basic') {
      return res.status(401).send('Unauthorized');
    }
    const decoded = Buffer.from(split[1], 'base64').toString();
    const decodedSplit = decoded.split(':');
    if (decodedSplit.length != 2) {
      return res.status(401).send('Unauthorized');
    }
    const username = decodedSplit[0];
    const password = decodedSplit[1];

    if (username !== echoUsername || password !== echoPassword) {
      return res.status(401).send('Unauthorized');
    }

    return { authenticated: true };
  }

  // Digest Auth
  @Get('digest-auth')
  digestAuth(@Headers() headers, @Response() res) {
    const realm = 'Users';

    if (!('authorization' in headers)) {
      const nonce = crypto.randomBytes(16).toString('base64');
      res
        .set({
          'www-authenticate': `Digest realm="${realm}", nonce="${nonce}"`,
        })
        .status(401);
      return res.status(401).send('Unauthorized');
    }

    const split = headers.authorization.split(' ');
    const type = split[0];
    if (type !== 'Digest') {
      return res.status(401).send('Unauthorized');
    }

    const argsMap = parseAuthHeader(headers.authorization.slice(7));

    if (
      !(
        argsMap['username'] &&
        argsMap['nonce'] &&
        argsMap['realm'] &&
        argsMap['response']
      )
    ) {
      return res.status(401).send('Unauthorized');
    }

    if (argsMap['username'] !== echoUsername) {
      return res.status(401).send('Unauthorized');
    }

    const HA1 = crypto
      .createHash('md5')
      .update(`${argsMap['username']}:${argsMap['realm']}:${echoPassword}`)
      .digest('hex');
    const HA2 = crypto
      .createHash('md5')
      .update(`GET:/digest-auth`)
      .digest('hex');
    const responseCheck = crypto
      .createHash('md5')
      .update(`${HA1}:${argsMap['nonce']}:${HA2}`)
      .digest('hex');

    if (responseCheck !== argsMap['response']) {
      return res.status(401).send('Unauthorized');
    }

    return res.json({ authorized: true });
  }

  // Hawk Auth
  @Get('hawk-auth')
  async hawkAuth(@Req() req, @Response() res) {
    const credentialsFunc = function (id) {
      if (id !== hawkId) {
        return undefined;
      }

      const credentials: Credentials = {
        key: hawkKey,
        algorithm: 'sha256',
        user: 'Steve',
      };

      return credentials;
    };

    let status, message;

    try {
      const { credentials, artifacts } = await Hawk.server.authenticate(
        req,
        credentialsFunc
      );
      message = { message: 'Hawk Authentication Successful' };

      status = 200;
      const header = Hawk.server.header(credentials, artifacts);

      res.set({ 'Server-Authorization': header });
    } catch (error) {
      message = error.output.payload;
      status = 401;
      const header = error.output.headers;
      res.set(header);
    }

    return res.status(status).json(message);
  }

  // OAuth 1.0
  @Get('oauth1')
  OAuth1(@Req() req, @Headers() headers, @Response() res) {
    if (!('authorization' in headers)) {
      return res.status(401).send('Unauthorized');
    }

    const authorizationHeader = headers.authorization;

    if (authorizationHeader.split(' ')[0] !== 'OAuth') {
      return res.status(401).send('Unauthorized');
    }

    const oauthParams = parseAuthHeader(authorizationHeader.slice(6));

    const consumerKey = oauthParams['oauth_consumer_key'];
    const timestamp = oauthParams['oauth_timestamp'];
    const nonce = oauthParams['oauth_nonce'];
    const signature = decodeURIComponent(oauthParams['oauth_signature']);
    const signatureMethod = oauthParams['oauth_signature_method'];

    const base_uri = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const signatureBase = buildOauthSignatureBase('GET', base_uri, oauthParams);

    const expectedSignature = crypto
      .createHmac('sha1', oathSigningKey)
      .update(signatureBase)
      .digest('base64');

    if (signature !== expectedSignature) {
      const status = 'fail';
      const message = 'HMAC-SHA1 verification failed';
      const normalized_param_string =
        consumerKey + '&' + nonce + '&' + signatureMethod + '&' + timestamp;
      const baseString = signatureBase;
      return res.status(401).json({
        status,
        message,
        base_uri,
        normalized_param_string,
        base_string: baseString,
        signing_key: oathSigningKey,
      });
    }
    const status = 'pass';
    const message = 'OAuth-1.0a signature verification was successful';

    return res.json({ status, message });
  }

  /** Cookies Manipulation*/

  // set cookie
  @Get('cookies/set')
  cookieSet(@Query() queryParams, @Response() res) {
    const payload = { cookies: {} };

    Object.entries(queryParams).forEach((param) => {
      const [key, value] = param;
      payload.cookies[key] = value;
      res.cookie(key, value);
    });
    return res.json(payload);
  }

  // get cookie
  @Get('cookies')
  cookieGet(@Req() req, @Response() res) {
    const responseData = { cookies: req.cookies };
    return res.json(responseData);
  }

  // delete cookie
  @Get('cookies/delete')
  cookieDelete(@Req() req, @Query() queryParameters, @Response() res) {
    const cookies = { ...req.cookies };

    Object.keys(queryParameters).forEach((key) => {
      res.clearCookie(key);
      delete cookies[key];
    });

    return res.json(cookies);
  }

  /** Utilities */

  // Response Status Code
  @Get('status/:status')
  status(@Param('status') status, @Response() res) {
    try {
      return res.status(status).json({ status });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  // Streamed Response
  @Get('stream/:chunk')
  stream(@Req() req, @Param('chunk') chunk, @Headers() headers) {
    const n = parseInt(chunk);

    if (isNaN(n)) {
      return;
    }

    let responseJson = '';
    for (let i = 0; i < n; i++) {
      const args = { n: chunk };
      const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
      const responseData = { args, headers, url };
      responseJson += JSON.stringify(responseData, null, 2);
    }

    const responseBuffer = Buffer.from(responseJson);
    const stream = new Readable();
    stream.push(responseBuffer);
    stream.push(null);

    return new StreamableFile(stream);
  }

  // Delayed Response
  @Get('delay/:seconds')
  delay(@Param('seconds') seconds, @Response() res) {
    seconds = +seconds;
    if (typeof seconds != 'number')
      throw new BadRequestException('Seconds not valid');
    setTimeout(() => {
      return res.json({ delay: seconds, in: 'seconds' });
    }, seconds * 1000);
  }

  // Get UTF8 Encoded Response
  @Get('encoding/utf8')
  @Header('content-type', 'text/html; charset=utf-8')
  encoding() {
    const file = createReadStream(
      join(process.cwd(), 'src/assets/unicodedemo.html')
    );
    return new StreamableFile(file);
  }

  // GZip Compressed Response
  @Get('gzip')
  gzip(@Req() req, @Response() res, @Headers() headers) {
    const responseData = { gzip: true, headers, method: req.method };

    const compressionAlgorithm = 'gzip';

    const acceptedEncodings = headers['accept-encoding'];

    if (acceptedEncodings && acceptedEncodings.includes(compressionAlgorithm)) {
      const jsonResponse = JSON.stringify(responseData);

      res.setHeader('Content-Encoding', compressionAlgorithm);
      res.setHeader('Content-Type', 'application/json');

      const compressionStream = createGzip();

      compressionStream.pipe(res);
      compressionStream.write(jsonResponse);
      compressionStream.end();
    } else {
      res.json({ ...responseData, gzip: false });
    }
  }

  // Deflate Compressed Response
  @Get('deflate')
  deflate(@Req() req, @Response() res, @Headers() headers) {
    const responseData = { deflate: true, headers, method: req.method };

    const compressionAlgorithm = 'deflate';

    const acceptedEncodings = headers['accept-encoding'];

    if (acceptedEncodings && acceptedEncodings.includes(compressionAlgorithm)) {
      const jsonResponse = JSON.stringify(responseData);

      res.setHeader('Content-Encoding', compressionAlgorithm);
      res.setHeader('Content-Type', 'application/json');

      const compressionStream = createDeflate();

      compressionStream.pipe(res);
      compressionStream.write(jsonResponse);
      compressionStream.end();
    } else {
      res.json({ ...responseData, deflate: false });
    }
  }

  //IP address in JSON format
  @Get('ip')
  ip(@Ip() ip) {
    return { ip: ip };
  }

  //  Date and Time
  // Current UTC time
  @Get('time/now')
  timeNow() {
    return new Date().toUTCString();
  }

  // Timestamp validity
  @Get('time/valid')
  timeValid(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;
    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;

    const parsed = moment(timestamp, format, locale, strict);

    return res.json({ valid: parsed.isValid() });
  }

  // Format timestamp
  @Get('time/format')
  timeFormat(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }

    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;

    const parsed = moment(timestamp, format, locale, strict).format(format);

    console.log(parsed);
    return res.json({ format: parsed });
  }

  // Extract timestamp unit
  @Get('time/extract')
  timeExtract(@Query() queryParams, @Response() res) {
    const { locale, format } = queryParams;
    const timestamp = queryParams.timestamp || new Date().toUTCString();
    const unit = queryParams.unit && queryParams.unit.toLowerCase() || 'year'
    const strict = queryParams['strict']
    ? queryParams['strict'].toLowerCase() === 'true'
    : false;

    const parsed = moment(timestamp, locale, format, strict)
    const obj = {
      years: parsed.year(),
      months: parsed.month(),
      date: parsed.date(),
      hours: parsed.hour(),
      minutes: parsed.minute(),
      seconds: parsed.second(),
      milliseconds: parsed.millisecond(),
    };

    return res.json({unit: obj[unit]})

  }

  // Time addition
  @Get('time/add')
  timeAddition(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }

    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;

    const {
      years,
      days,
      months,
      quarters,
      weeks,
      hours,
      minutes,
      seconds,
      milliseconds,
    } = queryParams;

    const additions = [
      { unit: 'year', amount: years },
      { unit: 'day', amount: days },
      { unit: 'month', amount: months },
      { unit: 'quarter', amount: quarters },
      { unit: 'week', amount: weeks },
      { unit: 'hour', amount: hours },
      { unit: 'minute', amount: minutes },
      { unit: 'second', amount: seconds },
      { unit: 'millisecond', amount: milliseconds },
    ];

    const parsed = moment(timestamp, format, locale, strict);

    additions.forEach((addition) => {
      if (!addition.amount) {
        return;
      }
      parsed;
      parsed.add(addition.amount, addition.unit);
    });

    console.log(parsed);
    return res.json({ sum: parsed });
  }
  // Time subtraction
  @Get('time/subtract')
  timeSubtraction(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;

    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }

    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;

    const {
      years,
      days,
      months,
      quarters,
      weeks,
      hours,
      minutes,
      seconds,
      milliseconds,
    } = queryParams;

    const subtractions = [
      { unit: 'years', amount: years },
      { unit: 'days', amount: days },
      { unit: 'months', amount: months },
      { unit: 'quarters', amount: quarters },
      { unit: 'weeks', amount: weeks },
      { unit: 'hours', amount: hours },
      { unit: 'minutes', amount: minutes },
      { unit: 'seconds', amount: seconds },
      { unit: 'milliseconds', amount: milliseconds },
    ];

    const parsed = moment(timestamp, format, locale, strict);

    subtractions.forEach((subtraction) => {
      if (!subtraction.amount) {
        return;
      }
      parsed.subtract(subtraction.amount, subtraction.unit);
    });

    return res.json({ difference: parsed });
  }

  // Start of time
  @Get('time/start')
  startOf(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format, unit } = queryParams;

    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }

    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;

    const parsed = moment(timestamp, format, locale, strict);

    parsed.startOf(unit).format();

    return res.json({ start: parsed.startOf(unit).format() });
  }

  // Object representation
  @Get('time/object')
  objectRepresentation(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;

    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }
    
    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;
    const parsed = moment(timestamp, format, locale, strict);
    const obj = {
      years: parsed.year(),
      months: parsed.month(),
      date: parsed.date(),
      hours: parsed.hour(),
      minutes: parsed.minute(),
      seconds: parsed.second(),
      milliseconds: parsed.millisecond(),
    };

    console.log(obj);

    return res.json(obj);
  }
  // Before comparisons
  @Get('time/before')
  timeBefore(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format, target } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }
    if (!target) {
      return res.status(400).send('Invalid undefined in `target` query param');
    }
    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;
    const parsed = moment(timestamp, format, locale, strict);
    const parsedTarget = moment(target, format, locale, strict);

    return res.json({ before: parsed.isBefore(parsedTarget) });
  }
  // After comparisons
  @Get('time/after')
  timeAfter(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format, target } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }
    if (!target) {
      return res.status(400).send('Invalid undefined in `target` query param');
    }
    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;
    const parsed = moment(timestamp, format, locale, strict);
    const parsedTarget = moment(target, format, locale, strict);

    return res.json({ after: parsed.isAfter(parsedTarget) });
  }

  // Between timestamps
  @Get('time/between')
  timeBetween(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format, start, end } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }
    if (!start) {
      return res.status(400).send('Invalid undefined in `start` query param');
    }
    if (!end) {
      return res.status(400).send('Invalid undefined in `end` query param');
    }
    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;
    const parsed = moment(timestamp, format, locale, strict);
    const parsedStart = moment(start, format, locale, strict);
    const parsedEnd = moment(end, format, locale, strict);

    return res.json({
      between: parsed.isAfter(parsedStart) && parsed.isBefore(parsedEnd),
    });
  }

  // Leap year check
  @Get('time/leap')
  leap(@Query() queryParams, @Response() res) {
    const { timestamp, locale, format } = queryParams;
    if (!timestamp) {
      return res
        .status(400)
        .send('Invalid undefined in `timestamp` query param');
    }

    const strict = queryParams['strict']
      ? queryParams['strict'].toLowerCase() === 'true'
      : false;
    const parsed = moment(timestamp, format, locale, strict);

    return res.json({ leap: parsed.isLeapYear() });
  }
  /** Auth: Digest */
  // 1. DigestAuth Request
}
