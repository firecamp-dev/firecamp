import { FC, useRef, useEffect, Fragment } from 'react';
import classnames from 'classnames';

import FirecampEditor from './FirecampEditor';
import '../sass/MultiLineIFE.sass';

import { IMultiLineIFE } from './MultiLineIFE.interfaces';

const MultiLineIFE: FC<IMultiLineIFE> = ({
  value = '',
  onChange = () => { }, // similar DOM event, e = { preventDefault, target }
  onBlur = () => { },
  onFocus = () => { },
  onLoad = (edt) => { },
  disabled = false,
  autoFocus = false,
  language = 'graphql',
  monacoOptions = {},
  controlsConfig = {
    show: false,
    position: 'vertical',
    collapsed: true,
  },
  placeholder = '',
  className='',
  editorDidMount = null, // || ()=> {},
  onEnter = () => { },
  onCtrlS = () => { },
  onCtrlShiftS = () => { },
  onCtrlO = () => { },
  onCtrlK = () => { },
  onCtrlEnter = () => { },
  onCtrlShiftEnter = () => { },
}) => {
  let { current: EditorIdRef } = useRef(null);

  useEffect(() => {
    return () => {
      //@ts-ignore
      if (window.ife) {
      //@ts-ignore
        window.ife.delete(EditorIdRef);
      }
    };
  }, []);

  let _onMount = (edt: any, monaco: any) => {
    // Add shortcuts on keydown event

    let KM = monaco.KeyMod;
    let KC = monaco.KeyCode;

    edt.addCommand(KC.ENTER, (e: any) => {
      console.log('ENTER...');
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

    edt.addCommand(KM.CtrlCmd | KC.Enter, (e: any) => {
      console.log('CMD+ENTER...');
      onCtrlEnter(e);
    });

    edt.addCommand(KM.CtrlCmd | KM.Shift | KC.Enter, (e: any) => {
      console.log('CMD+Shift+ENTER...');
      onCtrlShiftEnter(e);
    });

    edt.addCommand(KM.CtrlCmd | KC.KEY_O, (e: any) => {
      console.log('CtrlCmd + KEY_O...');
      onCtrlO(e);
    });

    edt.addCommand(KM.CtrlCmd | KC.KEY_K, (e: any) => {
      console.log('CtrlCmd + KEY_K...');
      onCtrlK(e);
    });

    // edt.addCommand((KC.Ctrl | KC.KEY_S), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // edt.addCommand(KM.chord(KC.Ctrl | KC.Shift | KM.KEY_S), (e)=> {
    //   console.log("CTRL+S...");
    //   onCtrlS();
    // });

    // edt.addCommand(KM.chord(KM.CtrlCmd | KC.KEY_K, KM.CtrlCmd | KC.KEY_M), (e)=> {
    //   console.log("I am in the Editor...")
    // });

    edt.onKeyDown = (evt: any) => {
      console.log(evt);
      // ctrl+s or cmd+s shortcut
      if (evt.keyCode === monaco.KeyCode.KEY_S) {
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
    };

    EditorIdRef = edt._id;
    // @ts-ignore
    if (!window.ife) {
      // @ts-ignore
      window.ife = new Map();
    }
    // @ts-ignore
    window.ife.set(edt._id, edt);
    onLoad(edt);

    // set focus to Editor if autoFocus is given true to Input
    if (autoFocus === true) {
      try {
        setTimeout(() => {
          edt.focus();
          let range = edt.getModel().getFullModelRange();
          edt.setPosition({ lineNumber: 1, column: range.endColumn });
        }, 200);
      } catch (e) { }
    }
  };

  let options = {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 14,
    links: false,
    lineNumbersMinChars: 5,
    overviewRulerLanes: 0,
    minimap: { enabled: false },
    matchBrackets: false,
    renderLineHighlight: 'none',

    smoothScrolling: true,
    scrollBeyondLastLine: false,

    contextmenu: false,
    scrollbar: {
      // vertical: "hidden",
      // horizontal: "hidden",
      handleMouseWheel: true,
      useShadows: false,

      verticalScrollbarSize: 5,
      horizontalScrollbarSize: 5,
    },
    ...monacoOptions,
  };

  if (!monacoOptions?.hasOwnProperty('readOnly')) {
    options.readOnly = disabled;
  }

  return (
    <div className={classnames("relative h-full",className)}>
      <div className="fc-input-IFE-multiline-placeholder">
        <div>{!value ? placeholder || '' : ''}</div>
      </div>
      <FirecampEditor
        controlsConfig={controlsConfig}
        options={{
          language,
          // theme: IFEThemes.DARK,
          value,
          readOnly:
            typeof disabled == 'boolean' ? disabled : disabled == 'disabled',
          height: options?.height || '100%',
          monacoOptions: options,
        }}
        onChange={(value, e = {}) =>
          onChange({
            ...e,
            preventDefault: () => { },
            target: { value },
          })
        }
        editorDidMount={(edt, monaco) => {
          _onMount(edt, monaco);
          editorDidMount && editorDidMount(edt, monaco);
        }}
        onBlur={onBlur}
        // onBlur={_fns._onBlur}
        onFocus={(e: any) => onFocus(e)}
      />
    </div>
  );
};

export default MultiLineIFE;
