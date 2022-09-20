import { IRest, IRestResponse } from '@firecamp/types'
import { AxiosRequestConfig } from 'axios'

export interface IRestExecutor {

    /**
     * controller to abort the axios request execution
     */
    controller: AbortController

    /**
     * Return axios request config generated from Firecamp REST request
     * @param request Firecamp REST request
     */
    prepare(request: IRest): Promise<AxiosRequestConfig>

    /**
     * send the request to the server and return the response
     * received from the server
     * @param request REST request want to send to the server
     */
    send(request: IRest): Promise<IRestResponse>

    /**
     * cancel the request
     */
    cancel(): void
}