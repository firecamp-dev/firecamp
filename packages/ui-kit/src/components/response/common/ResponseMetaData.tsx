import { FC } from 'react';
import { ResStatus, ResSize, ResTime } from '@firecamp/ui-kit';

const ResponseMetaData: FC<any> = ({
  isRequestRunning,
  duration,
  size,
  statusCode ,
  statusMessage
}) => {

  return (
    <div className="flex flex-1 cursor-pointer">
      <div className="ml-auto flex text-appForegroundInActive text-sm leading-5">
        <ResStatus
          statusCode={statusCode}
          statusMessage={statusMessage}
          isRequestRunning={isRequestRunning}
        />
        <ResTime duration={duration} isRequestRunning={isRequestRunning} />
        <ResSize size={size} isRequestRunning={isRequestRunning} />
      </div>
    </div>
  );
};

export default ResponseMetaData;
