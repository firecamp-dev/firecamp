export interface IFirecampEditor {

  /**
   * Editor options
   */
  options?: IOptions

  /**
   * Editor contols config
   */
  controlsConfig?: IcontrolsConfig

  /**
   * On change editor string
   */
  onChange?: (event :any) => any

  /**
   * On blur editor
   */
  onBlur?: (event :any, monaco?:any) => any

  /**
   * On focus editor
   */
  onFocus?: (event :any, monaco?:any) => any

  /**
   * On pase editor string
   */
  onPaste?: (event :any, monaco?:any) => any
  /**
   * on load editor 
   */
  editorDidMount?: (edt: any, monaco: any) =>void
}
export interface IOptions {

  /**
   * A boolean value whether editor is mutable or not
   */
  readOnly?: boolean

  /**
   * Editor height
   */
  height?: string | number

  /**
   * Editor weight
   */
  width?: string | number

  /**
   * Editor theme
   */
  theme?: string

  /**
   * Editor language
   */
  language?: string

  /**
   * Editor value
   */
  value: string

  /**
   * Editor placeholder
   */
  placeholder?: string

  /**
   * monaco editor options
   */
  monacoOptions?: any // TODO: add interface
}

export interface IcontrolsConfig {

  /**
   * A boolean value whether controls are visible or not
   */
  show?: boolean

  /**
   * controls position ['vertical', 'horizontal']  
   */
  position?: string

  /**
   * A boolean value that controls are collapsed or not
   */
  collapsed?: boolean

  /**
   * Controls list
   */
  controls?: Array<string>
}