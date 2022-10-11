import { FC, useEffect, useRef } from 'react';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';
import cx from 'classnames';
import { IEditor } from './Editor.interface';
import MonacoFirecampLangInit, {
  SetCompletionProvider,
} from '../monaco/lang/init';

const Editor: FC<IEditor> = ({
  value,
  disabled = false,
  autoFocus = false,
  language = 'json',
  monacoOptions = {},
  height,
  onChange = () => {}, // similar DOM event, e = { preventDefault, target }
  onBlur,
  onFocus,
  onPaste,
  onLoad = (editor) => {},
  // controlsConfig = {
  //   show: false,
  //   position: 'vertical',
  //   collapsed: true,
  // },
  placeholder = '',
  className = '',
  editorDidMount = null,
  onEnter = () => {},
  onCtrlS = () => {},
  onCtrlShiftS = () => {},
  onCtrlO = () => {},
  onCtrlK = () => {},
  onCtrlEnter = () => {},
  onCtrlShiftEnter = () => {},
}) => {

  const editorIdRef = useRef('');
  useEffect(() => {
    MonacoFirecampLangInit();
    SetCompletionProvider('ife-header-key', { name: 'Nishchit' });
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (!window.ife) window.ife = new Map();
    return () => {
      //@ts-ignore
      if (window.ife) window.ife.delete(editorIdRed.current);
    };
  }, []);

  const onMount: OnMount = (editor, monaco) => {
    // Add shortcuts on keydown event

    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;

    // editor.addCommand(KC.Enter, (e: any) => {
    //   console.log('ENTER...');
    //   onEnter(e);
    // });

    // editor.addCommand(KM.CtrlCmd | KC.KeyS, (e: any) => {
    //   console.log('CMD+S...');
    //   onCtrlS(e);
    // });

    // editor.addCommand(KM.CtrlCmd | KM.Shift | KC.KeyS, (e: any) => {
    //   console.log('CMD+Shift+S...');
    //   onCtrlShiftS(e);
    // });

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

    // editor.addCommand((KC.Ctrl | KC.KeyS), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // editor.addCommand(KM.chord(KC.Ctrl | KC.Shift | KM.KeyS), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // editor.addCommand(KM.chord(KM.CtrlCmd | KC.KeyK, KM.CtrlCmd | KC.KeyM), (e)=> {
    //   console.log("I am in the Editor...")
    // });

    // editor.onKeyDown = (evt) => {
    // console.log(evt);
    // ctrl+s or cmd+s shortcut
    // if (evt.keyCode === monaco.KeyCode.KeyS) {
    // console.log("I am in...")
    // if (evt.ctrlKey || evt.metaKey) {
    //   evt.preventDefault();
    //   evt.stopPropagation();
    //   if (evt.shiftKey) {
    //     onCtrlShiftS();
    //   } else {
    //     console.log("222222")
    //     onCtrlS();
    //   }
    // }
    // }

    // ctrl+O shortcut
    // else if (evt.keyCode === monaco.KeyCode.KEY_O) {
    //   if (evt.ctrlKey) {
    //     evt.preventDefault();
    //     evt.stopPropagation();
    //     onCtrlO(evt);
    //   }
    // }

    // ctrl+K shortcut
    // else if (evt.keyCode === monaco.KeyCode.KEY_K) {
    //   if (evt.ctrlKey) {
    //     evt.preventDefault();
    //     evt.stopPropagation();
    //     onCtrlK(evt);
    //   }
    // }

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
  };
  const options: EditorProps['options'] = {
    readOnly: false,
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
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
    ...monacoOptions,
  };

  /** if 'readOnly' is not provided then consider 'disabled' */
  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  console.log(value, language, 'language...');

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
        path="editor"
        key="editor"
        onChange={(value, e) =>
          onChange({
            preventDefault: () => {},
            target: { value },
          })
        }
        onMount={(editor, monaco) => {

          // disable `F1` command palette
          // editor.addCommand(monaco.KeyCode.F1, () => {});

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
          onPaste && editor.onDidPaste(() => onPaste(editor));

          // https://www.anycodings.com/1questions/1773746/how-do-i-insert-text-into-a-monaco-editor
          // editor.insertTextAtCurrentCursor = (text: any) => {
          //   let p = editor.getPosition();
          //   editor.executeEdits('', [
          //     {
          //       range: new monaco.Range(
          //         p.lineNumber,
          //         p.column,
          //         p.lineNumber,
          //         p.column
          //       ),
          //       text,
          //     },
          //   ]);
          // };
          onMount(editor, monaco);
          onLoad(editor);
          editorDidMount && editorDidMount(editor, monaco);
          editorIdRef.current = editor.getId();
          // @ts-ignore
          window.ife.set(editorIdRef.current, editor);
        }}
      />
    </div>
  );
};

export default Editor;
