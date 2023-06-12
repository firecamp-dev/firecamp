declare class Runner {
    private collection;
    private options;
    private requestOrdersForExecution;
    private executedRequestQueue;
    private currentRequestInExecution;
    private testResults;
    constructor(collection: any, options: any);
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
    private executeRequest;
    private executeRequestRecursively;
    run(): Promise<any>;
}

export { Runner as default };
