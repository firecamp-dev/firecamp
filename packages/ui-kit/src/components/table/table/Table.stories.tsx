//@ts-nocheck
import { useState } from 'react';
import equal from 'deep-equal';
import { within } from '@testing-library/react';

import Table from './Table';
import { defaultData, columnDataForDisplay, TableInput, TableColumnHeading } from "./TableData";
import { _array } from '@firecamp/utils'

export default {
  title: "UI-Kit/Table",
  component: Table,
  argTypes: {
    name: {control: 'text' },
    tableResizable: {  control: 'boolean' },
    tableWidth: { control: 'number'},
    columns: { control: 'object' },
    data: { control: 'object' },
    options: { control: 'object' }
  }
};

const SimpleTableTemplate = ({name, tableResizable, tableWidth, columns, data, options, columnRenderer}) => {

  let [tableValue, setTableValue] = useState(data);

let updateTableData = (newRows: any [] = []) => {
  if (!equal(newRows, tableValue)) {
    setTableValue(newRows);
  }
}
  return  <Table name={name}
  tableWidth={tableWidth}
  tableResizable={tableResizable}
  data={tableValue}
  options={options}
  columns={columns}
  columnRenderer={columnRenderer}
  cellRenderer={(cell) => 
  <TableInput cell={cell} 
              rows={tableValue}
              onChange={updateTableData}
  />}
/>

}
export const SimpleTable = SimpleTableTemplate.bind({});
SimpleTable.args = {
  name: "test-table-2",
  tableResizable: true,
  tableWidth: 500,
  columns: columnDataForDisplay,
  data: defaultData,
  options: {
    containerClassName: "container-wrapper",
    minColumnSize: 100,
  },
  columnRenderer: (value) => <TableColumnHeading heading={value}/>
}

SimpleTable.play = async ({canvasElement}) => {

  const canvas = within(canvasElement);
  //table is rendered
  const renderedTable = await canvas.getByRole('table');

};

