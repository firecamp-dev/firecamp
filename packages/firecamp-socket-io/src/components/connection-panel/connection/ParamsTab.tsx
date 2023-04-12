import shallow from 'zustand/shallow';
import { BulkEditTable } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const ParamsTab = ({ id = '' }) => {
  const { url, changeQueryParams } = useStore(
    (s: IStore) => ({
      url: s.request.url,
      changeQueryParams: s.changeQueryParams,
    }),
    shallow
  );
  return (
    <BulkEditTable
      title={'Query Params'}
      key={`params-${id}`}
      rows={url.queryParams || []}
      debounce={100}
      onChange={(qps) => {
        changeQueryParams(qps);
      }}
    />
  );
};

export default ParamsTab;
