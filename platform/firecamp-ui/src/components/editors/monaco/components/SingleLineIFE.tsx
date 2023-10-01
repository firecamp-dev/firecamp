import { FC, useRef, useEffect, memo } from 'react';
import classnames from 'classnames';
import { EEditorLanguage } from '@firecamp/types';
import FirecampEditor from './FirecampEditor';
import '../sass/SingleLineIFE.sass';

import { ISingleLineIFE } from './SingleLineIFE.interfaces';

const SingleLineIFE: FC<ISingleLineIFE> = ({
  type = 'text',
  name = '',
  value = '',
  language = EEditorLanguage.FcText,
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onPaste = () => {},
  singleLine = true,
  disabled = false,
  autoFocus = false,
  monacoOptions = {},
  className = '',
  placeholder = '',
  height = '',
  onEnter = () => {},
  onCtrlEnter = () => {},
  onCtrlS = () => {},
  onCtrlShiftS = () => {},
  onCtrlO = () => {},
  onCtrlK = () => {},
}) => {
  let { current: EditorIdRef } = useRef(null);

  useEffect(() => {
    return () => {
      // @ts-ignore
      if (window.ife) {
        // @ts-ignore
        window.ife.delete(EditorIdRef);
      }
    };
  }, []);

  useEffect(() => {
    // console.log("I am rendering too often....");
  });

  let _onMount = (edt: any, monaco: any) => {
    console.log(edt, 'editor...');
    EditorIdRef = edt._id;
    // @ts-ignore
    if (!window.ife) {
      // @ts-ignore
      window.ife = new Map();
    }
    // @ts-ignore
    window.ife.set(edt._id, edt);

    let KM = monaco.KeyMod;
    let KC = monaco.KeyCode;

    //stop allowing enter for single line IFE
    edt.addCommand(
      KC.Enter,
      (e: any) => {
        // avoid Enter event to go for new Line, Single Line Input, and execute callback fn
        onEnter(e);
      },
      '!suggestWidgetgetVisible'
    );

    edt.addCommand(monaco.KeyCode.Tab, (e: any) => {
      // document.activeElement.blur();
      //@ts-ignore
      if (!window.ife) return;
      // @ts-ignore
      let mapKeys = [...window.ife.keys()];
      let currentIndex = mapKeys.findIndex((k) => k == edt._id);
      let nextIndex = currentIndex + 1;
      // @ts-ignore
      let et = window.ife.get(mapKeys[nextIndex]);
      edt.setSelection(new monaco.Range(0, 0, 0, 0));
      if (et) {
        let range = et?.getModel()?.getFullModelRange();
        et.setSelection(range);
        et.focus();
      } else {
        //todo:  this is experimental, if no Editor ref found then blur it naturally with Browser DOM API
        document.activeElement.blur();
        document.activeElement.blur();
        document.activeElement.blur();
      }
    });

    /**
     * TOdo: this command is not working
     */
    edt.addCommand(KM.chord(KM.CtrlCmd | KC.ENTER), (e: any) => {
      console.log('CtrlCmd + ENTER...');
      onEnter(e);
    });

    edt.addCommand(KM.CtrlCmd | KC.KEY_S, (e: any) => {
      console.log('CMD+S...');
      onCtrlS(e);
    });

    edt.addCommand(KM.CtrlCmd | KM.Shift | KC.KEY_S, (e: any) => {
      console.log('CMD+Shift+S...');
      onCtrlShiftS(e);
    });

    edt.addCommand(KM.CtrlCmd | KC.KEY_O, (e: any) => {
      console.log('CtrlCmd + KEY_O...');
      onCtrlO(e);
    });

    edt.addCommand(KM.CtrlCmd | KC.KEY_K, (e: any) => {
      console.log('CtrlCmd + KEY_K...');
      onCtrlK(e);
    });

    // Prevent default event on Shift+ENTER
    edt.addCommand(KM.Shift | KC.Enter, (e: any) => {
      console.log('Shift+ENTER...', e);

      // This command is void command to prevent default event. (Prevent: New line on Shift+ENTER)
    });

    edt.onKeyDown((evt: any) => {
      /**
       * Shift command is not recognisable in Monaco atm. so used this keyDown event for SHIFT + TAB
       */
      if (evt.keyCode === monaco.KeyCode.Tab) {
        if (evt.shiftKey) {
          // @ts-ignore
          if (!window.ife) return;
          // @ts-ignore
          let mapKeys = [...window.ife.keys()];
          let currentIndex = mapKeys.findIndex((k) => k == edt._id);
          let prevIndex = currentIndex - 1;
          // @ts-ignore
          let et = window.ife.get(mapKeys[prevIndex]);
          edt.setSelection(new monaco.Range(0, 0, 0, 0));
          if (et) {
            evt.preventDefault();
            evt.stopPropagation();
            let range = et?.getModel()?.getFullModelRange();
            et.setSelection(range);
            et.focus();
          } else {
            //todo:  this is experimental, if no Editor ref found then blur it naturally with Browser DOM API
            document.activeElement.blur();
            document.activeElement.blur();
            document.activeElement.blur();
          }
        }
      } else if (evt.keyCode === monaco.KeyCode.Enter) {
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
            onCtrlEnter(evt);
          }
        }
      }

      // ctrl+s or cmd+s shortcut
      else if (evt.keyCode === monaco.KeyCode.KEY_S) {
        if (evt.ctrlKey || evt.metaKey) {
          evt.preventDefault();
          evt.stopPropagation();

          if (evt.shiftKey) {
            onCtrlShiftS(evt);
          } else {
            onCtrlS(evt);
          }
        }
      }

      // ctrl+O shortcut
      else if (evt.keyCode === monaco.KeyCode.KEY_O) {
        if (evt.ctrlKey) {
          evt.preventDefault();
          evt.stopPropagation();
          onCtrlO(evt);
        }
      }

      // ctrl+K shortcut
      else if (evt.keyCode === monaco.KeyCode.KEY_K) {
        if (evt.ctrlKey) {
          evt.preventDefault();
          evt.stopPropagation();
          onCtrlK(evt);
        }
      }
    });

    // edt.addCommand(monaco.KeyCode.Shift | monaco.KeyCode.KEY_V, (e)=> {});  // Shift command is not recognisable in Monaco atm.

    // console.log(edt, myBinding, "myBinding");

    // set autoFocus in editor
    if (autoFocus === true) {
      setTimeout(() => {
        edt.focus();
        let range = edt?.getModel()?.getFullModelRange();
        edt.setPosition({ lineNumber: 1, column: range?.endColumn });
      }, 200);
    }
  };

  let options = {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
    links: false,
    overviewRulerLanes: 0,
    matchBrackets: false,
    renderLineHighlight: 'none',
    contextmenu: false,

    // highlightActiveIndentGuide: false,
    // selectionHighlight: false,
    // renderLineHighlightOnlyWhenFocus: false,
    // renderLineHighlight: false,
    occurrencesHighlight: false,

    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
      handleMouseWheel: false,
      useShadows: false,
    },

    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    // wrappingColumn: 1,

    ...monacoOptions,
  };

  return (
    <div className="fc-input-wrapper">
      {placeholder && !value ? (
        <div className="absolute top-0 left-0 text-input-placeholder text-lg leading-5	">
          {placeholder}
        </div>
      ) : (
        <></>
      )}

      <div
        className={classnames(
          'fc-input-IFE',
          '-fc-input-IFE-focused',
          className
        )}
      >
        <FirecampEditor
          options={{
            language: language || EEditorLanguage.HeaderKey, // if values is undefined then use "FcText"
            // theme: EEditorTheme.Dark,
            value:
              /**
               * 1. Check if number or not, if number then convert to string and show
               * 2. Convert multiline string into single line
               */
              (
                '' + (type === 'number' ? value.toString() || '' : value || '')
              ).replace(/\n/g, ' '),
            // singleLine: true,
            readOnly:
              typeof disabled == 'boolean' ? disabled : disabled == 'disabled',
            height: height || 21,
            monacoOptions: options,
            placeholder: placeholder,
          }}
          onChange={(newValue) => {
            if (type === 'number') {
              onChange({
                preventDefault: () => {},
                target: {
                  value: !isNaN(Number(newValue))
                    ? newValue === '0'
                      ? newValue
                      : Number(newValue) !== 0
                      ? Number(newValue)
                      : ''
                    : value,
                  name,
                },
              });
            } else {
              onChange({
                preventDefault: () => {},
                target: { value: newValue, name },
              });
            }
          }}
          editorDidMount={(edt, monaco) => {
            _onMount(edt, monaco);
          }}
          onBlur={onBlur}
          // onBlur={_fns._onBlur}
          onFocus={(e: any) => onFocus(e)}
          onPaste={onPaste}
        />
      </div>
    </div>
  );
};

export default memo(SingleLineIFE);
