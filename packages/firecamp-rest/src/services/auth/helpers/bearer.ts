import { IAuthBearer } from '@firecamp/types';

export default ({ token, prefix }: IAuthBearer): string => {
  let _p = 'Bearer';
  if (typeof prefix === 'string' && prefix?.length) _p = prefix;
  return `${_p} ${token}`;
};
