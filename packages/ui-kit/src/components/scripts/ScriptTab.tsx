import { FC, useState } from 'react';
import { Container, Editor, Resizable, Row, Column,Notes,TabHeader } from '@firecamp/ui-kit';
import { EEditorLanguage } from '@firecamp/types';
//@ts-ignore
import ScriptDefs from './interfaces/Scripts.d.txt?raw';
import { IScriptTab } from './interfaces/ScriptTab.interface';
import HelpPopUp from './SnippetPopup';
import { VscLinkExternal } from '@react-icons/all-files/vsc/VscLinkExternal';

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
      <Container.Body className="flex flex-col">
        <TabHeader className="bg-statusBarBackground2">
          <div className="text-sm">
        Pre-request script are written in Javascript and are run before the
          request is sent. Learn more about{' '}
          <a href="#" className="underline inline items-center cursor-pointer">
            pre-request scripts{' '}
            <VscLinkExternal className="inline ml-1" size={12} />
          </a>
          </div>
        </TabHeader>
       {/* {snippets ? (
            <HelpPopUp
              isOpen={isSnippetPopupOpen}
              snippets={snippets}
              onClose={() => toggleSnippetPopup(!isSnippetPopupOpen)}
              onAddScript={_onAddScriptFromSnippet}
            />
          ) : (
            <></>
          )} */}
        {/* <div style={{ height: '100%' }}> */}
        <Row flex={1} overflow="auto">
          <Column flex={1}>
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
          </Column>
          <Resizable
            left={true}
            height="100%"
            minWidth={100}
            maxWidth={400}
            width={240}
            className="border-l border-appBorder"
          >
            <Column className="overflow-auto visible-scrollbar">
              <HelpPopUp
                isOpen={true}
                snippets={snippets}
                onClose={() => toggleSnippetPopup(!isSnippetPopupOpen)}
                onAddScript={_onAddScriptFromSnippet}
              />
            </Column>
          </Resizable>
        </Row>

        {/* </div> */}
      </Container.Body>
    </Container>
  );
};
export default ScriptTab;
