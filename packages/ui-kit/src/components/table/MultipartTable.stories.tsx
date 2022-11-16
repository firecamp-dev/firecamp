import { _array } from '@firecamp/utils';
import { defaultData } from '../../../__mocks__/testData';
import MultipartTable from './MultipartTable';

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
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value)
};