import { TId } from './general';

// @deprecated IRestScripts
export interface IRestScripts {
  /**
   * script execute before Rest request execution starts
   */
  pre?: string;
  /**
   * script execute after Rest request execution finished
   */
  post?: string;
  /**
   * script execute after Rest request execution finished and
   * also after the post script execution finished
   */
  test?: string;
}

enum EScriptTypes {
  PreRequest = 'prerequest',
  Test = 'test',
}

enum EScriptLanguages {
  JavaScript = 'text/javascript',
}
interface IScript {
  id: TId;
  type: EScriptTypes;
  value: string[];
  language: EScriptLanguages;
}

export { EScriptTypes, EScriptLanguages, IScript };
