export interface IContainer {
  /**
   * Content to show in container
   */
  children?: any;

  /**
   * Add class name to show custom styling
   */
  className?: string;

  /**
   * Overflow value
   */
  overflow?: string; // one of [ 'visible', 'hidden', 'scroll', 'auto', 'initial', 'inherit']
}

export interface IHeader {
  id?: number | string;

  children?: any;

  /**
   * Add class name to show custom styling
   */
  className?: string;

  flex?: string | number;

  height?: string | number;
}

export interface IBody {
  id?: number | string;
  children?: any;
  className?: string;
  overflow?: string;
  minHeight?: string | number;
  height?: string | number;
}

export interface IFooter {
  id?: number | string;

  children?: any;

  /**
   * Add class name to show custom styling
   */
  className?: string;
}

export interface IEmpty {
  children?: any;

  /**
   * Add class name to show custom styling
   */
  className?: string;

  flex?: string | number;
}
