import { _array } from '@firecamp/utils';
import BasicTable from './BasicTable';

type FormData = {
  key: string;
  value: string;
  description: string;
  disable?: boolean;
};

export const defaultData: FormData[] = [
  {
    key: 'name',
    value: 'Elon',
    description: 'The name of user',
    disable: true,
  },
  {
    key: 'startup',
    value: 'SpaceX',
    description: 'The space company',
  },
  {
    key: 'founded',
    value: '2004',
    description: 'The year of founded',
  },
];

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

export const BasicData = Template.bind({});
BasicData.args = {
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
