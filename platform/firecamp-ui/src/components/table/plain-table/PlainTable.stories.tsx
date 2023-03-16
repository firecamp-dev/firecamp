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
    { id: 'select', key: 'disable', name: '', width: '40px', fixedWidth: true },
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
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
};
export const WithoutHeader = Template.bind({});
WithoutHeader.args = {
  columns: [
    { id: 'key', key: 'key', name: 'Key', width: '50%' },
    {
      id: 'value',
      key: 'value',
      name: 'Value',
      width: '50%',
    },
  ],
  rows: defaultData,
  classes: { theadTr: 'hidden' },
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
};
