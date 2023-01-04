//@ts-nocheck
import { _env } from '@firecamp/utils';
import * as monaco from 'monaco-editor';
import { headers, contentTypes, charsets, encodings } from './headerList';

const mockVariables = _env.mockVariablesList.reduce((c, d) => {
  c[d.api.firecamp] = d.description;
  return c;
}, {});

// let vars = {
//   name: "Nishchit",
//   startup: "Firecamp",
// };

function createDependencyProposals(
  range,
  variables,
  meta = { modeId: null, triggerCharacter: '' }
) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup

  const prepareInsertText = (v, triggerCharacter) => {
    let insertText = '';
    if (!triggerCharacter) {
      insertText = `{{${v}}}`;
    } else if (triggerCharacter == '{') {
      insertText = `{${v}}}`;
    } else if (triggerCharacter == '{{') {
      insertText = `${v}}}`;
    }

    // console.log(insertText, v)
    return insertText;
  };

  let varList = Object.keys(variables).map((v, i) => {
    let insertText = prepareInsertText(v, meta.triggerCharacter);
    return {
      label: v,
      kind: monaco.languages.CompletionItemKind.Variable,
      documentation: `value- ${variables[v]}`,
      insertText: insertText,
      range: range,
      sortText: 'a',
    };
  });

  let mockVarList = Object.keys(mockVariables).map((v, i) => {
    let insertText = prepareInsertText(v, meta.triggerCharacter);
    return {
      label: v,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: `${mockVariables[v]}`,
      insertText: insertText,
      range: range,
      sortText: 'z',
    };
  });

  let headerKeys = [];
  let headerValues = [];
  if (meta && meta.modeId == EEditorLanguage.HeaderKey) {
    headerKeys = headers.map((h, i) => {
      return {
        label: h.name,
        kind: monaco.languages.CompletionItemKind.Field,
        documentation: h.description,
        insertText: h.name,
        range: range,
        sortText: 'b',
      };
    });
  }
  if (meta && meta.modeId == EEditorLanguage.HeaderValue) {
    headerValues = contentTypes.map((h, i) => {
      return {
        label: h.name,
        kind: monaco.languages.CompletionItemKind.Field,
        documentation: h.description,
        insertText: h.name,
        range: range,
        sortText: 'b',
      };
    });
  }

  return [...mockVarList, ...headerKeys, ...headerValues, ...varList];

  return [
    {
      label: '"lodash"',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'The Lodash library exported as Node.js modules.',
      insertText: '"lodash": "*"',
      range: range,
    },
    {
      label: '"express"',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'Fast, unopinionated, minimalist web framework',
      insertText: '"express": "*"',
      range: range,
    },
    {
      label: '"mkdirp"',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'Recursively mkdir, like <code>mkdir -p</code>',
      insertText: '"mkdirp": "*"',
      range: range,
    },
    {
      label: '"my-third-party-library"',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'Describe your library here',
      insertText: '"${1:my-third-party-library}": "${2:1.2.3}"',
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
  ];
}

export default (variables = vars) => ({
  triggerCharacters: ['.', '{'],
  provideCompletionItems: (model, position, token) => {
    // find out if we are completing a property in the 'dependencies' object.
    // var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
    // var match = textUntilPosition.match(/"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/);
    // if (!match) {
    //     return { suggestions: [] };
    // }
    var word = model.getWordUntilPosition(position);

    // let triggerCharLength = token.triggerCharacter.length;
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    let triggerCharacter = '';
    let triggerRange = {
      tartLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: position.column - 2,
      endColumn: position.column,
    };
    let prev2CharsBeforeTrigger = model.getValueInRange(triggerRange);

    // console.log(prev2CharsBeforeTrigger, prev2CharsBeforeTrigger.substr(prev2CharsBeforeTrigger.length - 1));

    if (prev2CharsBeforeTrigger == '{{') {
      triggerCharacter = '{{';
    } else if (
      prev2CharsBeforeTrigger.substr(prev2CharsBeforeTrigger.length - 1) == '{'
    ) {
      // if l ast character is "{" then trigger character will be single.
      // ex prev2CharsBeforeTrigger = "/{" then triggerCharacter = "{"
      triggerCharacter = '{';
    } else {
      triggerCharacter = '';
    }

    return {
      suggestions: createDependencyProposals(range, variables, {
        modeId: model.getLanguageId(),
        triggerCharacter: triggerCharacter,
      }),
    };
  },
});
