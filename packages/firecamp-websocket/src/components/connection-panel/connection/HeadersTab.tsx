import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable } from '@firecamp/ui';

const HeadersTab = ({
  id,
  headers = [],
  onUpdate = (data) => {},
}) => {
  return (
    <BulkEditTable
      onChange={(data) => {
        // console.log(`headers updated`, data);
        onUpdate(data);
      }}
      key={`headers-${id}`}
      id={`headers-${id}`}
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
