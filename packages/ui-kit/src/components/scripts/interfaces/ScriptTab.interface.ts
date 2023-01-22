export interface IScriptTab {
  /**
   * An unique identity to scripts tab
   */
  id: string;

  /**
   * Scripts payload object contains scripts in string format
   */
  script: string; //TODO: add scripts interface from '@firecamp/types'

  /** script help snippets */
  snippets: any;

  /**
   * Update script function passes script type and value to parent
   */
  onChangeScript: (script: string) => void;
}
export interface ISnippetPopup {
  /**
   * script snippets
   */
  snippets: any[];

  /**
   * Popup title
   */
  title?: string;

  /**
   * Boolean value whether popup is opened or not
   */
  isOpen: boolean;

  /**
   * Close popup
   */
  onClose: () => void;

  /**
   * On add script, passes snippet (selected) to parent
   */
  onAddScript: (snippet: string) => void;
}
