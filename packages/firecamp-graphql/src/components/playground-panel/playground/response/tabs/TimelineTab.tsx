import { MultiLineIFE } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import { useGraphQLStore } from '../../../../../store';

const TimelineTab = () => {
  let { response = {} } = useGraphQLStore(
    (s: any) => ({
      response: s.playgrounds?.[s.runtime.activePlayground]?.response,
    }),
    shallow
  );

  return (
    <MultiLineIFE
      disabled={true}
      value={response?.timeline || ``}
      language="text"
      controlsConfig={{
        show: true,
      }}
      onLoad={(editor) => {
        editor.revealLine(1, true, true, function () {});
        editor.setPosition({ column: 1, lineNumber: 10 });
      }}
      monacoOptions={{
        name: `timeline`,
      }}
    />
  );
};
export default TimelineTab;
