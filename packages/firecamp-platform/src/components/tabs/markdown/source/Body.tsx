// @ts-nocheck
import { FC, Fragment } from 'react';
import { Editor } from '@firecamp/ui-kit';

import { ITabFns } from '../../types/tab';
import { ISourceState } from './Source';

const Body: FC<IBody> = ({
  body = {},
  tabFns = {},
  onSourceUpdate = (_) => {},
}) => {
  return (
    <Fragment>
      <Editor
        autoFocus={true}
        language={'markdown'}
        value={body}
        onChange={({ target: { value } }) => {
          onSourceUpdate(value);
        }}
        controlsConfig={{
          show: true,
          position: 'vertical',
        }}
        monacoOptions={{
          name: 'md-request',
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
   * Tab source data
   */
  source: ISourceState;

  /**
   * Update source data/ string value from editor to request state
   */
  onSourceUpdate: (value: string) => void;

  tabFns?: ITabFns;
}
