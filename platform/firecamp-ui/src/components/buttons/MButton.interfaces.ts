import { ButtonProps } from '@mantine/core';

export interface IButton extends ButtonProps {
  //TODO: remove the prop & update its usage
  withCaret?: boolean;
  //TODO: remove the prop & update its usage
  tooltip?: string;

  uppercase?: boolean;

  // props need to update wherever Button is used

  //short props (with priority)
  text?: string;
  //TODO: add all sizes props
  md?: boolean;

  //didn't added any update
  primary?: boolean;

  // use mantine props
  iconLeft?: boolean;
  iconRight?: boolean;
  icon?: React.ReactNode;

  //discuss usage
  ghost?: boolean;

  secondary?: boolean;
  danger?: boolean;
  transparent?: boolean;
}
