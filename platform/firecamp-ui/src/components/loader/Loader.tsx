import React, { FC } from 'react';
import ProgressBar from '../progress-bar/ProgressBar';
import './Loader.scss';

const Loader: FC<{ message?: string }> = ({ message = 'Loading' }) => {
  return (
    <>
      <ProgressBar active={true} />
      <div className="flex w-full items-center text-appForegroundInActive loader">
        {message}
        <span className="wave-loader overflow-hidden">...</span>
      </div>
    </>
  );
};

export default Loader;
