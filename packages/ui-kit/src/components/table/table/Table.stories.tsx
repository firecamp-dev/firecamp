//@ts-nocheck
import { useState, useRef } from 'react';
import equal from 'deep-equal';
import { screen, userEvent } from '@storybook/testing-library';
import { within, fireEvent } from '@testing-library/react';
import {expect} from "@storybook/jest";

import Table from './Table';
import { defaultData, columnDataForDisplay, TableInput } from "./TableData";

export default {
  title: "UI-Kit/Table",
  component: Table,
  argTypes: {
    name: "Firecamp",
    tableResizable: { control: "boolean" },
  }
};

export const SimpleTable = () => {

  let [tableValue, setTableValue] = useState(defaultData);

let updateTableData = (newRows: any [] = []) => {
  if (!equal(newRows, tableValue)) {
    setTableValue(newRows);
  }
}
  return  <Table name='test-table'
  tableWidth={500}
  tableResizable={true}
  data={tableValue}
  options={{
    containerClassName: "",
    minColumnSize: 100,
  }}
  columns={columnDataForDisplay}
  columnRenderer={(row) => <>{row}</>}
  cellRenderer={(cell) => <TableInput cell={cell} 
  rows={tableValue}
  onChange={updateTableData}
  />}
/>

}

SimpleTable.play = async ({canvasElement}) => {

  const canvas = within(canvasElement);

  //table is rendered
  const renderedTable = await canvas.getByRole('table');
  expect(renderedTable).toBeInTheDocument();

  //table columns should be same as provided in columns
  const columnHeading = within(renderedTable).getAllByRole('columnheader')
  expect(columnHeading).toHaveLength(columnDataForDisplay.length)

  //column heading value should be same as provided in displayName
  const columnHeadingDifferFromDisplayName = columnHeading.filter((data, index) => columnDataForDisplay[index].displayName !== data.textContent)
  expect(columnHeadingDifferFromDisplayName).toHaveLength(0);
  
  //validate the rows rendered into the table
  const tableBody = await within(renderedTable).getAllByRole("rowgroup")[1]
  const tableRows = await within(tableBody).findAllByRole("row")
  expect(tableRows).toHaveLength(defaultData.length);
 
  //validate all rows are sortable
  tableRows.map(row => expect(row.draggable).toBeTruthy());

  //on mousedown/touch start on column header resizer div should update the styles of the element
  const columnResizer = await canvas.getAllByTestId('col-resizer');
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

  //Todo In progress
  //table row sorting logic : third row location should be shifted to first using the drag button's offsetTop value
  const rowSorter1 = await canvas.getAllByTestId('row-sorter')[0];
  const rowSorter = await canvas.getAllByTestId('row-sorter')[2], initialRowIndex = rowSorter.parentNode.rowIndex;
  const rowMouseMoveOffset = [{ clientX: 0, clientY: 90 },{ clientX: 0, clientY: 30 }] 

  await fireEvent.mouseEnter(rowSorter, rowMouseMoveOffset[1]);
  await fireEvent.mouseMove(rowSorter, rowMouseMoveOffset[1]);
  await fireEvent.mouseUp(rowSorter, rowMouseMoveOffset[1])

  expect(initialRowIndex).toBeGreaterThan(rowSorter.parentNode.rowIndex)


};