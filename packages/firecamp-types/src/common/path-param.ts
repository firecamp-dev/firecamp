import { IKeyValueTable } from './key-value-table'


/**
 * Path parameters are variable parts of a URL path. They are typically used to point to a specific
 * resource within a collection, such as a user identified by ID. A URL can have several path parameters,
 * each denoted by preceding ':'
 */
export interface IPathParam extends IKeyValueTable { }