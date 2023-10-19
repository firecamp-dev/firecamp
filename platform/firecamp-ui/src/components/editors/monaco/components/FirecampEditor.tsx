import { FC, useRef, useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import classnames from 'classnames';
// import formatXML from 'prettify-xml';
import _cloneDeep from 'lodash/cloneDeep';
import { _array, _clipboard } from '@firecamp/utils';
import { EEditorLanguage } from '@firecamp/types';

import { IFirecampEditor } from './FirecampEditor.interfaces';
import '../sass/FirecampEditor.sass';

// setupQueryEditor(buildClientSchema(schema));

const FirecampEditor: FC<IFirecampEditor> = ({
  options: {
    readOnly = false,
    height = '100%',
    width = 'auto',
    theme,
    language = EEditorLanguage.Json,
    value = '',
    placeholder = '',
    // useTabStops= true,
    // tabCompletion= "off",
    // lineNumbers= ()=> 1,
    monacoOptions = {},
  } = {},
  controlsConfig: propsControlsConfig = {
    show: false,
    position: 'vertical',
    collapsed: false,
    controls: ['copy', 'fold', 'wrap'],
  },
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onPaste = () => {},
  editorDidMount = (edt, monaco) => {
    /*
    edt.deltaDecorations(
      [],
      [
        {
          range: new monaco.Range(3, 1, 3, 1),
          options: {
            isWholeLine: true,
            className: "myContentClass",
            glyphMarginClassName: "myGlyphMarginClass"
          }
        }
      ]
    );

    var viewZoneId = null;
    edt.changeViewZones(function(changeAccessor) {
      var domNode = document.createElement("button");
      domNode.innerText = "Execute";
      domNode.style.background = "lightgreen";
      domNode.style.width = "100px";
      viewZoneId = changeAccessor.addZone({
        afterLineNumber: 10,
        heightInLines: 2,
        domNode: domNode
      });
    });

    var contentWidget = {
      domNode: null,
      getId: function() {
        return "my.content.widget";
      },
      getDomNode: function() {
        if (!this.domNode) {
          // this.domNode =  ReactDOM.findDOMNode(AA);
          this.domNode = document.createElement("button");
          this.domNode.innerHTML = "My content widget";
          this.domNode.style.background = "grey";
          this.domNode.onclick = e => console.log(e);
        }
        return this.domNode;
      },
      getPosition: function() {
        return {
          position: {
            lineNumber: 7,
            column: 8
          },
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
            monaco.editor.ContentWidgetPositionPreference.BELOW
          ]
        };
      }
    };
    // edt.addContentWidget(contentWidget);
    */
  },
}) => {
  /**
   * merge default config and prop config
   */
  let [controlsConfig, setControlsConfig] = useState({
    show: false,
    position: 'vertical',
    // Set control collapsed if text is not there
    collapsed: !(value || '').length,
    controls: ['copy', 'fold', 'wrap'],
    ...propsControlsConfig,
  });

  /**
   * Update controls by prop config and languages
   */
  useEffect(() => {
    if (controlsConfig) {
      let controls = _cloneDeep(
        ['copy', 'fold', 'wrap', ...(propsControlsConfig?.controls || [])] || []
      );

      if (['json', 'xml', 'yaml'].includes(language)) {
        if (monacoOptions?.readOnly !== true) {
          // If structured data then allow to prettify and not readOnly then allow to clear
          controls = [...controls, 'prettify', 'clear'];
        } else {
          // If structured data then allow to prettify
          controls = [...controls, 'prettify'];
        }

        _controlFns.wrap();
      } else if (monacoOptions?.readOnly !== true) {
        // Allow to clear editor if editor is editable
        controls = [...controls, 'clear'];
      }
      controls = _array.uniq(controls);

      if (controls !== controlsConfig?.controls) {
        setControlsConfig((ps) => {
          return {
            ...ps,
            controls,
          };
        });
      }
    }
  }, [language]);

  let editorRef = useRef(null);

  /**
   * set value through editor.setValue instead of value props to editor
   * reason is when value prop changes then text in editor get shown with default selection
   * more detail is here: https://github.com/react-monaco-editor/react-monaco-editor/issues/325#issuecomment-760449721
   */
  /*   useEffect(()=> {
    const position = editorRef.current.getPosition();
    editorRef.current.setValue(value);
    editorRef.current.setPosition(position);
  }, [value]) */

  let [isWrapped, setIsWrapped] = useState(false);
  let [isFolded, setIsFolded] = useState(false);
  let [isCollapsed, toggleCollapsed] = useState(
    controlsConfig?.collapsed || false
  );

  let _controlFns = {
    copy: () => {
      // custom copy code here
      try {
        if (editorRef.current) {
          let text = editorRef.current.getValue();
          if (!text) return;
          if (text) {
            _clipboard.copy(text);
            return Promise.resolve(true);
          }
        }
      } catch (e) {
        console.log(`Copy error`, e);
      }
      return Promise.reject();
    },
    fold: () => {
      try {
        if (editorRef.current) {
          setIsFolded(!isFolded);

          if (isFolded) {
            editorRef.current.trigger('unfold', 'editor.unfoldAll');
          } else {
            editorRef.current.trigger('fold', 'editor.foldAll');
          }
        }
      } catch (e) {
        console.log(`Fold error`, e);
      }
      let text = editorRef.current.getValue();
      if (text) {
        return Promise.resolve(true);
      }
      return Promise.reject();
    },
    wrap: () => {
      try {
        if (editorRef.current) {
          setIsWrapped(!isWrapped);
          editorRef.current.updateOptions({
            wordWrap: isWrapped ? 'off' : 'on',
          });
        }
        return Promise.resolve(true);
      } catch (e) {
        console.log(`Wrap error`, e);
        return Promise.reject();
      } /* 
      let text = editorRef.current.getValue();
      if (text) {
        return Promise.resolve(true);
      }
      return Promise.reject(); */
    },
    clear: () => {
      try {
        if (editorRef.current) {
          editorRef.current.setValue('');
        }
        return Promise.resolve(true);
      } catch (e) {
        console.log(`Clear error`, e);
        return Promise.reject();
      }
    },
    prettify: () => {
      try {
        if (editorRef.current) {
          let text = editorRef.current.getValue();

          // Prettify json
          if (language === 'json') {
            let stringified = JSON.stringify(JSON.parse(text), null, 4);
            editorRef.current.setValue(stringified);
          }
          // Prettify xml
          if (language === 'xml') {
            let formattedXml = formatXML(text);
            editorRef.current.setValue(formattedXml);
          }
        }
        return Promise.resolve(true);
      } catch (e) {
        console.log(`prettify error`, e);
        return Promise.reject();
      }
    },
  };

  // const [resizeListener, sizes] = useResizeAware();

  // useEffect(() => {
  //   // console.log("Do something with the new size values");
  //   let { width, height } = sizes;
  //   _resize({ width, height });
  // }, [sizes.width, sizes.height]);

  // let _resize = (width, height) => {
  //   console.log(width, height, editorRef);
  //   editorRef.current && editorRef.current.layout({ width, height });
  // };

  let options = { ...monacoOptions };

  let _renderControl = (ctrl: any) => {
    switch (ctrl) {
      case 'copy':
        return (
          <Ctrl
            key="copy"
            name="Copy"
            onClick={_controlFns.copy}
            className={
              'ic-duplicat_1 p-1 flex items-center border-app-foreground border justify-center bg-focus4 mb-1 rounded-3xl h-7 w-7 hover:bg-focusColor hover:text-app-foreground'
            }
          />
        );
      case 'fold':
        return (
          <Ctrl
            key="fold"
            name="Fold"
            isActionDone={isFolded}
            onClick={_controlFns.fold}
            className={
              'flex items-center border-app-foreground border justify-center bg-focus4 mb-1 rounded-3xl h-7 w-7 hover:bg-focusColor hover:text-app-foreground ic-text-fold'
            }
          />
        );
      case 'wrap':
        return (
          <Ctrl
            key="wrap"
            name="Wrap"
            isActionDone={isWrapped}
            onClick={_controlFns.wrap}
            className={
              'flex items-center border-app-foreground border justify-center bg-focus4 mb-1 rounded-3xl h-7 w-7 hover:bg-focusColor hover:text-app-foreground ic-wrap_text'
            }
          />
        );
      case 'clear':
        return (
          <Ctrl
            key="clear"
            name="Clear"
            onClick={_controlFns.clear}
            className={
              'flex items-center border-app-foreground border justify-center bg-focus4 mb-1 rounded-3xl h-7 w-7 hover:bg-focusColor hover:text-app-foreground icv2-clear-icon'
            }
          />
        );
      case 'prettify':
        return (
          <Ctrl
            key="prettify"
            name="Prettify"
            onClick={_controlFns.prettify}
            className={
              'flex items-center border-app-foreground border justify-center bg-focus4 mb-1 rounded-3xl h-7 w-7 hover:bg-focusColor hover:text-app-foreground icv2-snippets-icon'
            }
          />
        );
      default:
        return <span />;
    }
  };

  const Controls = ({ controls = [] }) => {
    return (
      <div>
        {controls?.map((ctrl) => {
          return _renderControl(ctrl);
        })}
      </div>
    );
  };

  return (
    <>
      {controlsConfig?.show ? (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={classnames(
              { horizontal: controlsConfig?.position === 'horizontal' },
              'mt-2 w-7'
            )}
          >
            <div
              className={classnames(
                { collapsed: isCollapsed },
                'ic-more absolute -top-2 left-1 text-lg cursor-pointer p-0'
              )}
              onClick={() => {
                toggleCollapsed(!isCollapsed);
              }}
            ></div>
            {!isCollapsed ? (
              <Controls controls={controlsConfig.controls || []} />
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        ''
      )}
      <MonacoEditor
        width={width}
        height={height}
        language={language}
        theme={theme}
        value={value}
        options={Object.assign(
          {},
          {
            readOnly: !!readOnly,
            selectOnLineNumbers: false,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
          },
          options
        )}
        onChange={onChange}
        editorDidMount={(edt, monaco) => {
          /**
           * Allow comments for JSON language
           * Reference: https://github.com/microsoft/monaco-editor/issues/2426
           */
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: true,
            schemaValidation: 'error',
          });

          edt.onDidBlurEditorText(() => onBlur(edt, monaco));
          edt.onDidFocusEditorText(() => onFocus(edt, monaco));
          edt.onDidPaste(() => onPaste(edt, monaco));

          edt.insertTextAtCurrentCursor = (text: any) => {
            let p = edt.getPosition();
            edt.executeEdits('', [
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
          editorDidMount(edt, monaco);
          editorRef.current = edt;
        }}
        overrideServices={{
          openerService: {
            open: function () {
              // alert(`open called!` + JSON.stringify(arguments));
            },
          },
        }}
      />
    </>
  );
};

export default FirecampEditor;

const Ctrl: FC<ICtrl> = ({
  name = '',
  onClick,
  className = '',
  isActionDone = false,
}) => {
  let [showAnimation, toggleAnimation] = useState(false);
  let [animation, setAnimation] = useState('');

  let _onClick = async (e: any) => {
    let result: boolean;
    try {
      result = await onClick(e);
    } catch (e) {}
    toggleAnimation(true);
    let animationText = '';
    if (result === true) {
      if (name.toLowerCase() === 'copy') {
        animationText = 'Copied!';
      } else if (name.toLowerCase() === 'wrap') {
        animationText = isActionDone ? 'Wrapped!' : 'Unwrapped!';
      } else if (name.toLowerCase() === 'fold') {
        animationText = isActionDone ? 'Folded!' : 'Unfolded!';
      }
    } else {
      animationText = '';
    }

    if (animationText !== animation) {
      setAnimation(animationText);
    }

    setTimeout(() => {
      toggleAnimation(false);
      if (animationText !== '') {
        setAnimation('');
      }
    }, 2000);
  };

  return (
    <div
      data-tip={name}
      data-place="left"
      className={className}
      onClick={_onClick}
      id={name}
    >
      {showAnimation ? (
        <span className="fc-sticky-note">{animation || ''}</span>
      ) : (
        ''
      )}
    </div>
  );
};

interface ICtrl {
  name?: string;
  onClick?: (e: any) => Promise<boolean>;
  className?: string;
  isActionDone?: boolean;
}
