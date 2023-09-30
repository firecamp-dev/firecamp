/**
 * Typed array views have self-descriptive names and provide views for all the usual numeric types like Int8, Uint32, Float64 and so forth. 
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays#typed_array_views
 */
export enum ETypedArrayView {
    Int8Array = 'Int8Array',
    Uint8Array = 'Uint8Array',
    Uint8ClampedArray = 'Uint8ClampedArray',
    Int16Array = 'Int16Array',
    Uint16Array = 'Uint16Array',
    Int32Array = 'Int32Array',
    Uint32Array = 'Uint32Array',
    Float32Array = 'Float32Array',
    Float64Array = 'Float64Array',
    BigInt64Array = 'BigInt64Array',
    BigUint64Array = 'BigUint64Array',
    Default = ''
}