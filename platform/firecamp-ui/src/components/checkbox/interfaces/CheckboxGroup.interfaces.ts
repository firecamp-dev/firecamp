import { ICheckbox } from './Checkbox.interfaces'
export interface ICheckboxGroup {
    /**
  * To execute function on list item check event
  */
    onToggleCheck: () => {}
    /**
     * To display the heading for the checkbox list
     */
    checkboxLabel: string
    /**
     * To enable/disable the label
     */
    showLabel: boolean
    /**
     * Provide the data object for rendering into the checkboxlist
     */
    list: Array<ICheckbox>
}