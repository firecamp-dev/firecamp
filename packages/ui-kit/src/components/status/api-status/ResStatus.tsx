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
  let statusClass = "text-info";
  if(code>199 && code <300) statusClass = 'text-success';
  if(code>299 && code <399) statusClass = 'text-warning';
  if(code>399 && code <600) statusClass = 'text-error';

  return (
    <div className={className ? className : 'mx-2 leading-5 whitespace-pre'}>
      <span className={`${statusClass} text-xl`}>
        {code}
      </span>{' '}
      {status || Statuses[code]?.text || ''}
    </div>
  );
};

export default ResStatus;
