import { FC } from 'react';
import { ResStatus, ResSize, ResTime } from '@firecamp/ui';

const ResponseMetaData: FC<any> = ({
  isRequestRunning,
  time,
  size,
  code ,
  status
}) => {

  return (
    <div className="flex flex-1 cursor-pointer">
      <div className="ml-auto flex text-app-foreground-inactive text-sm leading-5">
        <ResStatus
          code={code}
          status={status}
          isRequestRunning={isRequestRunning}
        />
        <ResTime time={time} isRequestRunning={isRequestRunning} />
        <ResSize size={size} isRequestRunning={isRequestRunning} />
      </div>
    </div>
  );
};

export default ResponseMetaData;
