import { ReactChild } from "react"

export interface IFormGroup {
  /**
   * Unique identifier for CheckBox                     
   */
  id?: string
  /**
* Add class name to show custom styling
*/
  className?: string
  /**
   * Tag/ label for checkbox
   */
  label: string
  /**
   * Error string for invalid action
   */
  error?: string
  /**
   * Child components
   */
  children?: JSX.Element | JSX.Element[] | Function
}