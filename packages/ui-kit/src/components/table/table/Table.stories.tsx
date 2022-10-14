//@ts-nocheck
import { useState } from 'react';
import equal from 'deep-equal';
import { screen, userEvent } from '@storybook/testing-library';
import { within, fireEvent } from '@testing-library/react';
import {expect} from "@storybook/jest";

import Table from './Table';
import { defaultData, columnDataForDisplay, TableInput, dragAndDrop, TableColumnHeading } from "./TableData";
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

  //validate the rows rendered into the table
  const tableBody = await within(renderedTable).getAllByRole("rowgroup")[1]
 
  //on mousedown/touch start on column header resizer div should update the styles of the element
  const columnResizer = await canvas.queryAllByTestId('col-resizer');
  if(!_array.isEmpty(columnResizer)){
    
    await fireEvent.mouseDown(columnResizer[0]);
    expect(columnResizer[0].className).toBe("pt-resizer h-full pt-resizing");
    await fireEvent.mouseUp(columnResizer[0]);  

  //table column resize logic : column width is updating along with resizer div's offsetLeft value
  const resizerElement = columnResizer[2] , resizerElementColumnWidth = resizerElement.parentNode;
  const intialColumnWidth = resizerElementColumnWidth.offsetWidth;
  const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 },{ clientX: 200, clientY: 0 }] 

  await fireEvent.mouseDown(resizerElement, columnMouseMoveOffset[0]);
  await fireEvent.mouseMove(resizerElement, columnMouseMoveOffset[1]);
  await fireEvent.mouseUp(resizerElement, columnMouseMoveOffset[1])

  expect(resizerElementColumnWidth.offsetWidth).toBeGreaterThan(intialColumnWidth);
  }

  //table row sorting logic : first row location should be shifted to last using the drag button's row key
  const dragIndex = 0, dropIndex = 2;
  const rowSorter = await within(tableBody).findAllByTestId('row-sorter');
  const initialRowId = rowSorter[dragIndex].parentNode.id;

  dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);
  const rowSorted = await within(tableBody).findAllByTestId('row-sorter');
  const updatedRowId = rowSorted[dropIndex].parentNode.id;
  
  expect(initialRowId).toBe(updatedRowId)
};

