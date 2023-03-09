import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable } from '@firecamp/ui';

const HeadersTab = ({
  headers = [],
  activeConnectionId = '',
  onUpdate = (data) => {},
}) => {
  return (
    <BulkEditTable
      onChange={(data) => {
        // console.log(`headers updated`, data);
        onUpdate(data);
      }}
      key={`headers-${activeConnectionId}`}
      id={`headers-${activeConnectionId}`}
      rows={headers || []}
      title={'Headers'}
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
