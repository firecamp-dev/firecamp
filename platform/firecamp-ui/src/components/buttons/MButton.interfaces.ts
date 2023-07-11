import { ButtonProps } from '@mantine/core';

export interface IButton extends ButtonProps {
  /** button text to show */
  text?: string;

  /** text uppercase*/
  uppercase?: boolean;

  /** primary button */
  primary?: boolean;
  /** ghost button */
  ghost?: boolean;
  /** secondary button */
  secondary?: boolean;
  /** danger button */
  danger?: boolean;
  /**  transparent button */
  transparent?: boolean;
  /** to create a transparent button without border & background transparent on hover */
  withoutBorder?: boolean;

  /** extra small size */
  xs?: boolean;
  /** small size */
  sm?: boolean;
  /** medium size */
  md?: boolean;
  /** large size */
  lg?: boolean;

  /** optional click handler */
  onClick?: (event: any) => any | Promise<any> | Promise<void>;
}
