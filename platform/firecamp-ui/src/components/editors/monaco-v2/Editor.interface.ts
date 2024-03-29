import { ReactNode } from 'react';

export interface IEditor {
  id?: string | number;

  /** editor value string */
  value: string;

  /**
   * boolean value whether editor is readOnly or not
   * similar to field readOnly
   */
  disabled?: boolean;

  /** similar to field disabled*/
  readOnly?: boolean;

  /** set auto focus to editor */
  autoFocus?: boolean;

  /** editor language */
  language?: string;

  /** editor height */
  height?: string | number;

  /** monaco path */
  path?: string;

  /** when lang is typescript then provide extra types for auto completion and preview comments */
  addExtraLib?: {
    typeDefinition: string;
    path: string;
  };

  /** monaco editor options */
  monacoOptions?: any;

  /** editor placeholder */
  placeholder?: string;

  /** apply class to editor's container */
  className?: string;

  /** apply styles to editor's container */
  style?: { [key: string]: any };

  /** editor's loading element */
  loading?: ReactNode;

  /** on load editor */
  editorDidMount?: (edt: any, monaco: any) => {};

  /** on change editor string*/
  onChange?: (event: any) => any;

  /** on blur editor*/
  onBlur?: (event: any) => any;

  /** on focus editor */
  onFocus?: (event: any) => any;

  /** on load editor */
  onLoad?: (event: any) => any;

  /** on paste text */
  onPaste?: (paste: string, event: any) => any;

  /** on press enter */
  onEnter?: (event: any) => any;

  /** on press s */
  onCtrlS?: (event: any) => any;

  /** on press shift + s */
  onCtrlShiftS?: (event: any) => any;

  /** on press ctrl + 0 */
  onCtrlO?: (event: any) => any;

  /** on press k */
  onCtrlK?: (event: any) => any;

  /** on press ctrl + enter */
  onCtrlEnter?: (event: any) => any;

  /** on press shift + enter */
  onCtrlShiftEnter?: (event: any) => any;
}
