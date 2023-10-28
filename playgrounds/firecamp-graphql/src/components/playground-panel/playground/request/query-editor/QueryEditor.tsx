import { useRef, useEffect } from 'react';
import MD from 'markdown-it';
import { shallow } from 'zustand/shallow';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import _upperFirst from 'lodash/upperFirst';
// import { parse as GraphQLParse } from "graphql";
import { print } from 'graphql/language/printer';
import { parse as GraphQLParse } from 'graphql/language/parser';
import { buildClientSchema } from 'graphql';
import { _misc } from '@firecamp/utils';
import { Column } from '@firecamp/ui';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter.css';
// import "codemirror/theme/idea.css";
// import "codemirror/mode/javascript/javascript.js";

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
//
import 'codemirror/addon/dialog/dialog';
import 'codemirror/keymap/sublime';

import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'codemirror-graphql/info';
import 'codemirror-graphql/jump';

import '../sass/CM-Lint.css';
import '../sass/CM-Show-hint.css';
import '../sass/CM-Info.css';
import '../sass/CM-foldgutter.css';
import '../sass/CM-Jump.css';
import '../sass/CM-Main.css';

import getQueryFacts, {
  getCurrentOperation,
} from '../../../../../services/graphql.service';
import Controls from '../statusbar/Controls';
import { useStore } from '../../../../../store';
import { EQueryTypes } from '../../../../../types';

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;
const md = new MD();

