import { FC, useEffect, useRef } from 'react';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';
import cx from 'classnames';
import { EEditorLanguage } from '@firecamp/types';
import { IEditor } from './Editor.interface';
import './sass/Editor.sass';

const Editor: FC<IEditor> = ({
  value,
  disabled = false,
  autoFocus = false,
  language = EEditorLanguage.Json,
  monacoOptions = {},
  height,
  path,
  loading,
  addExtraLib,
  placeholder = '',
  className = '',
  onChange = () => {}, // similar DOM event, e = { preventDefault, target }
  onBlur,
  onFocus,
  onPaste,
  onLoad = (editor) => {},
  editorDidMount = null,
  onCtrlS = () => {},
  onCtrlShiftS = () => {},
  onCtrlO = () => {},
  onCtrlK = () => {},
  onCtrlEnter = () => {},
  onCtrlShiftEnter = () => {},
}) => {
  const editorIdRef = useRef('');
  useEffect(() => {
    //@ts-ignore
    if (!window.editors) window.editors = new Map();
    return () => {
      //@ts-ignore
      if (window.editors) window.editors.delete(editorIdRef.current);
    };
  }, []);

  const onMount: OnMount = (editor, monaco) => {
    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;

    editor.onDidFocusEditorWidget(() => {
      localStorage.setItem('currentEditor', editor.getId());
      // console.log(editor.getId(), 'Focus event triggered ');
    });

    /**
     * allow comments for JSON language
     * @ref: https://github.com/microsoft/monaco-editor/issues/2426
     */
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemaValidation: 'error',
    });

    onBlur && editor.onDidBlurEditorText(() => onBlur(editor));
    onFocus && editor.onDidFocusEditorText(() => onFocus(editor));
    onPaste &&
      editor.onDidPaste((l) => {
        onPaste(editor.getModel().getValueInRange(l.range), editor);
      });

    editor.onKeyDown((evt: any) => {
      switch (evt.keyCode) {
        // ctrl+s or cmd+s shortcut
        // case monaco.KeyCode.KeyS:
        //   if (evt.ctrlKey || evt.metaKey) {
        //     evt.preventDefault();
        //     evt.stopPropagation();

        //     if (evt.shiftKey) {
        //       onCtrlShiftS(evt);
        //     } else {
        //       onCtrlS(evt);
        //     }
        //   }
        //   break;

        // ctrl+O shortcut
        case monaco.KeyCode.KeyO:
          if (evt.ctrlKey) {
            evt.preventDefault();
            evt.stopPropagation();
            onCtrlO(evt);
          }
          break;

        // ctrl+K shortcut
        case monaco.KeyCode.KeyK:
          if (evt.ctrlKey) {
            evt.preventDefault();
            evt.stopPropagation();
            onCtrlK(evt);
          }
          break;
      }
    });

    editor.addCommand(KM.CtrlCmd | KC.KeyS, (e: any) => {
      console.log('CMD+S...');
      onCtrlS(e);
    });

    editor.addCommand(KM.CtrlCmd | KM.Shift | KC.KeyS, (e: any) => {
      console.log('CMD+Shift+S...');
      onCtrlShiftS(e);
    });

    // editor.addCommand(KM.CtrlCmd | KC.Enter, (e: any) => {
    //   console.log('CMD+ENTER...');
    //   onCtrlEnter(e);
    // });

    // editor.addCommand(KM.CtrlCmd | KM.Shift | KC.Enter, (e: any) => {
    //   console.log('CMD+Shift+ENTER...');
    //   onCtrlShiftEnter(e);
    // });

    // editor.addCommand(KM.CtrlCmd | KC.KeyO, (e: any) => {
    //   console.log('CtrlCmd + KEY_O...');
    //   onCtrlO(e);
    // });

    // editor.addCommand(KM.CtrlCmd | KC.KeyK, (e: any) => {
    //   console.log('CtrlCmd + KEY_K...');
    //   onCtrlK(e);
    // });

    // editor.addCommand(KC.Ctrl | KC.KeyS, (e) => {
    //   console.log('CTRL+S...');
    //   onCtrlS();
    // });

    // editor.addCommand(KM.chord(KC.Ctrl | KC.Shift | KM.KeyS), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // editor.addCommand(KM.chord(KM.CtrlCmd | KC.KeyK, KM.CtrlCmd | KC.KeyM), (e)=> {
    //   console.log("I am in the Editor...")
    // });

    // set focus to Editor if autoFocus is given true to Input
    if (autoFocus === true) {
      try {
        setTimeout(() => {
          editor.focus();
          let range = editor.getModel().getFullModelRange();
          editor.setPosition({ lineNumber: 1, column: range.endColumn });
        }, 200);
      } catch (e) {}
    }

    onLoad(editor);
    // editorDidMount && editorDidMount(editor, monaco);
    editorIdRef.current = editor.getId();

    // @ts-ignore
    if (!window.editors) window.editors = new Map();
    // @ts-ignore
    window.editors.set(editorIdRef.current, editor);
  };

  const options: EditorProps['options'] = {
    readOnly: false,
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 15,
    links: false,
    lineNumbersMinChars: 5,
    overviewRulerLanes: 0,
    minimap: { enabled: false },
    matchBrackets: 'never',
    renderLineHighlight: 'none',

    smoothScrolling: true,
    scrollBeyondLastLine: false,
    contextmenu: false,
    scrollbar: {
      // vertical: "hidden",
      // horizontal: "hidden",
      handleMouseWheel: true,
      useShadows: true,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 5,
    },
    suggest: {
      showKeywords: false,
      showVariables: true, // disables `undefined`, but also disables user-defined variables suggestions.
      showModules: false, // disables `globalThis`, but also disables user-defined modules suggestions.
    },
    suggestOnTriggerCharacters: false,
    tabSize: 4,
    renderWhitespace: false, // it'll show dot for white stpace
    wordBasedSuggestions: false,
    ...monacoOptions,
  };

  /** if 'readOnly' is not provided then consider 'disabled' */
  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  // console.log(value, language, 'language...');

  return (
    <div className={cx('relative h-full', className)}>
      <div className="firecamp-editor__placeholder">
        <div>{!value ? placeholder || '' : ''}</div>
      </div>
      <MonacoEditor
        language={language}
        defaultValue={value}
        value={value}
        options={options}
        height={height}
        path={path}
        key={path}
        loading={loading || <></>}
        onChange={(value, e) => {
          // console.log(value, 'native editor');
          onChange({
            preventDefault: () => {},
            target: { value },
          });
        }}
        onMount={(editor, monaco) => {
          if (language == 'typescript') {
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              noLib: true,
              allowNonTsExtensions: true,
            });
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              addExtraLib.typeDefinition,
              addExtraLib.path
            );
          }

          // https://www.anycodings.com/1questions/1773746/how-do-i-insert-text-into-a-monaco-editor
          editor.insertTextAtCurrentCursor = (text: any) => {
            let p = editor.getPosition();
            editor.executeEdits('', [
              {
                range: new monaco.Range(
                  p.lineNumber,
                  p.column,
                  p.lineNumber,
                  p.column
                ),
                text,
              },
            ]);
          };

          onMount(editor, monaco);
        }}
      />
    </div>
  );
};

export default Editor;
