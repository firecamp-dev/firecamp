import { BulkEditTable } from '@firecamp/ui-kit';
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
      onChange={(data) => {
        onUpdate(data);
      }}
    />
  );
};

export default ParamsTab;
