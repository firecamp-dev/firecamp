import { _array } from '@firecamp/utils';

import StatusTable from './StatusTable';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';
import { IStatusTable } from './StatusTable.interfaces';

export default {
  title: 'UI-Kit/Table/StatusTable',
  component: StatusTable,
  argTypes: {},
};

const defaultData = [
  {
    "status": "pass",
    "name": "Response time is less than 200ms",
},{
    "status": "fail",
    "name": "Successful POST request",
},{
    "status": "pass",
    "name": "Response code is less than 201",
},
]
const Template = ({...args}: IStatusTable<any>) => {
  return (
    <StatusTable
    {...args}
    />
  );
};

export const StatusTableData = Template.bind({});
StatusTableData.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};