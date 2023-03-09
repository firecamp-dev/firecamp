export interface ISingleLineIFE {

    /**
     * Editor text type
     */
    type: string

    /**
     * Editor name
     */
    name: string

    /**
     * Editor value string
     */
    value: string

    /**
     * Editor language
     */
    language: string

    /**
     * A boolean value that states if single line editor or not
     */
    singleLine: boolean

    /**
     * A boolean value whether editor is mutable or not
     */
    disabled: boolean

    /**
     * Set auto focus to editor
     */
    autoFocus: boolean

    /**
     * Monaco editor options
     */
    monacoOptions: any

    className: string

    /**
     * Editor placeholder
     */
    placeholder: string

    /**
     * Editor height     
     */
    height: string

    /**
     * On change editor string
     */
    onChange: (event :any) => any

    /**
     * On blur editor
     */
    onBlur: (event :any) => any

    /**
     * On focus editor
     */
    onFocus: (event :any) => any

    /**
     * On paste string in editor
     */
    onPaste: (event :any) => any

    /**
     * On press enter
     */
    onEnter: (event :any) => any

    /**
     * On press s
     */
    onCtrlS: (event :any) => any

    /**
     * On press shift + s
     */
    onCtrlShiftS: (event :any) => any

    /**
     * On press ctrl + 0
     */
    onCtrlO: (event :any) => any

    /**
     * On press k
     */
    onCtrlK: (event :any) => any

    /**
     * On press ctrl + enter
     */
    onCtrlEnter: (event :any) => any

    /**
     * On press shift + enter
     */
    onCtrlShiftEnter: (event :any) => any
}