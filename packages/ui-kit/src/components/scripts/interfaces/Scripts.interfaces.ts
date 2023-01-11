export interface IScriptsTab {
  /**
   * An unique identity to scripts tab
   */
  id: string;

  /**
   * Scripts payload object contains scripts in string format
   */
  scripts: { [key: string]: any }; //TODO: add scripts interface from '@firecamp/types'

  /**
   * States if scripts are being inherited or not
   */
  inheritScript?: { [key: string]: any }; //TODO: add scripts interface from '@firecamp/types'
  /**
   * Inherited script popup display message to show when script is inherited
   */
  inheritScriptMessage?: string;

  /**
   * A boolean value whether you want to inherit script or not
   */
  allowInherit: boolean;

  /**
   * Update script function passes script type and value to parent
   */
  onChangeScript: (scriptType: string, script: string) => void;

  /**
   * On click/ check inherit, pass script type and inherit value
   */
  onClickInherit?: (scriptType: string, isInherited: boolean) => Promise<any>;

  /**
   * A function to open parent script modal
   */
  openParentScriptsModal?: () => void;
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
