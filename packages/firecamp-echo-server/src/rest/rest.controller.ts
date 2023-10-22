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
  echo_username,
  echo_password,
  hawk_id,
  hawk_key,
  oath_signing_key,
} from '../assets/credentials';

function buildSignatureBase(httpMethod, baseUrl, oauthParameters) {
  // Sort the OAuth parameters alphabetically by name
  const sortedParameters = Object.keys(oauthParameters)
    .sort()
    .filter((key) => key !== 'oauth_signature')
    .map((key) => key + '=' + encodeURIComponent(oauthParameters[key]));

  // Create the parameter string by joining the sorted parameters with "&"
  const parameterString = sortedParameters.join('&');

  // Encode the HTTP method and base URL
  const encodedHttpMethod = encodeURIComponent(httpMethod);
  const encodedBaseUrl = encodeURIComponent(baseUrl);

  // Construct the signature base string
  const signatureBase = `${encodedHttpMethod}&${encodedBaseUrl}&${encodeURIComponent(
    parameterString
  )}`;

  return signatureBase;
}

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

    if (username !== echo_username || password !== echo_password) {
      return res.status(401).send('Unauthorized');
    }

    return { authenticated: true };
  }

  // Digest Auth
  @Get('digest-auth')
  digestAuth(@Req() req, @Headers() headers, @Response() res) {
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

    const authArgs = headers.authorization.slice(7).split(', ');
    const argsMap = {};

    authArgs.forEach((arg) => {
      const split = arg.replaceAll('"', '').replace('=', '-:-').split('-:-');
      argsMap[split[0]] = split[1];
    });

    if (
      !(
        argsMap['username'] &&
        argsMap['nonce'] &&
        argsMap['realm'] &&
        argsMap['response']
      )
    ) {
      return res.json({ authorized: false });
    }
    const HA1 = crypto
      .createHash('md5')
      .update(`${argsMap['username']}:${argsMap['realm']}:${echo_password}`)
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
      if (id !== hawk_id) {
        return undefined;
      }

      const credentials: Credentials = {
        key: hawk_key,
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
    const parseOAuthHeader = (authorizationHeader) => {
      const oauthParams = {};

      const oauthRegex = /(\w+)="([^"]+)"/g;

      let match;
      while ((match = oauthRegex.exec(authorizationHeader)) !== null) {
        oauthParams[match[1]] = match[2];
      }

      return oauthParams;
    };

    if (!('authorization' in headers)) {
      return res.status(401).send('Unauthorized');
    }

    const authorizationHeader = headers.authorization;

    if (authorizationHeader.split(' ')[0] !== 'OAuth') {
      return res.status(401).send('Unauthorized');
    }

    const oauthParams = parseOAuthHeader(authorizationHeader.slice(6));

    const consumerKey = oauthParams['oauth_consumer_key'];
    const timestamp = oauthParams['oauth_timestamp'];
    const nonce = oauthParams['oauth_nonce'];
    const signature = decodeURIComponent(oauthParams['oauth_signature']);
    const signatureMethod = oauthParams['oauth_signature_method'];

    const base_uri = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const signatureBase = buildSignatureBase('GET', base_uri, oauthParams);

    const expectedSignature = crypto
      .createHmac('sha1', oath_signing_key)
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
        signing_key: oath_signing_key,
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

  /** Utilities / Date and Time */
  // 1. Current UTC time
  // 2. Timestamp validity
  // 3. Format timestamp
  // 4. Extract timestamp unit
  // 5. Time addition
  // 6. Time subtraction
  // 7. Start of time
  // 8. Object representation
  // 9. Before comparisons
  // 10. After comparisons
  // 11. Between timestamps
  // 12. Leap year check

  /** Auth: Digest */
  // 1. DigestAuth Request
}
