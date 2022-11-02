import { FC, Fragment } from 'react';
import { Editor } from '@firecamp/ui-kit';
import { EConverterLang } from '../types';

import { ITabFns } from '../../types/tab';
import { ISourceState } from '../types';

const { JS, JSON: Json, XML, YAML } = EConverterLang;

const Body: FC<IBody> = ({
  source: { body, type, hasTypeDetected, isUpdating, hasError },
  onSourceUpdate,
  tabFns,
}) => {
  let mode;

  if ((!isUpdating && !hasTypeDetected) || hasError) {
    mode = Json;
  } else {
    if ((isUpdating && !hasTypeDetected) || hasError) {
      mode = type;
    } else {
      switch (type) {
        case Json:
          mode = Json;
          break;
        case XML:
          mode = XML;
          break;
        case YAML:
          mode = 'text';
          break;
        case JS:
          mode = 'javascript';
          break;
        default:
          mode = 'text';
          break;
      }
    }
  }

  return (
    <Fragment>
      <Editor
        autoFocus={true}
        language={mode}
        value={body}
        onChange={({ target: { value } }) => {
          onSourceUpdate(value);
        }}
        controlsConfig={{
          show: true,
        }}
        monacoOptions={{
          name: 'converter-request',
          width: '100%',
          fontSize: 13,
          highlightActiveLine: false,
          showLineNumbers: false,
          tabSize: 2,
          cursorStart: 1,
        }}
        onCtrlS={tabFns.save}
      />
    </Fragment>
  );
};

export default Body;

interface IBody {
  /**
   * Converter tab source data
   */
  source: ISourceState;

  /**
   * Udpate source data/ string value from editor to request state
   */
  onSourceUpdate: (value: string) => void;

  tabFns?: ITabFns;
}
