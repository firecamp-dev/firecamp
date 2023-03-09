import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable } from '@firecamp/ui';
import shallow from 'zustand/shallow';
import { IStore, useStore } from '../../../store';

const HeadersTab = () => {
  let { headers, changeHeaders } = useStore(
    (s: IStore) => ({
      headers: s.request.headers,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );

  return (
    <BulkEditTable
      onChange={changeHeaders}
      key={'headers'}
      rows={headers}
      title={'Headers'}
      options={{
        languages: {
          key: EEditorLanguage.HeaderKey,
          value: EEditorLanguage.HeaderValue,
        },
        hiddenColumns: ['description'],
      }}
    />
  );
};

export default HeadersTab;
