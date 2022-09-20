import { FC, Fragment } from 'react';
import { MultiLineIFE } from '@firecamp/ui-kit';
import { EConverterLang } from '../types';

import { ITargetState } from './Target';
import { ITabFns } from '../../types/tab';

const { JS, JSON: Json, XML, YAML } = EConverterLang;

const Body: FC<IBody> = ({
  target: { body, type, allowedTypes },
  tabFns = {},
}) => {
  let mode;
  switch (type) {
    case Json:
      mode = allowedTypes[type].activeControl === JS ? 'javascript' : Json;
      break;
    case XML:
      mode = XML;
      break;
    case YAML:
      mode = 'text';
      break;
    default:
      mode = 'text';
      break;
  }

  return (
    <Fragment>
      <MultiLineIFE
        language={mode}
        value={body}
        disabled={true}
        controlsConfig={{
          show: true,
          position: 'vertical',
        }}
        monacoOptions={{
          name: 'converter-response',
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
  target: ITargetState;
  tabFns: ITabFns;
}
