import { useEffect, useRef } from 'react';
import {
  Container,
  BulkEditTable,
  TTableApi,
  BasicTable,
} from '@firecamp/ui-kit';
import { _array } from '@firecamp/utils';
import shallow from 'zustand/shallow';

import { useRestStore } from '../../../store';

const ParamsTab = () => {
  const tableApi = useRef<TTableApi>();
  const { queryParams, pathParams, changeQueryParams, changePathParams } =
    useRestStore(
      (s: any) => ({
        queryParams: s.request.url?.queryParams || [],
        pathParams: s.request.url?.pathParams || [],
        changeQueryParams: s.changeQueryParams,
        changePathParams: s.changePathParams,
      }),
      shallow
    );

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
          title="Query params"
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
                // _onChangeParamsValue(data, PATH_PARAMS);
                changePathParams(data);
              }}
            />
            {/* <BasicTable
              onChange={(data) => {
                // _onChangeParamsValue(data, PATH_PARAMS);
                changePathParams(data);
              }}
              key={'pathParams'}
              rows={pathParams || []}
              title="Path params"
              options={{
                disabledColumns: ['key', 'disable'],
                allowRowRemove: false,
                allowRowAdd: false,
                allowSort: false,
              }}
            /> */}
          </div>
        ) : (
          <></>
        )}
      </Container.Body>
    </Container>
  );
};

export default ParamsTab;
