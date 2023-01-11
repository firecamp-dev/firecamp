import { FC, useState, useMemo, useEffect } from 'react';
import { Container, SecondaryTab, Checkbox, Editor } from '@firecamp/ui-kit';
import { EEditorLanguage } from '@firecamp/types';
//@ts-ignore
import ScriptDefs from './interfaces/Scripts.d.txt?raw';
import { IScriptsTab } from './interfaces/Scripts.interfaces';
import HelpPopUp from './SnippetPopup';

enum EScriptTabs {
  Pre = 'pre',
  Post = 'post',
}
type TSnippets = {
  snippets: {
    pre?: any;
    post?: any;
    test?: any;
  };
};
const ScriptsTabs: FC<IScriptsTab & TSnippets> = ({
  id = '',
  scripts = {
    pre: '',
    post: '',
    test: '',
  },
  allowInherit = true,
  snippets,
  onChangeScript = (tab, value) => {},
}) => {
  if (
    !scripts ||
    (scripts[EScriptTabs.Pre] === scripts[EScriptTabs.Post]) === undefined
  )
    return <></>;

  const [activeTab, setActiveTab] = useState<EScriptTabs>(EScriptTabs.Pre);
  const [isSnippetPopupOpen, toggleSnippetPopup] = useState(false);
  const [editorDOM, setEditorDOM] = useState(null);
  useEffect(() => {
    console.log('rendering script tab first time');
  }, []);
  const tabs = useMemo(
    () => [
      {
        id: EScriptTabs.Pre,
        name: 'Pre',
        dotIndicator: !!scripts.pre,
      },
      {
        id: EScriptTabs.Post,
        name: 'Post',
        dotIndicator: !!scripts.post,
      },
      /*{
        id: 'test',
        name: 'Test cases',
        dotIndicator: !!scripts.test,
      }, */
    ],
    [scripts]
  );

  const _onAddScriptFromSnippet = async (script = '') => {
    const _concateExisting = (
      type: EScriptTabs = EScriptTabs.Pre,
      script = '',
      concateScript = false
    ) => {
      if (!type || !scripts) return;
      const existingScript = scripts[type];
      let updatedScript = script;

      if (concateScript === true) {
        updatedScript = existingScript
          ? `${existingScript || ''}
      ${script || ''}`
          : `${script || ''}`;
      }

      onChangeScript(type, updatedScript);
    };

    if (editorDOM && editorDOM !== null) {
      if (activeTab === 'test') {
        script = script.replace(/\n/g, '\n\t');
        if (!scripts[activeTab] || !scripts[activeTab].length) {
          const defaultScript = `describe("Untitled suite", ()=>{
        
});`;
          await editorDOM.insertTextAtCurrentCursor(defaultScript);
          editorDOM.revealLineInCenter(2);
        }

        const initCursor = await editorDOM.getPosition();
        if (initCursor.lineNumber !== 1) {
          const rowNum = initCursor.lineNumber - 1;
          editorDOM.setPosition({ column: 0, lineNumber: rowNum });
          await editorDOM.insertTextAtCurrentCursor(`\n\n\t${script}
`);
        } else if (scripts[activeTab]?.length) {
          await editorDOM.insertTextAtCurrentCursor(`\n\t${script}
`);
        } else {
          await editorDOM.insertTextAtCurrentCursor(`\n${script}
`);
        }
      } else if (scripts[activeTab]?.length) {
        await editorDOM.insertTextAtCurrentCursor(`\n${script}
`);
      } else {
        await editorDOM.insertTextAtCurrentCursor(script);
      }

      const scriptValue = await editorDOM.getValue();
      _concateExisting(activeTab, scriptValue, false);
    } else {
      _concateExisting(activeTab, script, true);
    }
  };

  // console.log(scripts, 'scripts...');
  return (
    <Container>
      <Container.Header className="flex items-center whitespace-pre">
        <SecondaryTab
          list={tabs}
          activeTab={activeTab}
          isBgTransperant={true}
          onSelect={(tab: EScriptTabs) => {
            if (tab !== activeTab) {
              setActiveTab(tab);
            }
          }}
        />
      </Container.Header>

      <Container.Body>
        <div className="flex items-center ml-auto justify-end">
          {allowInherit ? (
            <Checkbox
              className={'position-top-right'}
              // isChecked={propInheritScript[activeTab]}
              onToggleCheck={() => {}}
              label="Inherit from parent"
              // labelPlacing="left"
            />
          ) : (
            <></>
          )}
          {snippets[activeTab] ? (
            <HelpPopUp
              isOpen={isSnippetPopupOpen}
              snippets={snippets[activeTab]}
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
          id={`scripts-tab-${activeTab}-${id}`}
          value={scripts[activeTab] || ''}
          language={EEditorLanguage.TypeScript}
          onLoad={(editor) => {
            setEditorDOM(editor);
          }}
          onChange={({ target: { value } }) => {
            // console.log('------- on change -------');
            onChangeScript(activeTab, value);
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
export default ScriptsTabs;
