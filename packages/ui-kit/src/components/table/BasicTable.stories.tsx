import { _array } from '@firecamp/utils';
import BasicTable from './BasicTable';
import { defaultData } from '../../../__mocks__/testData';
import { ITableRows, TTableApi } from './primitive/table.interfaces';
import { IBasicTable } from './BasicTable.interfaces';

export default {
  title: 'UI-Kit/Table/BasicTable',
  component: BasicTable,
  argTypes: {},
};

const Template = ({...args}: IBasicTable<any>) => {
  return (
    <BasicTable
    {...args}
    />
  );
};

export const EmptyRow = Template.bind({});
EmptyRow.args = {
  rows: [],
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};

export const BasicTableData = Template.bind({});
BasicTableData.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};

export const DisableColumns = Template.bind({});
DisableColumns.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
  options: {
    disabledColumns: ["disable", "value"],
  }
};

export const DisableNewRow = Template.bind({});
DisableNewRow.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
  options: {
    allowRowAdd: false,
  }
};

export const DisableRemoveRow = Template.bind({});
DisableRemoveRow.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
  options: {
    allowRowRemove: false,
  }
};

export const DisableSortRow = Template.bind({});
DisableSortRow.args = {
  rows: defaultData,
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
  options: {
    allowSort: false,
  }
};
