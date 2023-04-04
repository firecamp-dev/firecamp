import {
  ETypedArrayView,
  EFirecampAgent,
  ISocketIOEmitter,
  EArgumentBodyType,
} from '@firecamp/types';
import { _buffer, _misc } from '@firecamp/utils';

/**
 * Function which accept Firecamp request
 * emitter arguments and return actual arguments which
 * will sent over the socket
 
 */
export const parseEmitterArguments = async (
  args: ISocketIOEmitter['value'][]
): Promise<Array<any>> => {
  const result: Array<any> = [];

  //@ts-ignore //TODO: review it with types
  for (const { __meta, body } of args) {
    switch (__meta.type) {
      case EArgumentBodyType.Number:
        result.push(body);
        break;
      case EArgumentBodyType.Boolean:
        result.push(body);
        break;
      case EArgumentBodyType.Text:
        result.push(body);
        break;
      case EArgumentBodyType.Json:
        try {
          result.push(JSON.parse(body));
        } catch (error) {
          result.push({
            error: error.message,
          });
        }
        break;
      case EArgumentBodyType.File:
        result.push(body);
        break;
      case EArgumentBodyType.ArrayBuffer:
        result.push(
          _buffer.strToBuffer(body, body.typedArrayView as ETypedArrayView)
        );
        break;
      case EArgumentBodyType.ArrayBufferView:
        result.push(
          _buffer.strToBinary(body, __meta.typedArrayView as ETypedArrayView)
        );
        break;
      default:
    }
  }

  return result;
};

/**
 * Parse arguments received from the socket and
 * convert into the Firecamp request emitter arguments
 * TODO: Promise should manage with for...await
 * @param arg
 * @returns
 */
export const parseListenerData = async (args: Array<any>): Promise<any> => {
  const result: Array<any> = [];

  try {
    for await (const arg of args) {
      if (typeof arg !== 'undefined') {
        if (
          _misc.firecampAgent() == EFirecampAgent.Desktop &&
          Buffer.isBuffer(arg) &&
          arg.length > 0
        ) {
          const payload = _buffer.bufferToStr(
            arg,
            ETypedArrayView.Uint8Array,
            true
          );

          result.push({
            payload,
            meta: {
              type: EArgumentBodyType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (typeof arg === 'number') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentBodyType.Number,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentBodyType.Number,
                typedArrayView: '',
              },
            });
          }
        } else if (typeof arg === 'boolean') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentBodyType.Boolean,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentBodyType.Boolean,
                typedArrayView: '',
              },
            });
          }
        } else if (typeof arg === 'string') {
          try {
            result.push({
              payload: JSON.stringify(JSON.parse(arg), null, 4),
              meta: {
                type: EArgumentBodyType.Json,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentBodyType.Text,
                typedArrayView: '',
              },
            });
          }
        } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
          const payload = _buffer.bufferToStr(arg, ETypedArrayView.Uint8Array);

          result.push({
            payload,
            meta: {
              type: EArgumentBodyType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (arg instanceof Blob) {
          const payload = await arg.text();

          result.push({
            payload,
            meta: {
              type: EArgumentBodyType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (typeof arg === 'object') {
          const payload = JSON.stringify(arg, null, 4);

          result.push({
            payload,
            meta: {
              type: EArgumentBodyType.Json,
              typedArrayView: '',
            },
          });
        }
      } else {
        result.push({
          payload: '',
          meta: {
            type: EArgumentBodyType.Text,
            typedArrayView: '',
          },
        });
      }
    }

    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject('Something went wrong!');
  }
};
