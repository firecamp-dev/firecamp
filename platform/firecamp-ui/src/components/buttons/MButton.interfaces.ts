import { ButtonProps } from '@mantine/core';

export interface IButton extends ButtonProps {
  /** button text to show */
  text?: string;

  /** to update the preview of button with custom primaryColor */
  primary?: boolean;
  /** ghost button */
  ghost?: boolean;
  /** secondary button */
  secondary?: boolean;
  /** danger button */
  danger?: boolean;
  /**  transparent button */
  transparent?: boolean;
  outline?: boolean;

  /** extra small size */
  xs?: boolean;
  /** small size */
  sm?: boolean;
  /** medium size */
  md?: boolean;
  /** large size */
  lg?: boolean;

  /** identifier for button */
  id?: string;
  /** show tooltip on button hover */
  title?: string;
  /** optional click handler */
  onClick?: (event: any) => any | Promise<any> | Promise<void>;
}
