import { _array } from '@firecamp/utils';
import { defaultData } from '../../../__mocks__/testData';
import MultipartTable from './MultipartTable';
import { ITableRows, TTableApi } from './primitive/table.interfaces';

export default {
  title: 'UI-Kit/Table/MultipartTable',
  component: MultipartTable,
  argTypes: {},
};

const Template = ({...args}) => {
  return (
    <MultipartTable
    {...args}
    />
  );
};

export const BasicDataWithDefaultRows = Template.bind({});
BasicDataWithDefaultRows.args = {
  rows: defaultData,
  disabled: false,
  title: 'Table Title',
  options: { },
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};