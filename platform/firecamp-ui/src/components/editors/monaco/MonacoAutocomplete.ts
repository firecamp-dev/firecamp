// @ts-nocheck
import { editor, languages, MarkerSeverity } from 'monaco-editor';
import { Position as GraphQLPosition } from 'graphql-language-service-utils';
import {
  getHoverInformation,
  getDiagnostics,
  getAutocompleteSuggestions,
} from 'graphql-language-service-interface';
export function setupQueryEditor(schema) {
  languages.registerHoverProvider('graphql', {
    async provideHover(model, position, token) {
      return provideHoverInfo({
        position,
        model,
        schema,
        token,
      });
    },
  });
  languages.registerCompletionItemProvider('graphql', {
    async provideCompletionItems(model, position) {
      return provideCompletionItems({ position, model, schema });
    },
  });
}

export function onChangeQuery({ model, schema }) {
  return diagnoseQueryValue(model, schema);
}

//   export type ProviderItemInput = {
//     position;
//     model; // query or schema
//     schema: GraphQLSchema;
//     token?: CancellationToken;
//   };

export async function provideHoverInfo({ position, model, schema }) {
  const graphQLPosition = new GraphQLPosition(
    position.lineNumber - 1,
    position.column
  );
  graphQLPosition.setCharacter(position.column);
  graphQLPosition.line = position.lineNumber - 1;
  const hoverInfo = getHoverInformation(
    schema,
    model.getValue(),
    graphQLPosition
  );
  if (!hoverInfo) {
    return {
      contents: [],
    };
  }
  return {
    contents: [{ value: `${hoverInfo}` }],
  };
}

export async function provideCompletionItems({ position, model, schema }) {
  const graphQLPosition = new GraphQLPosition(
    position.lineNumber - 1,
    position.column - 1
  );
  graphQLPosition.setCharacter(position.column - 1);
  graphQLPosition.line = position.lineNumber - 1;
  const suggestions = await getAutocompleteSuggestions(
    schema,
    model.getValue(),
    graphQLPosition
  );
  // @ts-ignore wants range
  return {
    // TODO: possibly return different kinds of completion items?
    // TODO: (optionally?) show all completion items at first?
    suggestions: suggestions.map((s) => ({
      label: s.label,
      kind: s.kind,
      detail: s.detail,
      documentation: s.documentation,
      insertText: s.label,
    })),
  };
}

const diagnoseQueryValue = async (
  model, // query or schema
  schema
) => {
  let valid = false;
  const diagnostics = await getDiagnostics(model.getValue(), schema);
  const formattedDiagnostics = diagnostics.map((d) => ({
    startLineNumber: d.range.start.line + 1,
    endLineNumber: d.range.end.line + 1,
    startColumn: d.range.start.character + 1,
    endColumn: d.range.end.character + 1,
    message: d.message,
    severity: MarkerSeverity.Error,
  }));
  if (diagnostics.length < 1) {
    valid = true;
  }
  editor.setModelMarkers(model, 'linter', formattedDiagnostics);

  return {
    valid,
    formattedDiagnostics,
    diagnostics,
  };
};
