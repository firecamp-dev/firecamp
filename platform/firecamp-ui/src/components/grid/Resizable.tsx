//@ts-nocheck
import { FC } from "react";
import {Resizable} from 're-resizable';
import { IResizable } from './interfaces/Resizable.interfaces';
import classnames from 'classnames';
import './Resizable.scss';

const ResizableCmp: FC<IResizable> = ({
  children = {},
  className = '',
  direction = '',
  left = false,
  right = false,
  top = false,
  bottom = false,
  topRight = false,
  bottomRight = false,
  bottomLeft = false,
  topLeft = false,
  width = '',
  height = '',
  maxHeight = '100%',
  minHeight = '100%',
  maxWidth = '100%',
  minWidth = '100%',
  onResizeStop = _ => { }
}) => {

  return (
    <Resizable
      defaultSize={{ width: width, height: height }}
      enable={{
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        topRight: topRight,
        bottomRight: bottomRight,
        bottomLeft: bottomLeft,
        topLeft: topLeft
      }}
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      className={classnames('fc-col-resizer' ,className, {'left': left}, {'right': right}, {'bottom': bottom}, {'top': top})}
      onResizeStop={onResizeStop}
    >
      {children || ''}
    </Resizable>
  );
};

export default ResizableCmp;
