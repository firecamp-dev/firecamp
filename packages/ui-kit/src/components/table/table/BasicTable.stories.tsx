import { _array } from '@firecamp/utils';
// import { within } from '@testing-library/react';

import BasicTable from './BasicTable';
import { defaultData } from './TableData';

export default {
  title: 'UI-Kit/Table',
  component: BasicTable,
  argTypes: {
    name: { control: 'text' },
    resizable: { control: 'boolean' },
    width: { control: 'number' },
    data: { control: 'object' },
    options: { control: 'object' },
  },
};

const Template = ({ name, resizable, width, data, options }) => {
  return (
    <BasicTable
      name={name}
      width={width}
      resizable={resizable}
      data={data}
      options={options}
    />
  );
};
export const BasicTableComp = Template.bind({});
BasicTableComp.args = {
  name: 'test-table-2',
  resizable: true,
  width: 500,
  data: defaultData,
  options: {
    containerClassName: 'container-wrapper',
    minColumnSize: 100,
  },
};

// BasicTableComp.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   //table is rendered
//   const renderedTable = await canvas.getByRole('table');
// };
