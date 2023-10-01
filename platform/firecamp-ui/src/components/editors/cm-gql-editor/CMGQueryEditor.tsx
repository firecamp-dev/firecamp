import { FC } from "react";
// import MD from 'markdown-it';
// const md = new MD();

import { Controlled as CodeMirror } from 'react-codemirror2';

// import { parse as GraphQLParse } from "graphql";
import { print } from 'graphql/language/printer';
import { parse as GraphQLParse } from 'graphql/language/parser';

import { ICMGQueryEditor } from './CMGQueryEditor.interfaces'

import 'codemirror/lib/codemirror.css';
// import "codemirror/theme/idea.css";
// import "codemirror/mode/javascript/javascript.js";

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
// import "codemirror/addon/comment/comment";
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
// import "codemirror/addon/search/search";
// import "codemirror/addon/search/searchcursor";
// import "codemirror/addon/search/jump-to-line";
import 'codemirror/addon/dialog/dialog';
import 'codemirror/keymap/sublime';

import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'codemirror-graphql/info';
import 'codemirror-graphql/jump';

// import "./CM-Lint.css";
// import "./CM-Show-hint.css";
// import "./CM-Info.css";
// import "./CM-foldgutter.css";
// import "./CM-Jump.css";
// import "./CM-Main.css";

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

const CMGQueryEditor: FC<ICMGQueryEditor> = ({
  query = '',
  clientSchema = {},
  onRunQuery = () => { },
  onChangeQuery = () => { },
}) => {
  if (typeof query !== 'string') return <span />;

  return (
    <CodeMirror
      value={query}
      autoCursor={true}
      onBeforeChange={(e, data, value) => {
        /*try {
            value = print(GraphQLParse(value));
            console.log(value, 333)
          }
          catch (e) {
            console.log(e)
          }*/
        onChangeQuery(value);
      }}
      options={{
        tabSize: 4,
        mode: 'graphql',
        lineNumbers: true,
        lineWrapping: true,

        theme: 'graphiql',
        keyMap: 'sublime',
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        readOnly: false,
        // foldGutter: {},
        // lint: {
        //   options: {},
        //   clientSchema: clientSchema,
        // },
        hintOptions: {
          schema: clientSchema,
          closeOnUnfocus: false,
          completeSingle: false
        },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      }}
      onChange={(editor, data, value) => {
        // console.log("editor change", data, value);
        // onChangeQuery(value)
      }}
      onKeyUp={(editor: any, e: any) => {
        // console.log(e, e.key, e.metaKey, e.ctrlKey)
        if (AUTO_COMPLETE_AFTER_KEY.test(e.key) && !e.metaKey && !e.ctrlKey) {
          editor.execCommand('autocomplete');
        }
      }}
      editorDidMount={(e) => {
        // console.log(11111, e);
        e.setOption('extraKeys', {
          'Cmd-Space': () => e.showHint({ completeSingle: true }),
          'Ctrl-Space': () => e.showHint({ completeSingle: true }),
          'Alt-Space': () => e.showHint({ completeSingle: true }),
          'Shift-Space': () => e.showHint({ completeSingle: true }),
          'Cmd-Enter': () => onRunQuery(),
          'Ctrl-Enter': () => onRunQuery(),
          'Shift-Ctrl-P': () => {
            e.setValue(print(GraphQLParse(e.getValue())));
          },
        });
      }}
      onCursorActivity={(e) => {
        // console.log('onCursorActivity', e)
      }}
      onSelection={(e, d) => console.log(e, d)}
      onCursor={(e, d) => {
        /*try {
             const operations = GraphQLParse(ctx_query).definitions.filter(
             def => def.kind === "OperationDefinition"
             );

             const cursor = e.getCursor();
             const cursorIndex = e.indexFromPos(cursor);

             console.log(cursor, cursorIndex, operations, 555);
             // Loop through all operations to see if one contains the cursor.
             for (let i = 0; i < operations.length; i++) {
             const operation = operations[i];
             if (
             operation.loc.start <= cursorIndex &&
             operation.loc.end >= cursorIndex
             ) {
             console.log(operation, 123, d);
             return operation;
             }
             }

             console.log("onCursor", e, d);
             }
             catch (e) {
             console.log(e)
             }*/
      }}
    />
  )

  // return (
  //   <CodeMirror
  //     options={{
  //       foldGutter: {
  //         minFoldSize: 4,
  //       },
  //       lint: {
  //         clientSchema: clientSchema,
  //       },
  //       hintOptions: {
  //         clientSchema: clientSchema,
  //         closeOnUnfocus: false,
  //         completeSingle: false,
  //       },
  //       info: {
  //         clientSchema: clientSchema,
  //         renderDescription: (text: string) => md.render(text),
  //         onClick: (reference: any) => console.log(reference),
  //       },
  //       jump: {
  //         clientSchema: clientSchema,
  //         onClick: (reference: any) => console.log(reference),
  //       },
  //     }}

  //   />
  // );
};

export default CMGQueryEditor;
