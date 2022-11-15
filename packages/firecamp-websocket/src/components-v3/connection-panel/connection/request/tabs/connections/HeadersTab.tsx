//@ts-nocheck

import { BulkEditIFT } from '@firecamp/ui-kit';

const HeadersTab = ({
  headers = [],
  activeconnectionId = '',
  onUpdate = () => {}
}) => {
  return (
    <BulkEditIFT
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
