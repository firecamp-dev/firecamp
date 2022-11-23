import {
  IWebSocketMessage,
  EMessageBodyType,
  EEnvelope,
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
export const parseMessage = ({ body, __meta }: IWebSocketMessage): any => {
  switch (__meta.type) {
    case EMessageBodyType.Text:
      return body;
    case EMessageBodyType.Json:
      return body;
    case EMessageBodyType.File:
      return body;
    case EMessageBodyType.ArrayBuffer:
      return _buffer.strToBuffer(body, __meta.envelope);
    case EMessageBodyType.ArrayBufferView:
      return _buffer.strToBinary(body, __meta.envelope);
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
): Promise<IWebSocketResponseMessage | any> => {
  let body: any;

  try {
    if (arg) {
      if (
        _misc.firecampAgent() === EFirecampAgent.desktop &&
        Buffer.isBuffer(arg) &&
        arg.length > 0
      ) {
        body = _buffer.bufferToStr(arg, EEnvelope.Uint8Array, true);

        return {
          body,
          meta: {
            type: EMessageBodyType.ArrayBuffer,
            envelope: EEnvelope.Uint8Array,
          },
        };
      } else if (typeof arg === 'string') {
        try {
          return {
            body: JSON.stringify(JSON.parse(arg), null, 4),
            meta: {
              type: EMessageBodyType.Json,
            },
          };
        } catch (error) {
          return {
            body: arg,
            meta: {
              type: EMessageBodyType.Text,
            },
          };
        }
      } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
        body = _buffer.bufferToStr(arg, EEnvelope.Uint8Array);

        return {
          body,
          meta: {
            type: EMessageBodyType.ArrayBuffer,
            envelope: EEnvelope.Uint8Array,
          },
        };
      } else if (arg instanceof Blob) {
        body = await arg.text();

        return {
          body,
          meta: {
            type: EMessageBodyType.ArrayBuffer,
            envelope: EEnvelope.Uint8Array,
          },
        };
      } else if (typeof arg === 'object') {
        body = JSON.stringify(arg, null, 4);

        return {
          body,
          meta: {
            type: EMessageBodyType.Json,
          },
        };
      }
    } else {
      body = '';

      return {
        body,
        meta: {
          type: EMessageBodyType.Text,
        },
      };
    }
  } catch (e) {
    throw new Error('Failed to parse the response message');
  }
};
