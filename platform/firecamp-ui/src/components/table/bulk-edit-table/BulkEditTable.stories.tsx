import { _array } from '@firecamp/utils';
import { useState } from 'react';
import { defaultData } from '../../../../__mocks__/testData';
import BulkEditTable from './BulkEditTable';
import { IBulkEditTable } from './BulkEditTable.interfaces';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';

export default {
  title: 'UI-Kit/Table/BulkEditTable',
  component: BulkEditTable,
  argTypes: {},
};

const Template = ({...args}: IBulkEditTable) => {
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
      onChange={(value: ITableRows) => setRows(value)}
      onMount={ (value: TTableApi) => console.log(`mount event`, value)}
    />
  );
};

export const TemplateWithRowChange = TemplateWithState.bind({})

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
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};