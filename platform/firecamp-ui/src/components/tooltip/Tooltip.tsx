import { FC } from 'react';

import { MantineColor, Tooltip as MantineTooltip } from '@mantine/core';
import { ArrowPosition, FloatingPosition } from '@mantine/core/lib/Floating';

interface ITooltip {
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
  position?: FloatingPosition;
  withArrow?: boolean;
}

const Tooltip: FC<ITooltip> = ({ label, children, ...props }) => {
  return (
    <MantineTooltip label={label} {...props}>
      {children}
    </MantineTooltip>
  );
};

export default Tooltip;
