/**
 * represents the unique identity of the item
 *
 * here using following lib: https://www.npmjs.com/package/nanoid
 */
type TId = string;
type TPrimitives =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

type TPlainObject = Record<string, TPrimitives>;
type TObjectValue = TPrimitives | TObject | TObjectValue[];
type TObject = { [k: string]: TObjectValue };

export { TId, TObject, TPlainObject };
