import { IRequestItem } from '../../common/request-item'
import { ETypedArrayView } from '../../common/typedArrayView'

export enum EArgumentBodyType {
    None = 'none',
    Json = 'json',
    File = 'file',
    Text = 'text',
    ArrayBuffer = 'arraybuffer',
    ArrayBufferView = 'arraybufferview',
    Number = 'number',
    Boolean = 'boolean'
}
/** socket.io emitter argument */
export interface IArgument {
    body: string | number | boolean
    __meta: {
        type: EArgumentBodyType
        typedArrayView?: ETypedArrayView
    }
}

/** socket.io arguments list */
type TValue = IArgument[]
type TMeta = {
    /**
     * emitter label, extra info.
     */
    label?: string
    /**
     * default: false, whether ack return by server or not
     */
    ack?: boolean
}

export interface ISocketIOEmitter extends IRequestItem<TValue, TMeta> { }