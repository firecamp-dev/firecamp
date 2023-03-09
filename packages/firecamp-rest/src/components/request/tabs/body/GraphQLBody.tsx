import { EEditorLanguage } from '@firecamp/types';
import { Container, Column, Editor, CMGQueryEditor, TabHeader, Resizable } from '@firecamp/ui';

const GraphQLBody = ({ body, onChange }) => {
  const { query = '', variables = '' } = body;
  return (
    <Container className='border-t border-appBorder'>
      <Container.Body className="flex flex-col">
        <Column flex={1}>
          <TabHeader className="bg-statusBarBackground2 text-sm font-semibold !h-6">
            <TabHeader.Left>
            Query
            </TabHeader.Left>
          </TabHeader>
          <div className="flex-1 overflow-y-scroll">
            <CMGQueryEditor
              query={query}
              onChangeQuery={(query) => onChange({ query, variables })}
            />
          </div>
        </Column>
        <Resizable top={true} minHeight={100} maxHeight={500} height={320}>
        <Column flex={1}>
        <TabHeader className="bg-statusBarBackground2 text-sm font-semibold !h-6">
            <TabHeader.Left>
            Query variables
            </TabHeader.Left>
          </TabHeader>
          <Editor
            value={variables}
            language={EEditorLanguage.Json}
            onChange={({ target: { value } }) =>
              onChange({ query, variables: value })
            }
            monacoOptions={{
              name: 'graphQLBodyVariables',
              height: '30%',
            }}
          />
        </Column>
        </Resizable>
      </Container.Body>
    </Container>
  );
};

export default GraphQLBody;
