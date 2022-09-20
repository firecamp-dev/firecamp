//@ts-nocheck
import { FC } from 'react';
import { IResStatus } from './interfaces/ResStatus.interfaces';
import * as Rs from '../../response/common/responseStatus.json';
let Statuses: { [key: string]: any } = Rs;

const ResStatus: FC<IResStatus> = ({
  className = '',
  statusCode = '',
  statusMessage = '',
  isRequestRunning = false,
}) => {
  if (isRequestRunning) return <span />;
  return (
    <div className={className ? className : 'mx-2 leading-5 whitespace-pre'}>
      <span className={`text-warning text-xl status` + statusCode}>
        {statusCode}
      </span>{' '}
      {statusMessage || Statuses[statusCode]?.text || ''}
    </div>
  );
};

export default ResStatus;
