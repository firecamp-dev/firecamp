//@ts-nocheck
import { _env } from '@firecamp/utils'

const mockVariables = _env.mockVariablesList.reduce((c, d) => {
  c[d.api.firecamp] = d;
  return c;
}, {});

/**
 * @variables{}
 * @scope { workspace: [varkeys], project: [varkeys]} //todo
 */
export default (variables, scopes = { workspace: [], project: [] }) => ({
  provideHover: function (model, position, token) {
    var word = model.getWordAtPosition(position);
    if (!word || !word.word) return null;

    // console.log(
    //     token,
    //     model.findPrevBracket(position),
    //     model.getWordAtPosition(position),
    //     model.findEnclosingBrackets(position),
    //     model.matchBracket(position)
    // )
    // let tokens = monaco.editor.tokenize(model.getValue(), "URLlang");
    // console.log(word, position, model);

    // new implement start
    let varMatchRanges = model.findMatches(
      /\{\{[-$\w]*\}\}/g,
      null,
      true,
      true,
      null,
      true
    );
    let varMatchedRange = getRangeInWhichPositionFalls(
      varMatchRanges,
      position
    );
    if (!varMatchedRange) return;

    let matchedVar = varMatchedRange.matches[0]; //this is inherited from model.findMatches return single match
    let parsedVar = matchedVar.replace('{{', '').replace('}}', '');

    let previewVar;
    let isMockVar = parsedVar.charAt(0) == '$' ? true : false;

    if (isMockVar) {
      let mv = mockVariables[parsedVar];
      if (mv) previewVar = mv.api.mock();
    } else {
      previewVar = variables[parsedVar];
    }
    if (!previewVar) return;

    let previewSliceOne, previewSliceTwo, previewScope;
    if (!isMockVar) {
      previewSliceOne = {
        value: `${parsedVar}: ${previewVar}`,
        supportThemeIcons: true,
      };
      previewScope = { value: `**Scope:** Variable` }; //Todo: later this scope will be enum [ Workspace, Collection ]
    } else {
      let v = {
        sample: previewVar,
        scope: 'Mock Variable',
        description: 'This value can be changes on runtime',
      };
      // let sv = JSON.stringify(v, 2, 2);
      // previewSliceOne = { value: '```js \n' + sv + '\n ```', supportThemeIcons: true };
      previewSliceOne = { value: previewVar, supportThemeIcons: true };
      previewScope = { value: `**Scope:** Mock Variables` };
    }

    let table = `|  |  |
    |-:|-:|
    | \`${previewVar}\` |   |
    | ${previewVar ? 'Mock Variable' : 'Global'} |  |
    | Development Snippet |  |
`;

    return Promise.resolve({
      range: varMatchedRange.range, //getWrappedWordRange(word, 2, 2, position.lineNumber), //new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
      contents: [
        previewSliceOne,
        previewScope,
        // { value: `**Snippet:** Default Global Snippet` },
        // { value: table }
        // { value: '```js \n' + res.responseText.substring(0, 200) + '\n```' },
        // { value: '```js \n' + res.responseText.substring(0, 200) + '\n```' },
        // { value: '```js \n' + res.responseText.substring(0, 200) + '\n```' },
        // { value: '```js\n' + res.responseText.substring(0, 200) + '\n```' }
      ],
    });
  },
});

/**
 * @deprecated This function is not in usage now after implementing the regex based var search...
 * @param {*} word
 * @param {*} startColumnMargin
 * @param {*} endColumnMargin
 * @param {*} line
 */
const getWrappedWordRange = (
  word,
  startColumnMargin,
  endColumnMargin,
  line
) => {
  return {
    endLineNumber: line,
    startLineNumber: line,
    startColumn: word.startColumn - startColumnMargin,
    endColumn: word.endColumn + endColumnMargin,
  };
};

/**
 *
 * @param {*} rangeCollection [{matches:[], range: {}}]
 * @param {*} position { lineNumber, column}
 */
const getRangeInWhichPositionFalls = (rangeCollection, position) => {
  return rangeCollection.find((r) => {
    return (
      position.lineNumber >= r.range.startLineNumber &&
      position.lineNumber <= r.range.endLineNumber &&
      position.column >= r.range.startColumn &&
      position.column <= r.range.endColumn
    );
  });
};
