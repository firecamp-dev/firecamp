import shallow from 'zustand/shallow';
import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const HeadersTab = ({ id = '' }) => {
  const { headers, updateConnection } = useStore(
    (s: IStore) => ({
      headers: s.request.connection.headers,
      updateConnection: s.updateConnection,
    }),
    shallow
  );

  return (
    <BulkEditTable
      title={'Headers'}
      key={`headers-${id}`}
      id={`headers-${id}`}
      rows={headers || []}
      options={{
        languages: {
          key: EEditorLanguage.HeaderKey,
          value: EEditorLanguage.HeaderValue,
        },
      }}
      onChange={(headers) => {
        updateConnection('headers', headers);
      }}
    />
  );
};

export default HeadersTab;
