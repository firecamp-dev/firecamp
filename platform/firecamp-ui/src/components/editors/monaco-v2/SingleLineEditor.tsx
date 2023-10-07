import { FC, useEffect, useRef, memo, ReactNode } from 'react';
import isEqual from 'react-fast-compare';
import cx from 'classnames';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';
import { EEditorLanguage, EEditorTheme } from '@firecamp/types';
import { IEditor } from './Editor.interface';

type TSLEditor = {
  name?: string;
  type: string | number;
  loading?: ReactNode;
  style?: object;
};

const SingleLineEditor: FC<IEditor & TSLEditor> = ({
  type = 'text',
  name,
  value,
  disabled = false,
  autoFocus = false,
  language = EEditorLanguage.Json,
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
  useEffect(() => {
    // console.log('this is re-rendering <SingleLineEditor />');
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
     * disable `Find` widget
     * @ref: https://github.com/microsoft/monaco-editor/issues/287#issuecomment-328371787
     */
    // eslint-disable-next-line no-bitwise
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {});

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
    onPaste &&
      editor.onDidPaste((l) => {
        onPaste(editor.getModel().getValueInRange(l.range), editor);
      });

    editor.onKeyDown((evt: any) => {
      switch (evt.keyCode) {
        /** shift command is not recognizable in Monaco atm. so used this keyDown event for SHIFT + TAB */
        case monaco.KeyCode.Tab:
          // console.log(editor.getId(), 'tab triggered');
          //@ts-ignore
          if (!window.editors) return;
          // @ts-ignore
          const mapKeys = [...window.editors.keys()];
          const currentEditor = localStorage.getItem('currentEditor');
          const currentIndex = mapKeys.findIndex((k) => k == currentEditor);

          // SHIFT+TAB
          if (evt.shiftKey) {
            let prevIndex = currentIndex - 1;
            // @ts-ignore
            let et = window.editors.get(mapKeys[prevIndex]);
            editor.setSelection(new monaco.Range(0, 0, 0, 0));
            if (et) {
              console.log(et.getId(), 'shift+tab');
              evt.preventDefault();
              evt.stopPropagation();
              const range = et?.getModel()?.getFullModelRange();
              et.setSelection(range);
              et.focus();
            } else {
              //todo:  this is experimental, if no Editor ref found then blur it naturally with browser DOM API
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }
          } else {
            /**
             * this command is applied to all editors which is a bug, thus last Edt's command will be considered for all
             * in this case the id of editor will be the same for all editor which is not correct
             *
             *  @solution: currently we're using localStorage to set id on focus and manage tab event
             *
             * issue: https://github.com/microsoft/monaco-editor/issues/2947
             */

            const nextIndex = currentIndex + 1;
            console.log(currentIndex, nextIndex, 9999);
            // @ts-ignore
            const et = window.editors.get(mapKeys[nextIndex]);
            editor.setSelection(new monaco.Range(0, 0, 0, 0));
            if (et) {
              // console.log(et.getId(), 'tab');
              evt.preventDefault();
              evt.stopPropagation();
              const range = et?.getModel()?.getFullModelRange();
              et.setSelection(range);
              et.focus();
            } else {
              //todo:  this is experimental, if no Editor ref found then blur it naturally with Browser DOM API
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }
          }
          break;

        case monaco.KeyCode.Enter:
          /**
           * ctrl+enter or cmd+enter shortcut
           * It'll also prevent new line on (ctrl | cmd) + enter
           */
          if (evt.ctrlKey || evt.metaKey) {
            evt.preventDefault();
            evt.stopPropagation();
            if (evt.shiftKey) {
              console.log('ctrl + shift + enter');
            } else {
              editor.trigger('', 'acceptSelectedSuggestion', {});
              onCtrlEnter(evt);
            }
          } else {
            // if suggestion widget is opened then ignore onEnter custom event
            //@ts-ignore
            const contentWidget = editor._contentWidgets['editor.widget.suggestWidget'];
            let isWidgetOpened = !!contentWidget; // note: some times (first render) it's value is undefined
            if (contentWidget) isWidgetOpened = !contentWidget.widget._hidden;
            // console.log(isWidgetOpened, 'isWidgetOpened');
            if (!isWidgetOpened) {
              evt.preventDefault();
              evt.stopPropagation();
              onEnter(evt);
            }
          }
          break;

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
    // fontFamily: 'lato',
    // fontFamily: "'Open Sans', sans-serif",
    fontFamily: `"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
    fontSize: 14,
    fontWeight: 'normal',
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

    wordWrap: 'off',
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollBeyondLastColumn: 0,
    scrollbar: {
      horizontal: 'hidden',
      vertical: 'hidden',
      // avoid cannot scroll page when hover monaco
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
    quickSuggestions: false, 
    tabCompletion: 'off',
    ...monacoOptions,
  };

  /** if 'readOnly' is not provided then consider 'disabled' */
  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  // console.log(value, language, 'language...');
  value = type === 'number' ? '' + value : value;
  /**
   * 1. Check if number or not, if number then convert to string and show
   * 2. Convert multiline string into single line
   */
  //  value = value.replace(/[\n\r]/g, '');

  /**
   * @note: Editor will reset the default theme on render,
   *        so fetch previously set theme from localStorage and set to editor
   */
  let editorTheme: string = EEditorTheme.Dark;
  if (localStorage) {
    editorTheme = localStorage.getItem('editorTheme') || EEditorTheme.Lite;
  }

  return (
    <>
      {placeholder && !value ? (
        <div className="select-auto absolute top-0 left-0 text-input-placeholder text-lg leading-5	">
          {placeholder}
        </div>
      ) : (
        <></>
      )}
      <div className={cx('select-auto', className, { 'opacity-50': disabled })} style={style}>
        <MonacoEditor
          language={language}
          defaultValue={value}
          value={value}
          options={options}
          height={height}
          path={path}
          key={path}
          theme={editorTheme}
          loading={loading || <></>}
          onChange={(newValue) => {
            newValue = newValue.replace(/[\n\r]/g, '');
            if (type === 'number') {
              const val = !isNaN(Number(newValue))
                ? newValue === '0'
                  ? newValue
                  : Number(newValue) !== 0
                  ? Number(newValue)
                  : ''
                : value;
              onChange({
                preventDefault: () => {},
                target: {
                  value: val,
                  name,
                },
              });
            } else {
              // console.log(newValue);
              onChange({
                preventDefault: () => {},
                target: { value: newValue, name },
              });
            }
          }}
          onMount={(editor, monaco) => {
            onMount(editor, monaco);
          }}
        />
      </div>
    </>
  );
};

export default memo(SingleLineEditor, (p, n) => {
  const pp = {
    type: p.type,
    name: p.name,
    value: p.value,
    disabled: p.disabled,
    autoFocus: p.autoFocus,
    language: p.language,
    // monacoOptions: p.monacoOptions,
    // placeholder: p.placeholder,
    className: p.className,
    style: p.style,
    height: p.height,
    path: p.path,
  };
  const np = {
    type: n.type,
    name: n.name,
    value: n.value,
    disabled: n.disabled,
    autoFocus: n.autoFocus,
    language: n.language,
    // monacoOptions: n.monacoOptions,
    // placeholder: n.placeholder,
    className: n.className,
    style: n.style,
    height: n.height,
    path: n.path,
  };
  return isEqual(pp, np);
});
