import { IcontrolsConfig } from "./FirecampEditor.interfaces"

export interface IMultiLineIFE {
    id?: string| number,

    /**
     * Editor value string
     */
    value: string

    /**
     * A boolean value whether editor is mutable or not
     */
    disabled?: boolean

    /**
     * Set auto focus to editor
     */
    autoFocus?: boolean

    /**
     * Editor language
     */
    language?: string

    /**
     * Monaco editor options
     */
    monacoOptions?: any

    controlsConfig?: IcontrolsConfig

    /**
     * Editor placeholder
     */
    placeholder?: string

    /**
     * on load editor 
     */
    editorDidMount?: (edt: any, monaco: any) => {}

    /**
     * On change editor string
     */
    onChange?: (event :any) => any

    /**
     * On blur editor
     */
    onBlur?: (event :any) => any

    /**
     * On focus editor
     */
    onFocus?:(event :any) => any

    /**
     * On load editor
     */
    onLoad?: (event :any) => any

    /**
     * On press enter
     */
    onEnter?: (event :any) => any

    /**
     * On press s
     */
    onCtrlS?: (event :any) => any

    /**
     * On press shift + s
     */
    onCtrlShiftS?: (event :any) => any

    /**
     * On press ctrl + 0
     */
    onCtrlO?: (event :any) => any

    /**
     * On press k
     */
    onCtrlK?: (event :any) => any

    /**
     * On press ctrl + enter
     */
    onCtrlEnter?: (event :any) => any

    /**
     * On press shift + enter
     */
    onCtrlShiftEnter?: (event :any) => any
}