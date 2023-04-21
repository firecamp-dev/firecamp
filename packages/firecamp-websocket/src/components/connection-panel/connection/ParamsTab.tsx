import shallow from 'zustand/shallow';
import { BulkEditTable } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const ParamsTab = () => {
  const { tabId, queryParams, changeQueryParams } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      queryParams: s.request.url.queryParams,
      changeQueryParams: s.changeQueryParams,
    }),
    shallow
  );

  return (
    <BulkEditTable
      key={`params-${tabId}`}
      rows={queryParams || []}
      debounce={100}
      title={'params'}
      onChange={(qps) => changeQueryParams(qps)}
    />
  );
};

export default ParamsTab;
