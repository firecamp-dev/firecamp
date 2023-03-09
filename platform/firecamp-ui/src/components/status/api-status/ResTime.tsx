import { FC, useState, useRef, useEffect } from 'react';
import { IResTime } from './interfaces/ResTime.interfaces';

const ResTime: FC<IResTime> = ({
  className = '',
  time: propTime = '',
  isRequestRunning = false,
}) => {
  let [time, setTime] = useState(propTime);
  let intervalId = useRef(null);

  let interval_span = 3;
  useEffect(() => {
    let ms = 0;
    let interval: string | number | NodeJS.Timer;
    if (isRequestRunning) {
      interval = setInterval(() => {
        ms = ms + interval_span;
        setTime(++ms);
      }, interval_span);
      intervalId.current = interval;
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      if (propTime) {
        setTimeout(() => {
          setTime(propTime);
        });
      }
    }

    return () => {
      setTime(0);
      clearInterval(interval);
    };
  }, [isRequestRunning]);

  if (time === undefined && !isRequestRunning) return <span />;
  return (
    <div className={className ? className : 'mx-2 leading-5 whitespace-pre'}>
      <span className="text-error text-xl">{time || '0'}</span> ms
    </div>
  );
};

export default ResTime;
