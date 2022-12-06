import { Button, Container, ProgressBar } from '@firecamp/ui-kit';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import QueryExplorer from '../../common/explorer/QueryExplorer';
import { IGraphQLStore, useGraphQLStore } from '../../../store';
import { EQueryTypes } from '../../../types';

const addQueryButtons = [
  {
    name: 'query',
    type: EQueryTypes.Query,
  },
  {
    name: 'mutation',
    type: EQueryTypes.Mutation,
  },
  {
    name: 'subscription',
    type: EQueryTypes.Subscription,
  },
];

const ExplorerTab = () => {
  const { isFetchingIntrospection, fetchIntrospectionSchema } = useGraphQLStore(
    (s: IGraphQLStore) => ({
      isFetchingIntrospection: s.runtime.isFetchingIntrospection,
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
    })
  );
  const _addNewQuery = (type) => {};

  return (
    <Container className="with-divider">
      <Container.Header>
        <div className="flex pane-header px-2 py-1">
          <div className="ml-auto flex">
            <div>
              <VscRefresh
                size={14}
                className="cursor-pointer"
                onClick={fetchIntrospectionSchema}
              />
            </div>
          </div>
        </div>
      </Container.Header>
      <Container.Body className="visible-scrollbar">
        <ProgressBar active={isFetchingIntrospection} />
        <div className="tab-pane active h-full graphql-explorer">
          <QueryExplorer />
        </div>
      </Container.Body>
      <Container.Footer>
        <div className="flex flex-row p-1">
          <span className="whitespace-pre text-base flex-1 flex justify-left items-center">
            add new
          </span>
          {addQueryButtons.map((query, i) => {
            return (
              <Button
                key={i}
                secondary
                transparent={true}
                className="underline pl-1 pr-1 pt-0 pb-0"
                text={query.name || ''}
                ghost={true}
                onClick={() => _addNewQuery(query.type)}
              />
            );
          })}
        </div>
      </Container.Footer>
    </Container>
  );
};

export default ExplorerTab;
