type TRendererProps = { toggle?: () => void; expanded?: boolean };
export interface IPane {
  /**
   * Pane header title renderer
   */
  headerTitleRenderer: (props: TRendererProps) => JSX.Element;

  /**
   * Pane header action renderer
   */
  headerActionRenderer: (props: TRendererProps) => JSX.Element;

  /**
   * Pane header body renderer
   */
  bodyRenderer: (props: TRendererProps) => JSX.Element;

  /**
   * pane is expanded or not
   */
  expanded?: boolean;

  /**
   * Add class name to show custom styling
   */
  className?: string;

  /**
   * apply css class to Pane.Header
   */
  headerClassName?: string;

  /**
   * apply css class to Pane.Body
   */
  bodyClassName?: string;

  /**
   * to apply any custom height to the container component
   */
  height?: string;

  /**
   * to hide the border at bottom of header
   */
  hideBorder?: boolean;
}

export interface IHeader {
  /**
   * pane is expanded or not
   */
  expanded: boolean;

  toggle: () => void;

  // render title component
  titleRenderer: (props?: {
    toggle?: () => void;
    enable?: boolean;
  }) => JSX.Element;

  // render action component
  actionRenderer: (props?: {
    toggle?: () => void;
    enable?: boolean;
  }) => JSX.Element;

  className?: string;

  /**
   * to hide the border at bottom of header
   */
  hideBorder?: boolean;
}

export interface IBody {
  /**
   * Content to show in container
   */
  children?: any;

  /**
   * Add class name to show custom styling
   */
  className?: string;
}
