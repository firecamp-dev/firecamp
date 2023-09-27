import { IAuth, IScript, TId } from '../../common'

export interface IFolder {
    /**
     * folder name
     */
    name: string
    /**
     * folder description
     */
    description?: string
    /**
     * folder level auth configuration.
     */
    auth?: IAuth

    /** folder pre scripts, will execute in sequence before children request execution start */
    preScripts: IScript[],

    /** folder post scripts, will execute in sequence after children request execution completion */
    postScripts: IScript[],

    /**
     * metadata  of the folder
     */
    __meta: {
        /**
         * list of folder ids to maintain sequentially orders
         */
        fOrders?: TId[]
        /**
         * list of request ids within folder/collection to maintain sequentially orders
         */
        rOrders?: TId[]
    },
    /**
     * reference info. of the folder
     */
    __ref: {
        /**
         * folder id
         */
        id: TId
        /**
         * folder collection id
         */
        collectionId: TId
        /**
         * folder parent folder id
         */
        folderId?: TId
        /**
         * folder created date string
         */
        createdAt?: Date | number
        /**
         * user id who created the folder
         */
        createdBy?: TId
        /**
         * folder updated date string
         */
        updatedAt?: Date | number
        /**
         * user id who updated the folder
         */
        updatedBy?: TId
    }
}
