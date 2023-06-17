import { TId } from '@firecamp/types';

declare enum ERunnerEvents {
    Start = "start",
    BeforeRequest = "beforeRequest",
    Request = "request",
    Done = "done"
}
interface IRunnerOptions {
    executeRequest: (request: any) => Promise<any>;
    environment?: TId | string;
    globals?: TId | string;
    iterationCount?: number;
    iterationData?: string;
    delayRequest?: number;
    timeout?: number;
    timeoutRequest?: number;
}
declare class Runner {
    private collection;
    private options;
    private requestOrdersForExecution;
    private executedRequestQueue;
    private currentRequestInExecution;
    private testResults;
    private emitter;
    private result;
    constructor(collection: any, options: IRunnerOptions);
    private assignDefaultOptions;
    /**
     * validate that the collection format is valid
     * TODO: late we need to add the zod or json schema here for strong validation
     *
     * @param collection "collection json payload"
     * @returns boolean
     */
    private validate;
    /**
     * prepare an Set of request execution order
     */
    private prepareRequestExecutionOrder;
    private updateResult;
    private executeRequest;
    i: number;
    private start;
    private exposeOnlyOn;
    run(): {
        on: (evt: string, fn: (...a: any[]) => void) => any;
    };
}

export { ERunnerEvents, Runner as default };
