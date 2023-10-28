import { FC, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Container, Editor, Resizable, Row, Column, Notes, TabHeader } from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';
import HelpPopUp from './SnippetPopup';
import ScriptDefs from '!!raw-loader!./interfaces/scripts.d';

const ScriptTab: FC<IProps> = ({
  id = '',
  script,
  snippets,
  onChangeScript = (value) => { },
}) => {
  const [editorDOM, setEditorDOM] = useState(null);
  const _onAddScriptFromSnippet = async (script: string[]) => {
    if (editorDOM && editorDOM !== null) {
      await editorDOM.insertTextAtCurrentCursor(`\n${script.join('\n')}`);
      const scriptValue = await editorDOM.getValue();
      onChangeScript(scriptValue);
    }
  };

  return (
    <Container>
      <Container.Body className="flex flex-col">
        <TabHeader className="bg-statusBar-background-active">
          <div className="text-sm">
            Pre-request script are written in JavaScript and are run before the
            request is sent.
            {/* Learn more about
            <a
              href="#"
              className="underline inline items-center cursor-pointer"
            >
              pre-request scripts
              <ExternalLink className="inline ml-1" size={12} />
            </a> */}
          </div>
        </TabHeader>
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
            className="border-l border-app-border"
          >
            <Column className="overflow-auto visible-scrollbar">
              <HelpPopUp
                snippets={snippets}
                onAddScript={_onAddScriptFromSnippet}
              />
            </Column>
          </Resizable>
        </Row>
      </Container.Body>
    </Container>
  );
};
export default ScriptTab;

export interface IProps {
  /** an unique id to scripts tab */
  id: string;

  /** scripts payload object contains scripts in string format */
  script: string;

  /** script help snippets */
  snippets: any;

  /** Update script function passes script type and value to parent */
  onChangeScript: (script: string) => void;
}
