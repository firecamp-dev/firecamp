import { FC, useEffect, useRef, memo } from 'react';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';
import cx from 'classnames';
import { IEditor } from './Editor.interface';
import MonacoFirecampLangInit, {
  SetCompletionProvider,
} from '../monaco/lang/init';

type TSLEditor = {
  type: 'text' | 'number';
};

const SingleLineEditor: FC<IEditor & TSLEditor> = ({
  type = 'text',
  value,
  disabled = false,
  autoFocus = false,
  language = 'json',
  monacoOptions = {},
  placeholder = '',
  className = '',
  style = {},
  height = 50,
  path,
  loading,
  onChange = () => {}, // similar DOM event, e = { preventDefault, target }
  onBlur,
  onFocus,
  onPaste,
  onLoad = (editor) => {},
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
  // useEffect(() => {
  //   MonacoFirecampLangInit();
  //   SetCompletionProvider('ife-header-key', { name: 'Nishchit' });
  // }, []);

  useEffect(() => {
    console.log('this is re-rendering <SingleLineEditor />');
    //@ts-ignore
    if (!window.ife) window.ife = new Map();
    return () => {
      //@ts-ignore
      if (window.ife) window.ife.delete(editorIdRef.current);
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
      // try {
      //   setTimeout(() => {
      //     editor.focus();
      //     let range = editor.getModel().getFullModelRange();
      //     editor.setPosition({ lineNumber: 1, column: range.endColumn });
      //   }, 200);
      // } catch (e) {}
    }
  };
  const options: EditorProps['options'] = {
    readOnly: false,
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
    links: false,
    minimap: { enabled: false },
    matchBrackets: 'never',

    smoothScrolling: true,
    scrollBeyondLastLine: false,
    contextmenu: false,

    glyphMargin: false,
    folding: false,
    lineNumbers: 'off',
    // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
    lineNumbersMinChars: 0,
    lineDecorationsWidth: 0,
    // wrappingColumn: 1,
    // ...monacoOptions,

    fontWeight: 'normal',
    wordWrap: 'off',
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollBeyondLastColumn: 0,
    scrollbar: {
      horizontal: 'hidden',
      vertical: 'hidden',
      // avoid can not scroll page when hover monaco
      alwaysConsumeMouseWheel: false,
    },
    // disable `Find`
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'never',
      seedSearchStringFromSelection: 'never',
    },
    // see: https://github.com/microsoft/monaco-editor/issues/1746
    wordBasedSuggestions: false,
    // avoid highlight hover word
    occurrencesHighlight: false,
    cursorStyle: 'line-thin',
    // hide current row highlight grey border
    // see: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html#renderlinehighlight
    renderLineHighlight: 'none',
    // default selection is rounded
    roundedSelection: false,
    hover: {
      // unit: ms
      // default: 300
      delay: 100,
    },
    acceptSuggestionOnEnter: 'on',
    // auto adjust width and height to parent
    // see: https://github.com/Microsoft/monaco-editor/issues/543#issuecomment-321767059
    automaticLayout: true,
    // if monaco is inside a table, hover tips or completion may cause table body scroll
    fixedOverflowWidgets: true,

    suggestOnTriggerCharacters: false,
    tabCompletion: "off",
  };

  /** if 'readOnly' is not provided then consider 'disabled' */
  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  // console.log(value, language, 'language...');
  value = type === 'number' ? '' + value : value;
  /**
   * 1. Check if number or not, if number then convert to string and show
   * 2. Convert multiline string in to single line
   */
  //  value = value.replace(/[\n\r]/g, '');

  return (
    <>
      {placeholder && !value ? (
        <div className="urlbar-url-text-placeholder absolute top-0 left-0 text-inputPlaceholder text-lg ">
          {placeholder}
        </div>
      ) : (
        <></>
      )}
      <div className={cx(className)} style={style}>
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
            value = value.replace(/[\n\r]/g, '');
            console.log(value);
            onChange({
              preventDefault: () => {},
              target: { value },
            });
          }}
          onMount={(editor, monaco) => {
            editor.onDidFocusEditorWidget(() => {
              console.log(editor.getId(), 'Focus event triggerd ');
            });

            editor.onDidBlurEditorWidget(() => {
              console.log(editor.getId(), 'Blur event triggerd !');
            });

            /**
             * this command is applied to all editors which is a bug, thus last Edt's command will be sonsidered for all
             * in this case the id of editor will be the same for all editor which is not correct
             * 
             * issue: https://github.com/microsoft/monaco-editor/issues/2947
             */
            editor.addCommand(monaco.KeyCode.Tab, (e: any) => {
              console.log(editor.getId(), 'tab triggered');

              // //@ts-ignore
              // if (!window.ife) return;
              // // @ts-ignore
              // let mapKeys = [...window.ife.keys()];
              // let currentIndex = mapKeys.findIndex(
              //   (k) => k == editor.getId()
              // );
              // let nextIndex = currentIndex + 1;
              // // @ts-ignore
              // let et = window.ife.get(mapKeys[nextIndex]);
              // editor.setSelection(new monaco.Range(0, 0, 0, 0));
              // // console.log(currentIndex, et, 'et....', mapKeys, editor.getId());
              // if (et) {
              //   let range = et?.getModel()?.getFullModelRange();
              //   et.setSelection(range);
              //   et.focus();
              // } else {
              //   //todo:  this is experimental, if no Editor ref found then blur it naturally with Browser DOM API
              //   document.activeElement.blur();
              //   setTimeout(() => {
              //     document.activeElement.blur();
              //   });
              //   // document.activeElement.blur();
              //   // document.activeElement.blur();
              //   // document.activeElement.blur();
              //   // document.activeElement.blur();
              // }
            });

            // console.log(editor, monaco, 9999);
            /**
             * disable `Find` widget
             * @ref: https://github.com/microsoft/monaco-editor/issues/287#issuecomment-328371787
             */
            // eslint-disable-next-line no-bitwise
            // editor.addCommand(
            //   monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
            //   () => {}
            // );

            // disable press `Enter` in case of producing line breaks
            // editor.addCommand(monaco.KeyCode.Enter, (e) => {
            //   // State: https://github.com/microsoft/vscode/blob/1.56.0/src/vs/editor/contrib/suggest/suggestWidget.ts#L50
            //   // const StateOpen = 3;
            //   // if (
            //   //   editor._contentWidgets['editor.widget.suggestWidget'].widget
            //   //     .state !== StateOpen
            //   // ) {
            //   //   onEnter(editor.getValue());
            //   // } else {
            //   /**
            //    * Origin purpose: disable line breaks
            //    * Side Effect: If defining completions, will prevent `Enter` confirm selection
            //    * Side Effect Solution: always accept selected suggestion when `Enter`
            //    *
            //    * But it is hard to find out the name `acceptSelectedSuggestion` to trigger.
            //    *
            //    * Where to find the `acceptSelectedSuggestion` at monaco official documents ?
            //    * Below is some refs:
            //    * - https://stackoverflow.com/questions/64430041/get-a-list-of-monaco-commands-actions-ids
            //    * - command from: https://github.com/microsoft/vscode/blob/e216a598d3e02401f26459fb63a4f1b6365ec4ec/src/vs/editor/contrib/suggest/suggestController.ts#L632-L638
            //    * - https://github.com/microsoft/vscode/search?q=registerEditorCommand
            //    * - real list: https://github.com/microsoft/vscode/blob/e216a598d3e02401f26459fb63a4f1b6365ec4ec/src/vs/editor/browser/editorExtensions.ts#L611
            //    *
            //    *
            //    * Finally, `acceptSelectedSuggestion` appears here:
            //    * - `editorExtensions.js` Line 288
            //    */
            //   editor.trigger('', 'acceptSelectedSuggestion', {});
            //   // }
            // });

            // disable `F1` command palette
            editor.addCommand(monaco.KeyCode.F1, () => {});

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
            // onMount(editor, monaco);
            onLoad(editor);
            // editorDidMount && editorDidMount(editor, monaco);
            editorIdRef.current = editor.getId();

            // @ts-ignore
            if (!window.ife) window.ife = new Map();
            // @ts-ignore
            window.ife.set(editorIdRef.current, editor);
          }}
        />
      </div>
    </>
  );
};

export default memo(SingleLineEditor);
