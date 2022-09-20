export interface IResizable {
  /**
   * To specify the children to be rendered into Resizable
   */
  children?: Function | JSX.Element | JSX.Element[];
  /**
   *  To specify the className for the Resizable
   */
  className?: string;
  /**
   * Todo prop is defined but not rendered into Resizable
   */
  direction?: string;
  /**
   * To enable the resizable permission of a Resizable in left direction.
   * Todo check values are passed as strings but defined as boolean
   */
  left?: boolean;
  /**
   * To enable the resizable permission of a Resizable in right direction.
   */
  right?: boolean;
  /**
   * To enable the resizable permission of a Resizable in top direction.
   */
  top?: boolean;
  /**
   * To enable the resizable permission of a Resizable in bottom direction.
   */
  bottom?: boolean;
  /**
   * To enable the resizable permission of a Resizable in top-right direction.
   */
  topRight?: boolean;
  /**
   * To enable the resizable permission of a Resizable in bottom-right direction.
   */
  bottomRight?: boolean;
  /**
   * To enable the resizable permission of a Resizable in bottom-left direction.
   */
  bottomLeft?: boolean;
  /**
   * To enable the resizable permission of a Resizable in top-left direction.
   */
  topLeft?: boolean;
  /**
   * To specify the default width size for the Resizable component
   */
  width?: string | number;
  /**
   * To specify the default height size for the Resizable component
   */
  height?: string | number;
  /**
   * To specify the maximum height size for the Resizable component
   */
  maxHeight?: string | number;
  /**
   * To specify the minimum height size for the Resizable component
   */
  minHeight?: string | number;
  /**
   * To specify the maximum width size for the Resizable component
   */
  maxWidth?: string | number;
  /**
   * To specify the minimum width size for the Resizable component
   */
  minWidth?: string | number;

  onResizeStart?: () => void;
  onResizeStop?: () => void;
}
