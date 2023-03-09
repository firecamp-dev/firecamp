import React, { FC } from 'react';
import ProgressBar from '../progress-bar/ProgressBar';
import './Loader.scss';

const Loader: FC<any> = () => {
  return (
    <>
      <ProgressBar active={true} />
      <div className="flex w-16 items-center text-appForegroundInActive loader">
        Loading<span className="wave-loader overflow-hidden">...</span>
      </div>
    </>
  );
};

export default Loader;
