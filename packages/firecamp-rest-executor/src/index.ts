import { ERestBodyTypes, IRest, IRestResponse } from '@firecamp/types'
import { _array, _object, _table } from '@firecamp/utils'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import HTTPS from 'https'
import QueryString from 'qs'
import _url from '@firecamp/url'
import { isNode } from 'browser-or-node'
import parseBody from './helpers/body'
import { IRestExecutor } from './types'

export * from './script-runner'

export default class RestExecutor implements IRestExecutor {

    controller: AbortController

    constructor() {
        this.controller = new AbortController()
    }

    async prepare(request: IRest): Promise<AxiosRequestConfig> {
        const { meta, body, config, headers, url } = request

        const axiosRequest: AxiosRequestConfig = {
            url: _url.parse(url?.raw || '', ['http', 'https']),
            params: QueryString.stringify(_table.toObject(url?.query_params || [])),
            method: request.method,
            headers: _table.toObject(headers || []),
            // TODO: Supported in browser
            httpsAgent: new HTTPS.Agent({ rejectUnauthorized: false }),
            signal: this.controller.signal,
            timeout: config?.request_timeout,
            maxRedirects: config?.max_redirects,
            transformResponse: (response) => response,
        }

        // disable SSL validation default
        if (isNode) {
            axiosRequest.httpsAgent = new HTTPS.Agent({
                rejectUnauthorized: config?.reject_unauthorized
            })
        }

        // parse path params
        if (!_array.isEmpty(url?.path_params as any))
            axiosRequest.url = _url.replacePathParams(url?.raw || '', url?.path_params || [])

        // TODO: Check sending file without serialize in desktop environment
        // parse body payload
        axiosRequest.data = await parseBody(body || {}, meta?.active_body_type || ERestBodyTypes.NoBody)

        return axiosRequest
    }

    timeline(request: AxiosRequestConfig, response: AxiosResponse): string {
        const timeline: string[] = []

        /**
         * Return the key:value string
         * @param object 
         * @param prefix 
         * @returns 
         */
        const objectToText = (object = {}, prefix: string) =>
            Object.keys(object).reduce(
                (prev, key) => `${prev + prefix + ' ' + key}:${object[key]}\n`,
                ''
            )

        const { status, statusText, config, headers } = response

        timeline.push('\n----------------General----------------\n')

        timeline.push(`# Request URL:  ${config.url}`)

        timeline.push(`# Request Method: ${config.method}`)

        timeline.push(`# Status Code: ${status} ${statusText}`)

        if (!_object.isEmpty(request.headers || {})) {

            timeline.push('\n-----------Request Headers-----------\n')

            timeline.push(objectToText(request.headers, '>'))
        }

        if (typeof config.data === 'string') {
            timeline.push('\n-----------Request Data-----------\n')

            timeline.push(`> ${config.data}`)
        }

        timeline.push(`\n-----------Response Headers-----------\n`)

        timeline.push(objectToText(headers, '<'))

        if (typeof response.data === 'string') {
            timeline.push('\n-----------Response Data-----------\n')

            timeline.push(`> ${response.data}`)
        }

        return timeline.join('\n')
    }

    normalizeResponse(axiosResponse: AxiosResponse): IRestResponse {
        return {
            statusCode: axiosResponse.status,
            statusMessage: axiosResponse.statusText,
            data: axiosResponse.data,
            headers: axiosResponse.headers,
            duration: axiosResponse?.config?.['metadata']?.duration || 0,
            size: Number(axiosResponse?.headers?.['content-length']) || 0
        }
    }

    async send(request: IRest): Promise<IRestResponse> {
        let axiosRequest: AxiosRequestConfig = {}

        try {
            if (_object.isEmpty(request))
                return Promise.reject(new Error('Invalid request payload'))

            axiosRequest = await this.prepare(request)

            // note the request start time
            axios.interceptors.request.use((request) => {
                request['metadata'] = {
                    startTime: new Date()
                }

                return request
            })

            // note the request finished time
            axios.interceptors.response.use((response) => {
                response.config['metadata']['endTime'] = new Date()

                response.config['metadata'] = {
                    ...response.config['metadata'],
                    get duration() {
                        return this.endTime - this.startTime
                    }
                }

                return response
            })

            // execute request
            const axiosResponse = await axios(axiosRequest)

            // normalize response according to Firecamp REST request's response
            const response = this.normalizeResponse(axiosResponse)

            // prepare timeline of request execution
            response['timeline'] = this.timeline(axiosRequest, axiosResponse)

            return Promise.resolve(response)
        } catch (error) {console.error(error);
        
            if (!_object.isEmpty(error.response)) {
                const response = this.normalizeResponse(error.response)

                if (!error?.response?.config && error?.config) {
                    error.response.config = error.config
                }

                // prepare timeline of request execution
                response['timeline'] = this.timeline(axiosRequest, error.response)

                return Promise.reject(response)
            }
            return Promise.reject(error.message)
        }
    }

    cancel(): void {
        this.controller.abort()
    }
}