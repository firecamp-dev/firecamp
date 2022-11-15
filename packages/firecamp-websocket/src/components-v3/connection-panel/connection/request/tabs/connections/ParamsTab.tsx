//@ts-nocheck

import { BulkEditIFT } from '@firecamp/ui-kit';
const ParamsTab = ({
  params = [],
  activeconnectionId = '',
  onUpdate = () => {}
}) => {
  return (
    <BulkEditIFT
      onChange={data => {
        onUpdate(data);
      }}
      key={`params-${activeconnectionId}`}
      rows={params || []}
      debounce={100}
      name={'params'}
    />
  );
};

export default ParamsTab;
