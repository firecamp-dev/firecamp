import { IHeader } from '..'

// omit reference info. as not require in export payload
export interface Header extends Omit<IHeader, 'id'> { }
