//@ts-nocheck
import { FC } from "react";
import cx from 'classnames';

// make sure to import css scripts in order 1. preflight, 2. mantine Core, 3. tailwind styles
import "../../scss/preflight.css";
import "@mantine/core/styles.css";
import "../../scss/tailwind.scss";

import { IRootContainer } from "./interfaces/RootContainer.interfaces"

/**
 * Container
 * @param id: <type: String>// copy button id
 * @param className: <type: String>,
 * @param children: <type: String>// If user needs to pass children
 * @param style: <type: String>
 * @returns {*}
 * @constructor
 */
const Container: FC<IRootContainer> = ({
  id = '',
  children = '',
  className = '',
  flex = '',
  overflow = '',
  width = '',
  maxWidth = '',
  minWidth = '',
  height = '',
  maxHeight = '',
  minHeight = '',
  style = {}
}): any => {
  return (
    <div id={id} className={cx('flex pl-0 pr-0 flex-col m-0 w-full max-w-full', className)} style={{
      flex,
      overflow,
      width,
      maxWidth,
      minWidth,
      height,
      maxHeight,
      minHeight,
      ...style
    }}>
      {children}
    </div>
  );
};

export default Container;

