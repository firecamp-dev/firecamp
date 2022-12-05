import { ETypedArrayView, EFirecampAgent } from '@firecamp/types';
import { _buffer, _misc } from '@firecamp/utils';

import { IEmitterArgument, EArgumentType } from './types';

/**
 * Function which accept Firecamp request
 * emitter arguments and return actual arguments which
 * will sent over the socket
 
 */
export const parseEmitterArguments = async (
  args: Array<IEmitterArgument>
): Promise<Array<any>> => {
  const result: Array<any> = [];

  for (const { meta, payload } of args) {
    switch (meta.type) {
      case EArgumentType.Number:
        result.push(payload);
        break;
      case EArgumentType.Boolean:
        result.push(payload);
        break;
      case EArgumentType.Text:
        result.push(payload);
        break;
      case EArgumentType.Json:
        try {
          result.push(JSON.parse(payload));
        } catch (error) {
          result.push({
            error: error.message,
          });
        }
        break;
      case EArgumentType.File:
        result.push(payload);
        break;
      case EArgumentType.ArrayBuffer:
        result.push(
          _buffer.strToBuffer(payload, meta.typedArrayView as ETypedArrayView)
        );
        break;
      case EArgumentType.ArrayBufferView:
        result.push(
          _buffer.strToBinary(payload, meta.typedArrayView as ETypedArrayView)
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
          _misc.firecampAgent() === EFirecampAgent.Desktop &&
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
              type: EArgumentType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (typeof arg === 'number') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.Number,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.Number,
                typedArrayView: '',
              },
            });
          }
        } else if (typeof arg === 'boolean') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.Boolean,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.Boolean,
                typedArrayView: '',
              },
            });
          }
        } else if (typeof arg === 'string') {
          try {
            result.push({
              payload: JSON.stringify(JSON.parse(arg), null, 4),
              meta: {
                type: EArgumentType.Json,
                typedArrayView: '',
              },
            });
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.Text,
                typedArrayView: '',
              },
            });
          }
        } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
          const payload = _buffer.bufferToStr(arg, ETypedArrayView.Uint8Array);

          result.push({
            payload,
            meta: {
              type: EArgumentType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (arg instanceof Blob) {
          const payload = await arg.text();

          result.push({
            payload,
            meta: {
              type: EArgumentType.ArrayBuffer,
              typedArrayView: ETypedArrayView.Uint8Array,
            },
          });
        } else if (typeof arg === 'object') {
          const payload = JSON.stringify(arg, null, 4);

          result.push({
            payload,
            meta: {
              type: EArgumentType.Json,
              typedArrayView: '',
            },
          });
        }
      } else {
        result.push({
          payload: '',
          meta: {
            type: EArgumentType.Text,
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
