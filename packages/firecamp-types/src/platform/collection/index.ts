import { EVariableType, IAuth, IKeyValueTable, IScript, TId } from '../../common'

export interface ICollection {
    /**
     * collection name
     */
    name: string
    /**
     * collection description
     */
    description?: string
    /**
     * collection level auth configuration.
     * note: inherit option is not available in collection auth
     */
    auth?: IAuth

    /** collection pre scripts, will execute in sequence before children request execution start */
    preScripts: IScript[]

    /** collection post scripts, will execute in sequence after children request execution completion */
    postScripts: IScript[]

    /** collection variables will be applied to all entity of that collection */
    variables: IKeyValueTable<EVariableType>[]

    /**
     * metadata about the collection
     */
    __meta: {

        /**
         * collection active environment id
         */
        activeEnv?: TId
        /**
         * collection root folders sequence orders list
         */
        fOrders?: TId[]
        /**
         * collection root requests orders list
         */
        rOrders?: TId[]
    },
    /**
     * reference info. of the collection
     */
    __ref: {
        /**
         * collection id
         */
        id: TId
        /**
         * collection workspace id
         */
        workspaceId: TId
        /**
         * collection created date string
         */
        createdAt?: Date | number
        /**
         * user id who created the collection
         */
        createdBy?: string
        /**
         * collection updated date string
         */
        updatedAt?: Date | number
        /**
         * user id who updated the collection
         */
        updatedBy?: string
    }
}