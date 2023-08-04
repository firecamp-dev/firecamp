import * as rawBody from 'raw-body';
import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Put, Query, Req, Response, HttpStatus, HttpCode, Patch, Delete } from '@nestjs/common';

@Controller('')
export class RestController {

    /** Methods  */

    @Get('get')
    get(
        @Req() req,
        @Query() queryParams,
        @Headers() headers
    ) {
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        const method = 'GET';
        return { url, method, args: queryParams, headers }
    }

    @Post('post')
    @HttpCode(HttpStatus.OK)
    async post(
        @Req() req,
        @Body() body,
        @Headers('Content-Type') ct,
        @Headers() headers
    ) {
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        const method = 'POST';
        if (req.readable) {
            // body is ignored by NestJS -> get raw body from request
            const raw = await rawBody(req);
            body = raw.toString().trim();
        }
        let data= {};
        let form = {};
        if(ct == 'application/x-www-form-urlencoded') form = body;
        else data = body
        return { url, method, form, data, headers }
    }

    @Put('put')
    async put(
        @Req() req,
        @Body() body,
        @Headers('Content-Type') ct,
        @Headers() headers
    ) {
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        const method = 'PUT';
        if (req.readable) {
            // body is ignored by NestJS -> get raw body from request
            const raw = await rawBody(req);
            body = raw.toString().trim();
        }
        let data= {};
        let form = {};
        if(ct == 'application/x-www-form-urlencoded') form = body;
        else data = body
        return { url, method, form, data, headers }
    }

    @Patch('patch')
    async patch(
        @Req() req,
        @Body() body,
        @Headers('Content-Type') ct,
        @Headers() headers
    ) {
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        const method = 'PATCH';
        if (req.readable) {
            // body is ignored by NestJS -> get raw body from request
            const raw = await rawBody(req);
            body = raw.toString().trim();
        }
        
        let data= {};
        let form = {};
        if(ct == 'application/x-www-form-urlencoded') form = body;
        else data = body
        return { url, method, form, data, headers }
    }

    @Delete('delete')
    async delete(
        @Req() req,
        @Body() body,
        @Headers('Content-Type') ct,
        @Headers() headers
    ) {
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        const method = 'PATCH';
        if (req.readable) {
            // body is ignored by NestJS -> get raw body from request
            const raw = await rawBody(req);
            body = raw.toString().trim();
        }
        
        let data= {};
        let form = {};
        if(ct == 'application/x-www-form-urlencoded') form = body;
        else data = body
        return { url, method, form, data, headers }
    }


    /** Headers */

    @Get('headers')
    headers(
        @Req() req,
        @Headers() headers
    ) {
        // const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`
        // const method = 'GET';
        return { headers }
    }

    @Get('response-headers')
    responseHeaders(
        @Req() req,
        @Query() queryParams,
        // @Headers() headers,
        @Response() res
    ) {
        // console.log(queryParams)
        Object.keys(queryParams).map((k, i)=> {
            res.header(k, queryParams[k]);
        })
        return res.json(queryParams);
    }

    /** Authentication Methods */

    // Basic Auth
    @Get('basic-auth')
    basicAuth() {
        return 'yet to implement'
        // return { authenticated: true }
    }

    // Digest Auth
    @Get('digest-auth')
    digestAuth() {
        return 'yet to implement'
        // return { authenticated: true }
    }

    // Hawk Auth
    @Get('hawk-auth')
    hawkAuth() {
        return 'yet to implement'
        // return { authenticated: true }
    }

    // OAuth 1.0
    @Get('oauth1')
    OAuth1() {
        return 'yet to implement'
        // return { authenticated: true }
    }

    /** Cookies Manipulation*/

    // set cookie
    @Get('cookies/set')
    cookieSet() {
        return 'yet to implement'
    }

    // get cookie
    @Get('cookies')
    cookieGet() {
        return 'yet to implement'
    }

    // delete cookie
    @Get('cookies/delete')
    cookieDelete() {
        return 'yet to implement'
    }

    /** Utilities */

    // Response Status Code
    @Get('status/:status')
    status(
        @Param('status') status,
        @Response() res
    ) {
        try {
            return res.status(status).json({ status })
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    // Streamed Response
    @Get('stream/:chunk')
    stream(
        @Param('chunk') chunk,
        @Response() res
    ) {
        return 'yet to implement'
    }

    // Delayed Response
    @Get('delay/:seconds')
    delay(
        @Param('seconds') seconds,
        @Response() res
    ) {

        seconds = +seconds;
        if (typeof seconds != 'number') throw new BadRequestException('Seconds not valid')
        setTimeout(() => {
            return res.json({ delay: seconds, in: 'seconds' })
        }, seconds * 1000);
    }

    // Get UTF8 Encoded Response
    @Get('encoding/utf8')
    encoding() {
        return 'yet to implement'
    }

    // GZip Compressed Response
    @Get('gzip')
    gzip() {
        return 'yet to implement'
    }

    // Deflate Compressed Response
    @Get('deflate')
    deflate() {
        return 'yet to implement'
    }

    //IP address in JSON format
    @Get('ip')
    ip() {
        return 'yet to implement'
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
