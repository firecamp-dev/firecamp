import { FC } from 'react';

import { MantineColor, Tooltip as MantineToolTip } from '@mantine/core';
import { ArrowPosition, FloatingPosition } from '@mantine/core/lib/Floating';

interface IToolTip {
  arrowOffset?: number;
  arrowPosition?: ArrowPosition;
  arrowRadius?: number;
  arrowSize?: number;
  children: React.ReactNode;
  closeDelay?: number;
  color?: MantineColor;
  disabled?: boolean;
  events?: {
    hover: boolean;
    focus: boolean;
    touch: boolean;
  };
  label: React.ReactNode;
  multiline?: boolean;
  offset?: number;
  openDelay?: number;
  postition?: FloatingPosition;
  withArrow?: boolean;
}

const ToolTip: FC<IToolTip> = ({ label, children, ...props }) => {
  return (
    <MantineToolTip label={label} {...props}>
      {children}
    </MantineToolTip>
  );
};

export default ToolTip;
