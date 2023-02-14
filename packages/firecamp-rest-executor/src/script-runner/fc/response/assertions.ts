import { _object } from '@firecamp/utils'
import Ajv from 'ajv'

export default function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    const Assertion = chai.Assertion

    utils.addProperty(Assertion.prototype, 'accepted', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 202,
            `expected response to have a status code 202 but found ${this._obj?.code}`,
            `expected response to not have a status code 202`,
            202,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'badRequest', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 202,
            `expected response to have a status code 400 but found ${this._obj?.code}`,
            `expected response to not have a status code 400`,
            400,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'clientError', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code > 399 && this._obj?.code < 500,
            `expected response to have a status code 4xx but found ${this._obj?.code}`,
            `expected response to not have a status code 4xx`,
            '4xx',
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'forbidden', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 403,
            `expected response to have a status code 403 but found ${this._obj?.code}`,
            `expected response to not have a status code 403`,
            403,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'info', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code > 99 && this._obj?.code < 200,
            `expected response to have a status code 1xx but found ${this._obj?.code}`,
            `expected response to not have a status code 1xx`,
            '1xx',
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'notFound', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 404,
            `expected response to have a status code 404 but found ${this._obj?.code}`,
            `expected response to not have a status code 404`,
            404,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'ok', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 200,
            `expected response to have a status code 200 but found ${this._obj?.code}`,
            `expected response to not have a status code 200`,
            200,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'rateLimited', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 429,
            `expected response to have a status code 429 but found ${this._obj?.code}`,
            `expected response to not have a status code 429`,
            429,
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'redirection', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code > 299 && this._obj?.code < 400,
            `expected response to have a status code 3xx but found ${this._obj?.code}`,
            `expected response to not have a status code 3xx`,
            '3xx',
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'redirection', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code > 499 && this._obj?.code < 600,
            `expected response to have a status code 5xx but found ${this._obj?.code}`,
            `expected response to not have a status code 5xx`,
            '5xx',
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'redirection', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code > 199 && this._obj?.code < 300,
            `expected response to have a status code 2xx but found ${this._obj?.code}`,
            `expected response to not have a status code 2xx`,
            '2xx',
            this._obj?.code
        )
    })

    utils.addProperty(Assertion.prototype, 'rateLimited', function () {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === 401,
            `expected response to have a status code 401 but found ${this._obj?.code}`,
            `expected response to not have a status code 401`,
            401,
            this._obj?.code
        )
    })

    utils.addMethod(Assertion.prototype, 'body', function () {
        this.assert(
            !_object.isEmpty(this._obj.data),
            `expecting request should have body but not found`,
            `expecting request should not have body`,
            this._obj?.body
        )
    })

    utils.addMethod(Assertion.prototype, 'header', function (headerName: string) {
        this.assert(
            !_object.isEmpty(this._obj?.headers) && this._obj.headers?.[headerName],
            `expecting request should have header ${headerName} but not found`,
            `expecting request should not have header ${headerName}`,
            headerName,
            this._obj?.headers
        )
    })

    utils.addMethod(Assertion.prototype, 'jsonBody', function () {
        const isJSON = (data: any) => {
            try {
                JSON.parse(data)

                return true
            } catch (error) {
                return false
            }
        }

        this.assert(
            isJSON(this._obj?.data),
            'expected response should have JSON data but not found',
            'expected response should not have JSON data',
            this._obj?.data
        )
    })

    utils.addMethod(Assertion.prototype, 'jsonSchema', function (schema: any, options: any) {
        const ajv = new Ajv(options)
        const result = ajv.validate(schema, this._obj?.data)

        this.assert(
            result && !ajv.errors,
            `expected response data should validate with JSON schema but found errors: ${ajv.errorsText()}`,
            'expected response data should not validate JSON schema',
            this._obj?.data
        )
    })

    utils.addMethod(Assertion.prototype, 'code', function (code: number) {
        this.assert(
            !Number.isNaN(this._obj?.code) && this._obj?.code === code,
            `expected response to have a status code ${code} but found ${this._obj?.code}`,
            `expected response to not have a status code ${code}`,
            code,
            this._obj?.code
        )
    })
}