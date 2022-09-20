// @ts-nocheck

import { FC, Fragment } from 'react';

import { MultiLineIFE } from '@firecamp/ui-kit';
import { ITabFns } from '../../types/tab';

const Body: FC<IBody> = ({ body = {}, tabFns = {} }) => {
  return (
    <Fragment>
      <MultiLineIFE
        language={'html'}
        value={body}
        disabled={true}
        onChange={({ target: { value } }) => {
          ctx_onSourceUpdate(value);
        }}
        controlsConfig={{
          show: true,
          position: 'vertical',
        }}
        monacoOptions={{
          name: 'md-response',
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
   * Target ody
   */
  body: string;
  tabFns: ITabFns;
}
