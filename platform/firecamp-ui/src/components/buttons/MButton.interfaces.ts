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

  /** extra small size */
  xs?: boolean;
  /** small size */
  sm?: boolean;
  /** medium size */
  md?: boolean;
  /** large size */
  lg?: boolean;
}