const QueryEditor = ({
  value = '',
  onChange,
  isQueryDirty,
  toggleQueryDirty,
}) => {
  const { schema } = useStore(
    (s: any) => ({ schema: s.runtime.schema }),
    shallow
  );

  const clientSchemaRef = useRef({});
  const editorRef = useRef<any>({});

  const clientSchema = schema ? buildClientSchema(schema) : null;

  //when value/query will ge generated from explorer or other source like `Q|M|S` buttons then update them in playground
  useEffect(() => {
    const currentCursor = editorRef.current.getCursor();
    if (value != editorRef.current?.getValue()) {
      // console.log(editorRef.current, "editorRef?.current")
      editorRef.current?.setValue(value || '');

      //the cursor always set to first line after .setValue, so need to set prev cursor position after setting value
      editorRef.current?.focus();
      editorRef.current?.setCursor(currentCursor);
      editorRef.current?.scrollIntoView(
        // { line: currentCursor.line + 5, char: currentCursor.ch },
        { line: currentCursor.line, char: currentCursor.ch },
        20
      );
      // console.log(currentCursor)
    }
  }, [value]);

  if (clientSchema) {
    clientSchemaRef.current = clientSchema;
  }

  const updateCurrentQuery = (_) => {};
  const _onUpdateQuery = _misc.debounce(400, (q) => {
    onChange(q);
    // toggleQueryDirty(true);
  });
  const _onCallGQLRequest = (e) => {
    const queryObject = _onCursorGetCurrentOperation(e);
    // ctx_onSendRequest(queryObject.value, queryObject.value.variables);
  };

  const _onUpdateCurrentQuery = (plg) => {
    updateCurrentQuery({
      name: plg.name || '',
      __meta: { type: plg.__meta.type || EQueryTypes.Query },
    });
  };

  const _onCursorGetCurrentOperation = (e, currentQuery = {}) => {
    // console.log(`clientSchema`, clientSchema);
    try {
      // console.log(`currentQuery`, currentQuery);
      // debugger;
      let currentOperation = getCurrentOperation(e, currentQuery);
      let operation: any = {};
      let queryPayload = {};

      operation = getQueryFacts(
        clientSchemaRef.current || {},
        print(currentOperation)
      );
      // debugger

      if (operation && operation.operations && operation.operations.length) {
        let q = operation.operations[0];

        queryPayload = Object.assign(q, {
          name: q.name || _upperFirst[q.__meta.type],
          value: {
            query: q.value.query,
            variables: q.value.variables,
          },
          __meta: {
            type: EQueryTypes[_upperFirst(q.__meta.type)],
          },
          variableToType: q.variableToType || {},
        });
        delete queryPayload['type'];

        // console.log(`queryPayload`, queryPayload);
        _onUpdateCurrentQuery(queryPayload);
        return queryPayload;
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  const _debounce_onCursorGetCurrentOperation = _misc.debounce(
    500,
    _onCursorGetCurrentOperation
  );

  const placeholder = `# Welcome to Firecamp GraphQL Client.
# run operation Cmd/Ctrl + Enter.

${print(GraphQLParse(`query MyQuery{__typename }`))}`;

  return (
    <Column flex={1} height="100%" overflow="auto">
      <CodeMirror
        value={''}
        autoCursor={true}
        options={{
          tabSize: 4,
          mode: 'graphql',
          placeholder,
          autoRefresh: true,
          lineNumbers: true,
          lineWrapping: true,

          theme: 'graphiql',
          keyMap: 'sublime',
          autoCloseBrackets: true,
          matchBrackets: true,
          showCursorWhenSelecting: true,
          readOnly: false,
          foldGutter: true,
          // lint: true,
          lint: {
            schema: clientSchema,
          },
          hintOptions: {
            schema: clientSchema,
            closeOnUnfocus: false,
            completeSingle: false,
          },
          info: {
            schema: clientSchema,
            renderDescription: (text) => md.render(text),
            onClick: (reference) => console.log(reference),
          },
          // jump: {
          //   schema: clientSchema,
          //   onClick: reference => console.log(reference)
          // },
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          extraKeys: {
            'Ctrl-Q': (cm) => {
              cm.foldCode(cm.getCursor());
            },
            'Ctrl-Enter': (e) => _onCallGQLRequest(e),
            'Cmd-Enter': (e) => _onCallGQLRequest(e),
            'Cmd-Space': (cm) => cm.showHint({ completeSingle: true }),
            'Ctrl-Space': (cm) => cm.showHint({ completeSingle: true }),
            'Alt-Space': (cm) => cm.showHint({ completeSingle: true }),
            'Shift-Space': (cm) => cm.showHint({ completeSingle: true }),
            'Shift-Ctrl-P': (cm) =>
              cm.setValue(print(GraphQLParse(cm.getValue()))),
            'Shift-Cmd-P': (cm) =>
              cm.setValue(print(GraphQLParse(cm.getValue()))),
          },
          allowDropFileTypes: [
            'text',
            'text/plain',
            'application/json',
            'application/yaml',
          ],
        }}
        // onBeforeChange={(cm, data, value, next) => {}}
        onChange={(e, data, query) => {
          // console.log(query, "query.....");
          if (value != query) {
            _onUpdateQuery(query); //to avoid race condition here when query change from outer source
          }
        }}
        onKeyUp={(editor: any, e: any) => {
          // console.log(e, e.key, e.metaKey, e.ctrlKey)
          if (AUTO_COMPLETE_AFTER_KEY.test(e.key) && !e.metaKey && !e.ctrlKey) {
            editor.execCommand('autocomplete');
          }
        }}
        editorDidMount={(e) => {
          editorRef.current = e;
          // console.log(11111, e);
          // e.setOption("extraKeys", {});
        }}
        onCursor={(e: any, d) => {
          // console.log(e, d, 77777, e.getCursor());

          let cursor = e.getCursor();
          let lastLineNo = e.lineCount() - 1;

          // console.log(cursor, lastLineNo, currentQueryRef.current);
          // debugger;
          /**
           * if playground is being updated from external sources (like explorer) then It's default cursor position is always reset to last line
           * due to that currentOperation (query) will reset to last query of the playground. and Explorer's feed will changes suddenly at last query.
           * to avoid it, if it founds cursor at last line then set current active query to get the same currentOperation from the GraphQLService
           **/
          // if (cursor.line == lastLineNo) {
          //   _debounce_onCursorGetCurrentOperation(e, currentQueryRef.current);
          // } else {
          //   _debounce_onCursorGetCurrentOperation(e);
          // }
        }}
        onCursorActivity={(e) => {
          // console.log('onCursorActivity', e.getCursor())
        }}
        onSelection={(e, d) => {
          /*  */
        }}
      />
      <Controls
        isQueryDirty={isQueryDirty}
        toggleQueryDirty={toggleQueryDirty}
      />
    </Column>
  );
};

export default QueryEditor;

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
