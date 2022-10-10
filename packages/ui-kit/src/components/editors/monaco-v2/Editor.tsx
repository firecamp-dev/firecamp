import { FC, useEffect } from 'react';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';
import cx from 'classnames';
import { IEditor } from './Editor.interface';
import MonacoFirecampLangInit, {
  SetCompletionProvider,
} from '../monaco/lang/init';

const Editor: FC<IEditor> = ({
  value,
  onChange = () => {}, // similar DOM event, e = { preventDefault, target }
  onBlur,
  onFocus,
  onPaste,
  onLoad = (edt) => {},
  disabled = false,
  autoFocus = false,
  language = 'json',
  monacoOptions = {},
  controlsConfig = {
    show: false,
    position: 'vertical',
    collapsed: true,
  },
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
  useEffect(() => {
    MonacoFirecampLangInit();
    SetCompletionProvider('ife-header-key', { name: 'Nishchit' });
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (!window.ife) window.ife = new Map();
    return () => {
      //@ts-ignore
      if (window.ife) window.ife.delete(EditorIdRef);
    };
  }, []);

  const onMount: OnMount = (edt, monaco) => {
    // Add shortcuts on keydown event

    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;

    // edt.addCommand(KC.Enter, (e: any) => {
    //   console.log('ENTER...');
    //   onEnter(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KC.KeyS, (e: any) => {
    //   console.log('CMD+S...');
    //   onCtrlS(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KM.Shift | KC.KeyS, (e: any) => {
    //   console.log('CMD+Shift+S...');
    //   onCtrlShiftS(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KC.Enter, (e: any) => {
    //   console.log('CMD+ENTER...');
    //   onCtrlEnter(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KM.Shift | KC.Enter, (e: any) => {
    //   console.log('CMD+Shift+ENTER...');
    //   onCtrlShiftEnter(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KC.KeyO, (e: any) => {
    //   console.log('CtrlCmd + KEY_O...');
    //   onCtrlO(e);
    // });

    // edt.addCommand(KM.CtrlCmd | KC.KeyK, (e: any) => {
    //   console.log('CtrlCmd + KEY_K...');
    //   onCtrlK(e);
    // });

    // edt.addCommand((KC.Ctrl | KC.KeyS), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // edt.addCommand(KM.chord(KC.Ctrl | KC.Shift | KM.KeyS), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // edt.addCommand(KM.chord(KM.CtrlCmd | KC.KeyK, KM.CtrlCmd | KC.KeyM), (e)=> {
    //   console.log("I am in the Editor...")
    // });

    // edt.onKeyDown = (evt) => {
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
          edt.focus();
          let range = edt.getModel().getFullModelRange();
          edt.setPosition({ lineNumber: 1, column: range.endColumn });
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
    // ...monacoOptions,
  };

  /** if 'readOnly' is not provided then consider 'disabled' */
  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  console.log(value, language, 'language...');

  return (
    <div className={cx('relative h-full', className)}>
      <div className="fc-input-IFE-multiline-placeholder">
        <div>{!value ? placeholder || '' : ''}</div>
      </div>
      <MonacoEditor
        language={language}
        defaultValue={value}
        onChange={(value, e) =>
          onChange({
            preventDefault: () => {},
            target: { value },
          })
        }
        options={options}
        // height="90vh"
        onMount={(edt, monaco) => {
          /**
           * Allow comments for JSON language
           * Reference: https://github.com/microsoft/monaco-editor/issues/2426
           */
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: true,
            schemaValidation: 'error',
          });

          onBlur && edt.onDidBlurEditorText(() => onBlur(edt));
          onFocus && edt.onDidFocusEditorText(() => onFocus(edt));
          onPaste && edt.onDidPaste(() => onPaste(edt));

          // https://www.anycodings.com/1questions/1773746/how-do-i-insert-text-into-a-monaco-editor
          // edt.insertTextAtCurrentCursor = (text: any) => {
          //   let p = edt.getPosition();
          //   edt.executeEdits('', [
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
          onMount(edt, monaco);
          onLoad(edt);
          editorDidMount && editorDidMount(edt, monaco);
          // @ts-ignore
          window.ife.set(edt._id, edt);
        }}
      />
    </div>
  );
};

export default Editor;
