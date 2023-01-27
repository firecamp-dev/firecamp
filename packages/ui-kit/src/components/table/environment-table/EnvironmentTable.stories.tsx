import { _array } from '@firecamp/utils';

import EnvironmentTable from './EnvironmentTable';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';
import { IEnvironmentTable } from './EnvironmentTable.interfaces';

export default {
  title: 'UI-Kit/Table/EnvironmentTable',
  component: EnvironmentTable,
  argTypes: {},
};

const defaultData = [
  {
    "variable": "variable-1",
    "type": "type-1",
    "initialValue": "initialValue",
    "currentValue": "currentValue"
},{
  "variable": "variable-2",
  "type": "type-2",
  "initialValue": "initialValue-2",
  "currentValue": "currentValue-2"
}
]
const Template = ({...args}: IEnvironmentTable<any>) => {
  return (
    <EnvironmentTable
    {...args}
    />
  );
};

export const EnvironmentTableData = Template.bind({});
EnvironmentTableData.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};