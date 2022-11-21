//@ts-nocheck

import { BulkEditIFT } from '@firecamp/ui-kit';
const ParamsTab = ({
  params = [],
  activeconnectionId = '',
  onUpdate = () => {}
}) => {
  // console.log(activeconnectionId, "Outer side")
  // console.log("params", params, activeconnectionId, "Inner side")
  // if(!params.length) return <span/>
  return (
    <BulkEditIFT
      onChange={data => {
        // console.log(activeconnectionId, data, params, "Inner side", 22222222);
        // debugger;
        onUpdate(data);
        // debugger;
      }}
      key={`params-${activeconnectionId}`}
      rows={params || []}
      debounce={100}
      name={'params'}
    />
  );
};

export default ParamsTab;
