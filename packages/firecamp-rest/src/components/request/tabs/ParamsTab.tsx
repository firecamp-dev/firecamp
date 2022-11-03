import { useEffect, useRef } from 'react';
import { Container, PrimaryIFT, BulkEditIFT } from '@firecamp/ui-kit';
import { _array } from '@firecamp/utils';
import shallow from 'zustand/shallow';

import { useRestStore } from '../../../store';

const ParamsTab = () => {
  const tableApi = useRef();
  let { query_params, path_params, changeQueryParams, changePathParams } =
    useRestStore(
      (s: any) => ({
        query_params: s.request.url?.query_params || [],
        path_params: s.request.url?.path_params || [],

        changeQueryParams: s.changeQueryParams,
        changePathParams: s.changePathParams,
      }),
      shallow
    );

  // useEffect(() => {
  //   console.log(query_params, ' query_params...');
  //   tableApi.current.initialize(query_params);
  // }, [query_params]);

  return (
    <Container>
      <Container.Body className="flex flex-col">
        <BulkEditIFT
          tableApiRef={tableApi}
          onChange={(data) => {
            // console.log({ data });

            changeQueryParams(data);
          }}
          key={'queryParams'}
          rows={query_params || []}
          title="Query params"
        />
        {!_array.isEmpty(path_params) ? (
          <div className="pt-14">
            <PrimaryIFT
              onChange={(data) => {
                // _onChangeParamsValue(data, PATH_PARAMS);
                changePathParams(data);
              }}
              key={'pathParams'}
              rows={path_params || []}
              title="Path params"
              meta={{
                disabledColumns: ['key', 'disable'],
                allowRowRemove: false,
                allowRowAdd: false,
                allowSort: false,
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
