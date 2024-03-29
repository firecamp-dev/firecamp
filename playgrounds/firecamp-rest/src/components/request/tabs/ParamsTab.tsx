import { useRef } from 'react';
import { Container, BulkEditTable, TTableApi, BasicTable } from '@firecamp/ui';
import { _array } from '@firecamp/utils';
import { useRequestParamsFacade } from '../useFacade';

const ParamsTab = () => {
  const tableApi = useRef<TTableApi>();
  const { queryParams, pathParams, changeQueryParams, changePathParams } = useRequestParamsFacade();

  // useEffect(() => {
  // const tRows = tableApi.current.getRows();
  // console.log(tRows, queryParams, tRows == queryParams, ' queryParams...');
  // tableApi.current.initialize(queryParams);
  // }, [queryParams]);

  return (
    <Container>
      <Container.Body className="flex flex-col">
        <BulkEditTable
          key={'queryParams'}
          title="Query Params"
          rows={queryParams || []}
          onChange={(data) => {
            // console.log({ data });
            changeQueryParams(data);
          }}
          onMount={(tApi) => (tableApi.current = tApi)}
        />
        {!_array.isEmpty(pathParams) ? (
          <div className="pt-14">
            <BasicTable
              rows={pathParams || []}
              key={'pathParams'}
              title="Path params"
              options={{
                disabledColumns: ['key', 'disable'],
                allowRowRemove: false,
                allowRowAdd: false,
                allowSort: false,
              }}
              onChange={(data) => {
                changePathParams(data);
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </Container.Body>
    </Container>
  );
};

export default ParamsTab;
