import { FC } from "react";
import cx from 'classnames';
import './ProgressBar.scss';

// progress illustration to show the action is progressing 
const ProgressBar: FC<IProgressBar> = ({ active= false, short=false }) => {
  if(!active) return <></>;
  return <div className={cx('progress-bar absolute left-0 bottom-0 w-full border-b-2 h-0 z-10 top-0', { 'border-primaryColor': active }, { 'border-transparent': !active },{ 'progressbar-small': short })}/>;
};

export default ProgressBar

export interface IProgressBar {
  // boolean value whether progress bar is active or not.
  active: boolean;

  // show short tail or long tail
  short?: boolean;
}
