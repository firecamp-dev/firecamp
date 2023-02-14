import { FC } from 'react';
import { IResStatus } from './interfaces/ResStatus.interfaces';
import * as Rs from '../../response/common/responseStatus.json';
let Statuses: { [key: string]: any } = Rs;

const ResStatus: FC<IResStatus> = ({
  className = '',
  code,
  status = '',
  isRequestRunning = false,
}) => {
  if (isRequestRunning) return <span />;
  return (
    <div className={className ? className : 'mx-2 leading-5 whitespace-pre'}>
      <span className={`text-warning text-xl status` + code}>
        {code}
      </span>{' '}
      {status || Statuses[code]?.text || ''}
    </div>
  );
};

export default ResStatus;
