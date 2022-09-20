### Interactoive Firecamp Editor
IFE is an Editor with advance features like interative variables, auto completion and hover preview support. It'll powers the single-line input to code editor functionality in Firecamp.

### Usage

```js
    <FirecampEditor
        options={{
            language: "ife_text",
            theme: "ife-theme-dark",
            value: url,
            singleLine: true,
            readOnly: false,
            height: 24,
            options: {
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 16,
            links: false,
            overviewRulerLanes: 0,
            minimap: { enabled: false },
            automaticLayout: false,
            matchBrackets: false,
            renderLineHighlight: "none",
            contextmenu: false,
            scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
                handleMouseWheel: false,
                useShadows: false
            }
            }
        }}
        onChange={value =>
            onChangeURL({
            preventDefault: _ => {},
            target: { type: "text", value }
            })
        }
        editorDidMount={edt => {
            edt._meta = {
            name: "Nishchit"
            };
        }}
        // onBlur={_fns._onBlur}
        // onFocus={_fns._onFocus}
        />
```