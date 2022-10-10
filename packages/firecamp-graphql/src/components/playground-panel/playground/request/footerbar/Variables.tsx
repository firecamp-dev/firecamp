import shallow from 'zustand/shallow';
import { Editor } from '@firecamp/ui-kit';
// import equal from 'deep-equal';

import { useGraphQLStore } from '../../../../../store';

const Variables = () => {
  let { playground, changeVariables } = useGraphQLStore(
    (s: any) => ({
      playground: s.playgrounds?.[s.runtime.activePlayground],
      changeVariables: s.changePlaygroundVariables,
    }),
    shallow
  );

  return (
    <Editor
      language={`json`}
      value={playground?.request?.meta?.variables || `{ }`}
      onChange={(e) => {
        changeVariables(playground.request._meta.id, e.target.value);
      }}
      onLoad={(editor) => {
        // setEditorDOM(editor);
      }}
      monacoOptions={{
        name: `variables`,
      }}
    />
  );
};

export default Variables;
