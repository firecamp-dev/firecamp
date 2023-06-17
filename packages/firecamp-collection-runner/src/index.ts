import EventEmitter from 'eventemitter3';
import { TId } from "@firecamp/types";

const delay = async (ts: number): Promise<void> => {
    return new Promise((rs) => {
        setTimeout(() => {
            rs()
        }, ts)
    })
}

export enum ERunnerEvents {
    Start = 'start',
    BeforeRequest = 'beforeRequest',
    Request = 'request',
    Done = 'done'
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

export default class Runner {

    private collection: any;
    private options: IRunnerOptions;
    private requestOrdersForExecution: Set<TId>;
    private executedRequestQueue: Set<TId>;
    private currentRequestInExecution: TId;
    private testResults: any = [];
    private emitter: EventEmitter;
    private result = {
        total: 0,
        pass: 0,
        fail: 0,
        skip: 0,
        duration: 0
    }

    constructor(collection, options: IRunnerOptions) {
        this.collection = collection;
        this.options = options;
        this.requestOrdersForExecution = new Set();
        this.executedRequestQueue = new Set();
        this.currentRequestInExecution = '';
        this.emitter = new EventEmitter();
        this.validate();
        this.assignDefaultOptions();
    }

    private assignDefaultOptions() {
        if (!this.options.hasOwnProperty('iterationCount')) this.options.iterationCount = 2;
        if (!this.options.hasOwnProperty('delayRequest')) this.options.delayRequest = 0;
        if (!this.options.hasOwnProperty('timeout')) this.options.timeout = 0;
        if (!this.options.hasOwnProperty('timeoutRequest')) this.options.timeoutRequest = 0;


        if (typeof this.options.iterationCount != 'number')
            throw new Error('--iteration-count is invalid', { cause: 'invalidOption' })
        if (typeof this.options.delayRequest != 'number')
            throw new Error('--delay-request is invalid', { cause: 'invalidOption' })
        if (typeof this.options.timeout != 'number')
            throw new Error('--timeout is invalid', { cause: 'invalidOption' })
        if (typeof this.options.timeoutRequest != 'number')
            throw new Error('--timeout-request is invalid', { cause: 'invalidOption' })

    }

    /**
     * validate that the collection format is valid
     * TODO: late we need to add the zod or json schema here for strong validation
     * 
     * @param collection "collection json payload"
     * @returns boolean
     */
    private validate() {
        const { collection: _c, folders: _fs, requests: _rs, requestItems: _ris, __meta } = this.collection
        if (!__meta?.version) throw new Error('The collection format is invalid')
        if (_fs && !Array.isArray(_fs)) throw new Error('The collection\'s folders format is invalid')
        if (_rs && !Array.isArray(_rs)) throw new Error('The collection\'s requests format is invalid')
        if (_ris && !Array.isArray(_ris)) throw new Error('The collection\'s request items format is invalid')
        return true;
    }

    /**
     * prepare an Set of request execution order
     */
    private prepareRequestExecutionOrder() {
        const { collection, folders } = this.collection
        const { __meta: { fOrders: rootFolderIds = [], rOrders: rootRequestIds = [] } } = collection

        const extractRequestIdsFromFolder = (fId: TId, requestIds: TId[] = []) => {
            const folder = folders.find(f => f.__ref.id == fId);
            if (!folder) return requestIds;
            if (folder.__meta.fOrders?.length) {
                const rIds = folder.__meta.fOrders.map(fId => extractRequestIdsFromFolder(fId, requestIds))
                requestIds = [...requestIds, ...rIds]
            }
            if (folder.__meta.rOrders?.length) {
                requestIds = [...requestIds, ...folder.__meta.rOrders]
            }
            return requestIds;
        }

        if (Array.isArray(rootFolderIds)) {
            rootFolderIds.map(fId => {
                const requestIds = extractRequestIdsFromFolder(fId)
                // console.log(requestIds, fId)
                requestIds.forEach(this.requestOrdersForExecution.add, this.requestOrdersForExecution);
            });
        }
        if (Array.isArray(rootRequestIds)) {
            rootRequestIds.forEach(this.requestOrdersForExecution.add, this.requestOrdersForExecution);
        }
    }

    private updateResult(response: any = {}) {
        const { testResult: { total, passed, failed } = {
            total: 0, passed: 0, failed: 0
        } } = response
        if (Number.isInteger(total)) this.result.total += total;
        if (Number.isInteger(passed)) this.result.pass += passed;
        if (Number.isInteger(failed)) this.result.fail += failed;
    }

    private async executeRequest(requestId: TId) {
        const { folders, requests } = this.collection;
        const request = requests.find(r => r.__ref.id == requestId);

        /** emit 'beforeRequest' event just before request execution start */
        this.emitter.emit(ERunnerEvents.BeforeRequest, {
            name: request.__meta.name,
            url: request.url.raw,
            method: request.method.toUpperCase(),
            path: fetchRequestPath(folders, request),
            id: request.__ref.id
        });

        await delay(this.options.delayRequest);
        const response = await this.options.executeRequest(request);
        this.updateResult(response)
        /** emit 'request' event on request execution completion */
        this.emitter.emit(ERunnerEvents.Request, {
            id: request.__ref.id,
            response
        });
        return { request, response };
    }

    i = 0;
    private async start() {
        try {
            const { value: requestId, done } = this.requestOrdersForExecution.values().next();
            // if (this.i > 0) return
            this.i = this.i + 1
            if (!done) {
                this.currentRequestInExecution = requestId;
                const res = await this.executeRequest(requestId);
                this.testResults.push(res);
                this.executedRequestQueue.add(requestId);
                this.requestOrdersForExecution.delete(requestId);
                await this.start();
            }

        }
        catch (error) {
            console.error(`Error while running the collection:`, error);
            // await this.start(); // Retry fetching info for the remaining IDs even if an error occurred
        }

    }

    private exposeOnlyOn() {
        return {
            on: (evt: string, fn: (...a) => void) => {
                this.emitter.on(evt, fn)
                return this.exposeOnlyOn()
            }
        }
    }

    run() {

        this.prepareRequestExecutionOrder();

        setTimeout(async () => {

            const { collection } = this.collection;

            const startTs: number = new Date().valueOf();
            /** emit 'start' event on runner start */
            this.emitter.emit(ERunnerEvents.Start, {
                name: collection.name,
                id: collection.__ref.id
            });

            for (let i = 0; i < this.options.iterationCount; i++) {
                await this.start();
                console.log(i, '----')
            }

            /** emit 'done' event once runner iterations are completed */
            this.result.duration = new Date().valueOf() - startTs;
            this.emitter.emit(ERunnerEvents.Done, {
                result: {
                    ...this.result,
                }
            });
        });

        // return this.testResults;
        return this.exposeOnlyOn()
    }
}


const fetchRequestPath = (folders, request) => {
    const requestPath = [];
    const requestFolderId = request.__ref.folderId;
    let currentFolder = folders.find(folder => folder.__ref.id === requestFolderId);
    while (currentFolder) {
        requestPath.unshift(currentFolder.name); // add the folder name at the beginning of the path
        const parentFolderId = currentFolder.__ref.folderId;
        currentFolder = folders.find(folder => folder.__ref.id === parentFolderId);
    }
    return `./${requestPath.join('/')}`;
}