import { ERestBodyTypes } from '@firecamp/types';
import {
  Container,
  Column,
  Editor,
  CMGQueryEditor,
} from '@firecamp/ui-kit';

const GraphQLBody = ({ body, onChange }) => {
  const { value = '', variables = '' } = body;

  const _onChangeVariables = (value) => {
    // console.log("update", key, value)
    onChange(ERestBodyTypes.GraphQL, value, 'variables');
  };

  const _onChangeQuery = (value) => {
    onChange(ERestBodyTypes.GraphQL, value);
  };

  return (
    <Container>
      <Container.Body className="flex flex-col">
        <Column flex={1}>
          <div className="text-base px-1 py-2 bg-focus1">Query</div>
          <div className="flex-1 overflow-y-scroll">
            <CMGQueryEditor
              query={value}
              onChangeQuery={(value) => _onChangeQuery(value)}
            />
          </div>
        </Column>
        <Column flex={1}>
          <div className="text-base px-1 py-2 bg-focus1">Query variables</div>
          <Editor
            value={variables}
            language={'json'}
            monacoOptions={{
              // mode: "json",
              name: 'graphQLBodyVariables',
              // value: variables,
              height: '30%',
            }}
            onChange={({ target: { value } }) => _onChangeVariables(value)}
          />
        </Column>
      </Container.Body>
    </Container>
  );
};

export default GraphQLBody;
