import { _array } from '@firecamp/utils';
import BasicTable from './BasicTable';
import { defaultData } from '../../../__mocks__/testData';

export default {
  title: 'UI-Kit/Table/BasicTable',
  component: BasicTable,
  argTypes: {},
};

const Template = ({...args}) => {
  return (
    <BasicTable
    {...args}
    />
  );
};

export const EmptyRow = Template.bind({});
EmptyRow.args = {};

export const BasicTableData = Template.bind({});
BasicTableData.args = {
  rows: defaultData,
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value, value.getRows())
};

export const DisableColumns = Template.bind({});
DisableColumns.args = {
  rows: defaultData,
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value, value.getRows()),
  options: {
    disabledColumns: ["disable", "value"],
  }
};

export const DisableNewRow = Template.bind({});
DisableNewRow.args = {
  rows: defaultData,
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value, value.getRows()),
  options: {
    allowRowAdd: false,
  }
};

export const DisableRemoveRow = Template.bind({});
DisableRemoveRow.args = {
  rows: defaultData,
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value, value.getRows()),
  options: {
    allowRowRemove: false,
  }
};

export const DisableSortRow = Template.bind({});
DisableSortRow.args = {
  rows: defaultData,
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value, value.getRows()),
  options: {
    allowSort: false,
  }
};
