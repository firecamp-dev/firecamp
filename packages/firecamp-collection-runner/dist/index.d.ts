declare class Runner {
    collection: any;
    options: any;
    constructor(collection: any, options: any);
    /**
     * validate that the collection format is valid
     * TODO: late we need to add the zod or json schema here for strong validation
     *
     * @param collection "collection json payload"
     * @returns boolean
     */
    private validate;
    run(): Promise<void>;
}

export { Runner as default };
