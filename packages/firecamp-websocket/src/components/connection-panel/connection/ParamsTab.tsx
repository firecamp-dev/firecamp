import { BulkEditTable } from '@firecamp/ui';
const ParamsTab = ({
  id = '',
  params = [],
  onUpdate = (data) => {},
}) => {

  return (
    <BulkEditTable
      key={`params-${id}`}
      rows={params || []}
      debounce={100}
      title={'params'}
      onChange={onUpdate}
    />
  );
};

export default ParamsTab;
