interface ISizeInfo {
    curlParameter: string
    parameter: string
    description: string
    value: number
    unit: 'B'
}

export interface ICurlRequestSizeInfo {
    RESPONSE: Array<ISizeInfo>
    REQUEST: Array<ISizeInfo>
}

export interface ICurlRequestTimeInfo {
    curlEvent: string
    event: string
    description: string
    parameter?: string
    unit: 'ms'
    time: number
    percentage?: number
}

export interface ICurlRequestNetworkInfo {
    curlParameter: string
    parameter: string
    description: string
    value: any
}