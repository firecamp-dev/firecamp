import { ETypedArrayView } from '../../common'
import { IRequestItem } from '../../common/request-item'

export enum EMessageBodyType {
  None = 'none',
  Json = 'json',
  File = 'file',
  Text = 'text',
  ArrayBuffer = 'arraybuffer',
  ArrayBufferView = 'arraybufferview',
}

type TValue = string
type TMeta = {
  type: EMessageBodyType
  typedArrayView?: ETypedArrayView
}

export interface IWebSocketMessage extends IRequestItem<TValue, TMeta> { }