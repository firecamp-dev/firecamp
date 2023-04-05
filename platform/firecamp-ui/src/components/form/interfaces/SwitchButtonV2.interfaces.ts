export interface ISwitchButton {
  className?: string;
  /**
   * Unique identifier for Button.
   */
  id?: string;
  /**
   * Boolean value whether switch button is checked or not.
   */
  checked: boolean;
  /**
   * Function to return switch button boolean state.
   */
  onChange: (value: boolean) => void;
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
}
