import { _array } from '@firecamp/utils';
import { defaultData } from '../table/table/TableData';

import BasicTable from './BasicTable';

export default {
  title: 'UI-Kit/Table',
  component: BasicTable,
  argTypes: {},
};

const Template = ({}) => {
  return (
    <BasicTable
      initialRows={defaultData}
      onChange={console.log}
      // onLoad={(tApi) => {}}
    />
  );
};
export const BasicV3Comp = Template.bind({});
BasicV3Comp.args = {};
