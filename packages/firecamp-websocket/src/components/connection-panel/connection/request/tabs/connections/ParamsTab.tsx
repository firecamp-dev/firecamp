import { BulkEditTable } from '@firecamp/ui-kit';
const ParamsTab = ({
  params = [],
  activeConnectionId = '',
  onUpdate = () => {},
}) => {
  return (
    <BulkEditTable
      onChange={(data) => {
        onUpdate(data);
      }}
      key={`params-${activeConnectionId}`}
      rows={params || []}
      debounce={100}
      name={'params'}
    />
  );
};

export default ParamsTab;
