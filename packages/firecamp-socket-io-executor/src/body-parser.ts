import {
  ETypedArrayView,
  EFirecampAgent,
  ISocketIOEmitter,
  EArgumentBodyType,
} from '@firecamp/types';
import { _buffer, _misc } from '@firecamp/utils';

/** parse emitter arguments and return args ready to be sent over socket connection */
export const parseEmitterArguments = async (
  args: ISocketIOEmitter['value']
): Promise<ISocketIOEmitter['value']> => {
  const result: any[] = [];
  for (const { __meta, body } of args) {
    switch (__meta.type) {
      case EArgumentBodyType.File:
      case EArgumentBodyType.Number:
      case EArgumentBodyType.Boolean:
      case EArgumentBodyType.Text:
        result.push(body);
        break;
      case EArgumentBodyType.Json:
        try {
          result.push(JSON.parse(body.toString()));
        } catch (e) {
          console.log(e); //TODO: handle it to show an error
        }
        break;
      case EArgumentBodyType.ArrayBuffer:
        result.push(
          _buffer.strToBuffer(
            body.toString(),
            __meta.typedArrayView as ETypedArrayView
          )
        );
        break;
      case EArgumentBodyType.ArrayBufferView:
        result.push(
          _buffer.strToBinary(
            body.toString(),
            __meta.typedArrayView as ETypedArrayView
          )
        );
        break;
      default:
    }
  }
  return result;
};

/**
 * Parse arguments received from the socket connection and
 * convert them into the Firecamp request emitter arguments
 */
export const parseListenerData = async (args: Array<any>): Promise<any> => {
  const result: Array<any> = [];

  try {
    for await (const arg of args) {
      if (typeof arg == 'undefined') {
        result.push({
          value: '',
          type: EArgumentBodyType.Text,
        });
      } else if (
        _misc.firecampAgent() == EFirecampAgent.Desktop &&
        Buffer.isBuffer(arg) &&
        arg.length > 0
      ) {
        const body = _buffer.bufferToStr(arg, ETypedArrayView.Uint8Array, true);
        result.push({
          value: body,
          type: EArgumentBodyType.ArrayBuffer,
        });
      } else if (typeof arg === 'number') {
        result.push({
          value: arg,
          type: EArgumentBodyType.Number,
        });
      } else if (typeof arg === 'boolean') {
        result.push({
          value: arg,
          type: EArgumentBodyType.Boolean,
        });
      } else if (typeof arg === 'string') {
        try {
          const json = JSON.stringify(JSON.parse(arg), null, 4);
          result.push({
            value: json,
            type: EArgumentBodyType.Json,
          });
        } catch (e) {
          result.push({
            value: arg,
            type: EArgumentBodyType.Text,
          });
        }
      } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
        const body = _buffer.bufferToStr(arg, ETypedArrayView.Uint8Array);

        result.push({
          value: body,
          type: EArgumentBodyType.ArrayBuffer,
          typedArrayView: ETypedArrayView.Uint8Array,
        });
      } else if (arg instanceof Blob) {
        const body = await arg.text();
        result.push({
          value: body,
          type: EArgumentBodyType.ArrayBuffer,
          typedArrayView: ETypedArrayView.Uint8Array,
        });
      } else if (typeof arg === 'object') {
        const body = JSON.stringify(arg, null, 4);
        result.push({
          value: body,
          type: EArgumentBodyType.Json,
        });
      }
    }
    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject('Something went wrong!');
  }
};
