export interface IActivityBar {
  /**
  * is this the principal call to action on the page?
  */
  id?: string,
  /**
   * add class name to show custom styling
   */
  className?: string,

  /**
   * Inline style
   */
  style?: object

  /**
   * children: child components     
   */
  children?: JSX.Element | JSX.Element[]
}

export interface ICompositeBar {
  items: Array<any>
  activeItem: string
  onClickItem: (item: object) => any
}

export interface IActionBar {
  items: Array<any>
  onClickItem: (item: object) => any
}