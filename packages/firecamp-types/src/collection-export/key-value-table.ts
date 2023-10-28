import { IKeyValueTable } from '..'

// omit reference info. as not require in export payload
export interface KeyValueTable extends Omit<IKeyValueTable, 'id'> { }
