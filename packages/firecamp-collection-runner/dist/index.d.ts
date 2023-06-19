import { TId } from '@firecamp/types';

declare enum ERunnerEvents {
    Start = "start",
    BeforeRequest = "beforeRequest",
    Request = "request",
    BeforeFolder = "beforeFolder",
    Folder = "folder",
    BeforeIteration = "beforeIteration",
    Iteration = "iteration",
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
    private folderRunSequence;
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
    private prepareFolderRunSequence;
    private updateResult;
    private runRequest;
    private runFolder;
    private runRootRequests;
    private runIteration;
    run(): {
        on: (evt: string, fn: (...a: any[]) => void) => any;
    };
    private exposeOnlyOn;
}

export { ERunnerEvents, IRunnerOptions, Runner as default };
