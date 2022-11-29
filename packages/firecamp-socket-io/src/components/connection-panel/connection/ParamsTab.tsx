import { BulkEditTable } from '@firecamp/ui-kit';
const ParamsTab = ({
  params = [],
  activeConnectionId = '',
  onUpdate = (data) => {},
}) => {

  return (
    <BulkEditTable
      onChange={(data) => {
        onUpdate(data);
      }}
      key={`params-${activeConnectionId}`}
      rows={params || []}
      debounce={100}
      title={'Query Params'}
    />
  );
};

export default ParamsTab;
