import { FC, useState, useEffect } from 'react';
import { setDataUnit } from './helper';
import { IResSize } from './interfaces/ResSize.interfaces';

const ResSize: FC<IResSize> = ({
  className = '',
  size,
  isRequestRunning = false,
}) => {
  if (!size || isRequestRunning) return <span />;

  // console.log(size, '..... size');

  let [sizePayload, setSizePayload] = useState({ value: size, unit: 'B' });

  useEffect(() => {
    let sizeToSet = setDataUnit(size);
    if (sizeToSet !== sizePayload) {
      setSizePayload(sizeToSet);
    }
  }, [size]);

  return (
    <div className={className ? className : 'mx-2 leading-5 whitespace-pre'}>
      <span className="text-info text-xl">{sizePayload?.value}</span>
      {sizePayload?.unit || 'B'}
    </div>
  );
};

export default ResSize;
