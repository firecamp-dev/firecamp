import { TId, TObject } from "@firecamp/types";


export default class Runner {

    collection: any;
    options: any;
    constructor(collection, options) {
        this.collection = collection;
        this.options = options;
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

    async run() {

    console.log('I am into the Runner...')

        try { this.validate() } catch (e) { throw e }

        /**
         * 1. prepare the request execution orders
         * 2. manage the queue of executed requests
         */

        const requestOrdersForExecution = new Set();
        const executedRequestQueue = new Set();
        const currentRequestInExecution: TId = '';

        const { __meta: { fOrders: rootFolderIds = [], rOrders: rootRequestIds = [] } } = this.collection
        if (Array.isArray(rootFolderIds)) {
            rootFolderIds.forEach(folderId => {

            })
        }
    }
}