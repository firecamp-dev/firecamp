import { ERestBodyTypes, EHttpMethod, ERequestTypes } from '@firecamp/types'
import RestExecutor from '../'

describe('rest executor', () => {

    it('should send response successfully', async () => {
        const request = new RestExecutor()

        const response = await request.send({
            url: {
                raw: 'https://jsonplaceholder.typicode.com/posts', query_params: [{
                    key: 'id',
                    value: '1'
                }], path_params: []
            },
            _meta: {
                id: '',
                collection_id: ''
            },
            meta: {
                active_body_type: ERestBodyTypes.NoBody,
                name: '',
                type: ERequestTypes.Rest,
                version: '2.0.0'
            },
            method: EHttpMethod.GET
        })

        expect(response.statusCode).toEqual(200)
    })

    it('should send body', async () => {
        const request = new RestExecutor()

        const response = await request.send({
            url: {
                raw: 'https://jsonplaceholder.typicode.com/posts'
            },
            _meta: {
                id: '',
                collection_id: ''
            },
            meta: {
                active_body_type: ERestBodyTypes.Json,
                name: '',
                type: ERequestTypes.Rest,
                version: '2.0.0'
            },
            headers: [{
                key: 'content-type',
                value: 'application/json',
            }],
            method: EHttpMethod.POST,
            body: {
                "application/json": {
                    value: JSON.stringify({ msg: 'Hi' })
                }
            }
        })

        expect(response.statusCode).toEqual(201)
        expect(response.data).toEqual(JSON.stringify({ msg: 'Hi', id: 101 }, null, 2))
    })

    it('should allow to connect secure server', async () => {
        const request = new RestExecutor()

        const response = await request.send({
            url: {
                raw: 'https://localhost:3002/api/http/methods'
            },
            _meta: {
                id: '',
                collection_id: ''
            },
            meta: {
                active_body_type: ERestBodyTypes.NoBody,
                name: '',
                type: ERequestTypes.Rest,
                version: '2.0.0'
            },
            method: EHttpMethod.GET,
            config: {
                reject_unauthorized: false
            }
        })

        expect(response.statusCode).toEqual(200)
    })

    it('should not allow to connect secure server', async () => {
        const request = new RestExecutor()

        await request.send({
            url: {
                raw: 'https://localhost:3002/api/http/methods'
            },
            _meta: {
                id: '',
                collection_id: ''
            },
            meta: {
                active_body_type: ERestBodyTypes.NoBody,
                name: '',
                type: ERequestTypes.Rest,
                version: '2.0.0'
            },
            method: EHttpMethod.GET,
            config: {
                reject_unauthorized: true
            }
        }).catch(error => {
            expect(error.message).toEqual('certificate has expired')
        })
    })
})