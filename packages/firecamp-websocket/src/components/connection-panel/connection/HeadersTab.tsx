import shallow from 'zustand/shallow';
import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const HeadersTab = () => {
  const { tabId, headers, updateConnection } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      headers: s.request.connection.headers,
      updateConnection: s.updateConnection,
    }),
    shallow
  );
  return (
    <BulkEditTable
      onChange={(data) => {
        // console.log(`headers updated`, data);
        updateConnection('headers', data);
      }}
      key={`headers-${tabId}`}
      id={`headers-${tabId}`}
      rows={headers || []}
      title={'headers'}
      options={{
        languages: {
          key: EEditorLanguage.HeaderKey,
          value: EEditorLanguage.HeaderValue,
        },
      }}
    />
  );
};

export default HeadersTab;
