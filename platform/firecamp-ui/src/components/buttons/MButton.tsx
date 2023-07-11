import { FC } from 'react';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button as MantineButton } from '@mantine/core';
import { IButton } from './MButton.interfaces';

const Button: FC<IButton> = ({
  text,
  md,
  secondary,
  danger,
  withCaret = false,
  tooltip,
  uppercase,

  primary,
  iconLeft,
  iconRight,
  ghost,

  transparent,
  icon,
  ...props
}) => {
  let variant = undefined;
  if (secondary) variant = 'white';
  else if (transparent) variant = 'outline';
  return (
    <MantineButton
      size={md ? 'sm' : undefined}
      variant={variant}
      color={danger ? 'red' : undefined}
      leftIcon={iconLeft ? icon : undefined}
      rightIcon={
        withCaret ? (
          <VscTriangleDown className="ml-2 toggle-arrow" size={12} />
        ) : iconRight ? (
          icon
        ) : undefined
      }
      title={tooltip}
      classNames={{
        label: uppercase ? 'uppercase' : undefined,
      }}
      {...props}
    >
      {text}
    </MantineButton>
  );
};
export default Button;
