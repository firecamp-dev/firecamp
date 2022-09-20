export interface ICheckbox {
    /**
     * Unique identifier for CheckBox                     
     */
    id?: string,
    /**
     * Add class name to show custom styling
     */
    className?: string,
    /**
     * Tag/ label for checkbox
     */
    label?: string,
    /**
     * Which colored checkbox do you want?
     */
    color?: string,
    /**
     * A Callback function to return checkbox value on check/ uncheck
     */
    onToggleCheck?: () => void,
    /**
     * Checkbox value whether it is checked or not
     */
    isChecked?: boolean,
    /**
     * Checkbox tab index
     */
    tabIndex?: number,
    /**
     * Label placement ['left', 'right']
     */
    labelPlacing?: string,
    /**
     * Boolean value to set checkbox disable
     */
    disabled?: boolean,
    /**
     * Extra information to show as note/ info for checkbox
     */
    note?: string,
    /**
     * true if you want to show label
     */
    showLabel?: boolean
}