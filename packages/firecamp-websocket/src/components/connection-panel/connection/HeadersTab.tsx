import { BulkEditTable } from '@firecamp/ui-kit';

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
      title={'headers'}
      // meta={{
      //   mode: {
      //     key: EEditorLanguage.HeaderKey,
      //     value: EEditorLanguage.HeaderValue,
      //   },
      // }}
    />
  );
};

export default HeadersTab;
