import { _array } from '@firecamp/utils';
import TestResultTable from './TestResultTable';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';
import { ITestResultTable } from './TestResultTable.interfaces';

export default {
  title: 'UI-Kit/Table/TestResultTable',
  component: TestResultTable,
  argTypes: {},
};

const defaultData = [
  {
    isPassed: true,
    name: 'Response time is less than 200ms',
  },
  {
    isPassed: false,
    name: 'Successful POST request',
  },
  {
    isPassed: true,
    name: 'Response code is less than 201',
  },
];
const Template = ({ ...args }: ITestResultTable<any>) => {
  return <TestResultTable {...args} />;
};

export const StatusTableData = Template.bind({});
StatusTableData.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
};
