import { IEmitterArgument } from './types'
import { EArgumentType } from './constants'
import { EEnvelope, EFirecampAgent } from '@firecamp/types'
import { _buffer, _misc } from '@firecamp/utils'

/**
 * Function which accept Firecamp request
 * emitter arguments and return actual arguments which 
 * will sent over the socket
 * 
 * @param args 
 * @returns 
 */
export const parseEmitterArguments = async (args: Array<IEmitterArgument>): Promise<Array<any>> => {

  const result: Array<any> = []

  for (const { meta, payload } of args) {
    switch (meta.type) {
      case EArgumentType.NUMBER:
        result.push(payload)
        break
      case EArgumentType.BOOLEAN:
        result.push(payload)
        break
      case EArgumentType.TEXT:
        result.push(payload)
        break
      case EArgumentType.JSON:
        try {
          result.push(JSON.parse(payload))
        } catch (error) {
          result.push({
            error: error.message
          })
        }
        break
      case EArgumentType.FILE:
        result.push(payload)
        break
      case EArgumentType.ARRAY_BUFFER:
        result.push(_buffer.strToBuffer(payload, meta.envelope as EEnvelope))
        break
      case EArgumentType.ARRAY_BUFFER_VIEW:
        result.push(_buffer.strToBinary(payload, meta.envelope as EEnvelope))
        break
      default:
    }
  }

  return result
}

/**
 * Parse arguments received from the socket and
 * convert into the Firecamp request emitter arguments
 * TODO: Promise should manage with for...await
 * @param arg 
 * @returns 
 */
export const parseListenerData = async (args: Array<any>): Promise<any> => {
  const result: Array<any> = []

  try {
    for await (const arg of args) {
      if (typeof arg !== 'undefined') {
        if (_misc.firecampAgent() === EFirecampAgent.desktop &&
          Buffer.isBuffer(arg) &&
          arg.length > 0) {
          const payload = _buffer.bufferToStr(arg, EEnvelope.Uint8Array, true)

          result.push({
            payload,
            meta: {
              type: EArgumentType.ARRAY_BUFFER,
              envelope: EEnvelope.Uint8Array
            }
          })
        }
        else if (typeof arg === 'number') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.NUMBER,
                envelope: ''
              }
            })
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.NUMBER,
                envelope: ''
              }
            })
          }
        }
        else if (typeof arg === 'boolean') {
          try {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.BOOLEAN,
                envelope: ''
              }
            })
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.BOOLEAN,
                envelope: ''
              }
            })
          }
        }
        else if (typeof arg === 'string') {
          try {
            result.push({
              payload: JSON.stringify(JSON.parse(arg), null, 4),
              meta: {
                type: EArgumentType.JSON,
                envelope: ''
              }
            })
          } catch (error) {
            result.push({
              payload: arg,
              meta: {
                type: EArgumentType.TEXT,
                envelope: ''
              }
            })
          }
        } else if (arg instanceof ArrayBuffer && arg.byteLength > 0) {
          const payload = _buffer.bufferToStr(arg, EEnvelope.Uint8Array)

          result.push({
            payload,
            meta: {
              type: EArgumentType.ARRAY_BUFFER,
              envelope: EEnvelope.Uint8Array
            }
          })
        } else if (arg instanceof Blob) {
          const payload = await arg.text()

          result.push({
            payload,
            meta: {
              type: EArgumentType.ARRAY_BUFFER,
              envelope: EEnvelope.Uint8Array
            }
          })
        } else if (typeof arg === 'object') {
          const payload = JSON.stringify(arg, null, 4)

          result.push({
            payload,
            meta: {
              type: EArgumentType.JSON,
              envelope: ''
            }
          })
        }
      } else {
        result.push({
          payload: '',
          meta: {
            type: EArgumentType.TEXT,
            envelope: ''
          }
        })
      }
    }

    return Promise.resolve(result)
  } catch (e) {
    return Promise.reject('Something went wrong!')
  }
}