import { TId } from "@firecamp/types";
import RestExecutor from '@firecamp/rest-executor';


export default class Runner {

    private collection: any;
    private options: any;
    private requestOrdersForExecution: Set<TId>;
    constructor(collection, options) {
        this.collection = collection;
        this.options = options;
        this.requestOrdersForExecution = new Set();
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

    async run() {

        console.log('I am into the Runner...')

        try { this.validate() } catch (e) { throw e }
        this.prepareRequestExecutionOrder();

        const { requests } = this.collection
        /**
         * 1. prepare the request execution orders
         * 2. manage the queue of executed requests
         */


        const executedRequestQueue = new Set();
        const currentRequestInExecution: TId = '';

        const executor = new RestExecutor();
        const it = this.requestOrdersForExecution.values();
        const requestId = it.next().value;
        const request = requests.find(r => r.__ref.id == requestId);
        console.log(request, 'request payload', requestId)

        const res = await executor.send(request, { collectionVariables: [], environment: [], globals: [] });
        //@ts-ignore
        console.log(res.testResult, 'response')

        console.log(this.requestOrdersForExecution, 'requestOrdersForExecution')
    }
}