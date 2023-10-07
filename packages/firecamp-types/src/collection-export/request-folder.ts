import { IRequestFolder, TId, ERequestTypes } from '..'

export interface RequestFolder extends Omit<IRequestFolder, '__ref'> {
    __ref: {
        id: TId,
        requestId: TId
        folderId?: TId
        requestType: ERequestTypes
    }
}

