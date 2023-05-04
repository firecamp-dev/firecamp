import shallow from 'zustand/shallow';
import { Editor } from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';
import { IStore, useStore } from '../../../../../store';

const Variables = () => {
  const { playground, changeVariables } = useStore(
    (s: IStore) => ({
      playground: s.playgrounds?.[s.runtime.activePlayground],
      changeVariables: s.changePlaygroundVariables,
    }),
    shallow
  );

  return (
    <Editor
      language={EEditorLanguage.Json}
      value={playground?.request?.value?.variables || `{ }`}
      onChange={(e) => {
        changeVariables(playground.request.__ref.id, e.target.value);
      }}
      onLoad={(editor) => {
        // setEditorDOM(editor);
      }}
      monacoOptions={{
        name: `variables`,
      }}
      height="100%"
    />
  );
};

export default Variables;
