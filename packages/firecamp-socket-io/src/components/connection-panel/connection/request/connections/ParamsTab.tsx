import { BulkEditTable } from '@firecamp/ui-kit';
const ParamsTab = ({
  params = [],
  activeConnectionId = '',
  onUpdate = (data) => {},
}) => {
  // console.log(activeConnectionId, "Outer side")
  // console.log("params", params, activeConnectionId, "Inner side")
  // if(!params.length) return <span/>
  return (
    <BulkEditTable
      onChange={(data) => {
        // console.log(activeConnectionId, data, params, "Inner side", 22222222);
        // debugger;
        onUpdate(data);
        // debugger;
      }}
      key={`params-${activeConnectionId}`}
      rows={params || []}
      debounce={100}
      title={'params'}
    />
  );
};

export default ParamsTab;
