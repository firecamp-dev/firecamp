import { FC, useState } from 'react';
import { Editor } from '@firecamp/ui-kit';
import { EEditorLanguage } from '@firecamp/types';

const TimelineTab: FC<{ id: string; timeline: string }> = ({
  id,
  timeline,
}) => {
  const [editor, setEditor] = useState(null);
  return (
    <Editor
      disabled={true}
      value={timeline || ``}
      language={EEditorLanguage.Text}
      path={`${id}/response/timeline`}
      onLoad={(editor) => {
        editor.revealLine(1, true, true, function () {});
        editor.setPosition({ column: 1, lineNumber: 10 });
        setEditor(editor);
      }}
      monacoOptions={{
        name: `timeline`,
      }}
    />
  );
};
export default TimelineTab;
