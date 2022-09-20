import { IAuthBasic } from '@firecamp/types';

export default ({ username, password }: IAuthBasic): string => {
  const buffer = Buffer.from(`${username}:${password}`, 'base64');

  return `Basic ${buffer.toString('base64')}`;
};
