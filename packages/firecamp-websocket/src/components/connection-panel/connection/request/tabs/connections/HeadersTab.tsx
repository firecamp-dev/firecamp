import { BulkEditTable } from '@firecamp/ui-kit';

const HeadersTab = ({
  headers = [],
  activeconnectionId = '',
  onUpdate = () => {}
}) => {
  return (
    <BulkEditTable
      onChange={data => {
        // console.log(`headers updated`, data);
        onUpdate(data);
      }}
      key={`headers-${activeconnectionId}`}
      id={`headers-${activeconnectionId}`}
      rows={headers || []}
      name={'headers'}
      meta={{
        mode: {
          key: 'ife-header-key',
          value: 'ife-header-value'
        }
      }}
    />
  );
};

export default HeadersTab;
