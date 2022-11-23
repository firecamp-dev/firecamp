import { UseFormMethods } from 'react-hook-form';

export interface IInput {
  /**
   * Unique identifier for Input
   */
  id?: string;

  /**
   * auto focus input on render
   */
  autoFocus?: boolean;

  /**
   * Class to show custom styling
   */
  className?: string;

  /**
   * wrapper class at root div
   */
  wrapperClassName?: string;

  /**
   * Placeholder to show information/ hint
   */
  placeholder?: string;

  /**
   * String value for input
   */
  value?: string;

  defaultValue?: string;

  /**
   * Name for input element
   */
  name?: string;

  /**
   * Input type
   */
  type?: string;

  /**
   * Add icon if required
   */
  icon?: string | JSX.Element;

  /**
   * Set icon position ['left', 'right']
   */
  iconPosition?: string;

  /**
   * Input reference for register meta lib dependency 'react-hook-form'
   */
  registerMeta?: object;

  /**
   * Define the function to be executed on onChange event of Input
   */
  onChange?: (event: any) => void;

  /**
   * Define the function to be executed onKeyDown event of Input
   */
  onKeyDown?: (event: any) => void;

  /**
   * Define the function to be executed onBlur event of Input
   */
  onBlur?: (event: any) => void;

  /**
   * Define the function to be executed onFocus event of Input
   */
  onFocus?: (event: any) => void;

  /**
   * reference to 'react-hook-form'
   */
  useformRef?: UseFormMethods;

  /**
   * Input label
   */
  label?: string;

  /**
   * Input error
   */
  error?: string | JSX.Element;

  /**
   * input note
   */
  note?: string;

  /**
   * a boolean value represent whether input is editor (singleline) or native input
   */
  isEditor?: boolean;

  /**
   * a boolean value represent whether input is disabled or not
   */
  disabled?: boolean;
}
