import { IAuthBearer } from '@firecamp/types';

export default (credentials: IAuthBearer): string => {
  let prefix = 'Bearer';

  if (typeof prefix === 'string' && prefix.length) prefix = credentials.prefix;

  return `${prefix} ${credentials.token || ''}`;
};
