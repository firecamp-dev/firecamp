import {
  IWebSocketMessage,
  EMessageBodyType,
  ETypedArrayView,
  EFirecampAgent,
} from '@firecamp/types';
import { _buffer, _misc } from '@firecamp/utils';
import { IWebSocketResponseMessage } from './types';

/**
 * Function which accept Firecamp request
 * message and return actual message which
 * will sent over the socket
 *
 * @param param
 * @returns
 */
export const parseMessage = ({
  value,
  __meta = {
    type: EMessageBodyType.Text,
    typedArrayView: ETypedArrayView.Default,
  },
}: Partial<IWebSocketMessage>): any => {
  switch (__meta.type) {
    case EMessageBodyType.Text:
      return value;
    case EMessageBodyType.Json:
      return value;
    case EMessageBodyType.File:
      return value;
    case EMessageBodyType.ArrayBuffer:
      return _buffer.strToBuffer(
        value as string,
        __meta.typedArrayView || ETypedArrayView.Default
      );
    case EMessageBodyType.ArrayBufferView:
      return _buffer.strToBinary(
        value as string,
        __meta.typedArrayView || ETypedArrayView.Default
      );
    default:
      return '';
  }
};

/**
 * parse message received from the socket and
 * convert into the Firecamp request message
 */
export const parseReceivedMessage = async (
  arg: any
): Promise<IWebSocketResponseMessage> => {
  let value: string;
  try {
    if (arg) {
      if (
        _misc.firecampAgent() == EFirecampAgent.Desktop &&
        Buffer.isBuffer(arg) &&
        arg.length > 0
      ) {
        value = _buffer.bufferToStr(
          arg,
          ETypedArrayView.Uint8Array,
          true
        ) as string;

        return {
          value,
          __meta: {
            type: EMessageBodyType.ArrayBuffer,
            typedArrayView: ETypedArrayView.Uint8Array,
          },
        };
      } else if (typeof arg === 'string') {
        try {
          return {
            value: JSON.stringify(JSON.parse(arg), null, 4),
            __meta: {
              type: EMessageBodyType.Json,
            },
          };
        } catch (error) {
          return {
            value: arg,
            __meta: {
              type: EMessageBodyType.Text,
            },
          };
        }
      } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
        value = _buffer.bufferToStr(arg, ETypedArrayView.Uint8Array);
        return {
          value,
          __meta: {
            type: EMessageBodyType.ArrayBuffer,
            typedArrayView: ETypedArrayView.Uint8Array,
          },
        };
      } else if (arg instanceof Blob) {
        value = await arg.text();
        return {
          value,
          __meta: {
            type: EMessageBodyType.ArrayBuffer,
            typedArrayView: ETypedArrayView.Uint8Array,
          },
        };
      } else if (typeof arg === 'object') {
        value = JSON.stringify(arg, null, 4);
        return {
          value,
          __meta: {
            type: EMessageBodyType.Json,
          },
        };
      }
    } else {
      return {
        value: '',
        __meta: {
          type: EMessageBodyType.Text,
        },
      };
    }
  } catch (e) {
    throw new Error('Failed to parse the response message');
  }
  return {
    value: '',
    __meta: {
      type: EMessageBodyType.Text,
    },
  };
};
