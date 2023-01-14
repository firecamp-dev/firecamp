import { EEditorLanguage } from '@firecamp/types';
import {
  Container,
  Column,
  Editor,
  CMGQueryEditor,
} from '@firecamp/ui-kit';

const GraphQLBody = ({ body, onChange }) => {

  const { query = '', variables = '' } = body;
  return (
    <Container>
      <Container.Body className="flex flex-col">
        <Column flex={1}>
          <div className="text-base px-1 py-2 bg-focus1">Query</div>
          <div className="flex-1 overflow-y-scroll">
            <CMGQueryEditor
              query={query}
              onChangeQuery={(query) => onChange({ query, variables})}
            />
          </div>
        </Column>
        <Column flex={1}>
          <div className="text-base px-1 py-2 bg-focus1">Query variables</div>
          <Editor
            value={variables}
            language={EEditorLanguage.GraphQl}
            monacoOptions={{
              // mode: "json",
              name: 'graphQLBodyVariables',
              // value: variables,
              height: '30%',
            }}
            onChange={({ target: { value } }) => onChange({ query, variables: value})}
          />
        </Column>
      </Container.Body>
    </Container>
  );
};

export default GraphQLBody;
