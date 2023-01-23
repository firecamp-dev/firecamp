import { FC, useState } from 'react';
import { Container, Editor } from '@firecamp/ui-kit';
import { EEditorLanguage } from '@firecamp/types';
//@ts-ignore
import ScriptDefs from './interfaces/Scripts.d.txt?raw';
import { IScriptTab } from './interfaces/ScriptTab.interface';
import HelpPopUp from './SnippetPopup';

const ScriptTab: FC<IScriptTab> = ({
  id = '',
  script,
  snippets,
  onChangeScript = (value) => {},
}) => {
  const [isSnippetPopupOpen, toggleSnippetPopup] = useState(false);
  const [editorDOM, setEditorDOM] = useState(null);

  const _onAddScriptFromSnippet = async (script = '') => {
    const _concateExisting = (_script = '', concateScript = false) => {
      const existingScript = script;
      let updatedScript = _script;

      if (concateScript === true) {
        updatedScript = existingScript
          ? `${existingScript || ''}
      ${_script || ''}`
          : `${_script || ''}`;
      }

      onChangeScript(updatedScript);
    };

    if (editorDOM && editorDOM !== null) {
      await editorDOM.insertTextAtCurrentCursor(`\n${script}`);
      const scriptValue = await editorDOM.getValue();
      _concateExisting(scriptValue, false);
    } else {
      _concateExisting(script, true);
    }
  };

  return (
    <Container>
      <Container.Body>
        <div className="flex items-center ml-auto justify-end">
          {snippets ? (
            <HelpPopUp
              isOpen={isSnippetPopupOpen}
              snippets={snippets}
              onClose={() => toggleSnippetPopup(!isSnippetPopupOpen)}
              onAddScript={_onAddScriptFromSnippet}
            />
          ) : (
            <></>
          )}
        </div>
        {/* <div style={{ height: '100%' }}> */}
        <Editor
          autoFocus={true}
          path={`scripts-${id}`}
          id={`scripts-tab-${id}`}
          value={script}
          language={EEditorLanguage.TypeScript}
          onLoad={(editor) => {
            setEditorDOM(editor);
          }}
          onChange={({ target: { value } }) => {
            // console.log('------- on change -------');
            onChangeScript(value);
          }}
          addExtraLib={{
            typeDefinition: ScriptDefs,
            path: 'file:///node_modules/@firecamp/scripts/index.d.ts',
          }}
        />
        {/* </div> */}
      </Container.Body>
    </Container>
  );
};
export default ScriptTab;
