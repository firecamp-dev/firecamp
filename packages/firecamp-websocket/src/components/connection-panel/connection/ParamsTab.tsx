import { BulkEditTable } from '@firecamp/ui';
const ParamsTab = ({
  params = [],
  activeConnectionId = '',
  onUpdate = (data) => {},
}) => {

  return (
    <BulkEditTable
      key={`params-${activeConnectionId}`}
      rows={params || []}
      debounce={100}
      title={'params'}
      onChange={onUpdate}
    />
  );
};

export default ParamsTab;
