import { _array } from '@firecamp/utils';
import { useState } from 'react';
import { defaultData } from '../../../__mocks__/testData';
import BulkEditTable from './BulkEditTable';

export default {
  title: 'UI-Kit/Table/BulkEditTable',
  component: BulkEditTable,
  argTypes: {},
};

const Template = ({...args}) => {
  return (
    <BulkEditTable
    {...args}
    />
  );
};

const TemplateWithState = () => {
  const [rows, setRows] = useState([]);
  return (
    <BulkEditTable
      title={'Table Title With Row Change Value'}
      rows={rows}
      options={{}}
      onChange={(value) => setRows(value)}
      onMount={ (value: any) => console.log(`mount event`, value)}
    />
  );
};

// not able to render with @firecamp/ui-kit
const TemplateWithRowChange = TemplateWithState.bind({})

export const WithTableOptions = Template.bind({});
WithTableOptions.args = {
  rows: defaultData,
  title: 'Table Title',
  options: { 
    disabledColumns: ["key"],
    allowRowRemove: true,
    allowRowAdd: true,
    allowSort: true
  },
  onChange: (value: any) => console.log(`change event`, value),
  onMount: (value: any) => console.log(`mount event`, value)
};