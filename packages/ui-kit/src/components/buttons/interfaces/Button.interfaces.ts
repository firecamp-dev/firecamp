export interface IButton {
  /** identifier for button */
  id?: string;

  /** dd class name to show custom styling */
  className?: string;

  /** button text to show */
  text?: string;

  /** additional icon for button */
  icon?: string | JSX.Element;

  /**  transparent button */
  transparent?: boolean;

  /** ghost button */
  ghost?: boolean;

  /** primary button */
  primary?: boolean;

  /** secondary button */
  secondary?: boolean;

  /** danger button */
  danger?: boolean;

  /** extra small size */
  xs?: boolean;

  /** small size */
  sm?: boolean;

  /** medium size */
  md?: boolean;

  /** large size */
  lg?: boolean;

  /** set icon left side */
  iconLeft?: boolean;

  /** set icon at center */
  iconCenter?: boolean;

  /**set icon right side */
  iconRight?: boolean;

  /** full width */
  fullWidth?: boolean;

  /** text uppercase*/
  uppercase?: boolean;

  /** show animation on click button */
  animation?: boolean;

  /** optional click handler */
  onClick?: (event: any) => any | Promise<any> | Promise<void>;

  /** show caret at end*/
  withCaret?: boolean;

  /** disabled button */
  disabled?: boolean;

  style?: object;

  /** show tooltip on button hover */
  tooltip?: string;
}
