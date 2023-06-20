import { TId } from "@firecamp/types";

export enum ERunnerEvents {
    Start = 'start',
    BeforeRequest = 'beforeRequest',
    Request = 'request',
    BeforeFolder = 'beforeFolder',
    Folder = 'folder',
    BeforeIteration = 'beforeIteration',
    Iteration = 'iteration',
    Done = 'done'
}

export interface IRunnerOptions {
    executeRequest: (request: any) => Promise<any>;
    environment?: TId | string;
    globals?: TId | string;
    iterationCount?: number;
    iterationData?: string;
    delayRequest?: number;
    timeout?: number;
    timeoutRequest?: number;
}

type TStats = {
    total: number,
    failed: number
}
export interface IRunStatistics {
    /** stats contains the meta information of every components of run, every component will have 'total' and 'failed' count refs */
    stats: {
        iteration: TStats,
        requests: TStats,
        tests: TStats
    },
    timings: {

        /** total time of the run */
        runDuration: number,

        /** average response time of the run */
        responseAverage: number,

        /** miminum response time of the run */
        responseMin: number,

        /** maximum response time of the run */
        responseMax: number,

        /** standard deviation of response time of the run */
        // responseSd: number,

        /** average DNS lookup time of the run */
        // dnsAverage: number,

        /** minimum DNS lookup time of the run */
        // dnsMin: number,

        /** maximum DNS lookup time of the run */
        // dnsMax: number,

        /** standard deviation of DNS lookup time of the run */
        // dnsSd: number,

        /** average first byte time of the run */
        // firstByteAverage: number,

        /** minimum first byte time of the run */
        // firstByteMin: number,

        /** maximum first byte time of the run */
        // firstByteMax: number,

        /** standard deviation of first byte time of the run */
        // firstByteSd: 0
    },
    transfers: {
        /** total response data received in run */
        responseTotal: 0
    },
}