import { _array } from '@firecamp/utils';

import PlainTable from './PlainTable';
import { defaultData } from '../../../../__mocks__/testData';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';
import { IPlainTable } from './PlainTable.interfaces';

export default {
  title: 'UI-Kit/Table/PlainTable',
  component: PlainTable,
  argTypes: {},
};

const Template = ({ ...args }: IPlainTable<any>) => {
  return <PlainTable {...args} />;
};

export const TablePreview = Template.bind({});
TablePreview.args = {
  columns: [
    { id: 'key', key: 'key', name: 'Key', width: '50%' },
    {
      id: 'value',
      key: 'value',
      name: 'Value',
      width: '50%',
      resizeWithContainer: true,
    },
  ],
  rows: defaultData,
};
export const EnvironmentTable = Template.bind({});
EnvironmentTable.args = {
  columns: [
    { id: 'key', key: 'key', name: 'Variable Name', width: '50%' },
    {
      id: 'value',
      key: 'value',
      name: 'Variable Value',
      width: '50%',
    },
  ],
  rows: defaultData,
  // classes: { theadTr: 'hidden' },
};
