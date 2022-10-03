//@ts-nocheck
import { useState, useRef } from 'react';
import Table from './Table';
import { defaultData, columnDataForDisplay, TableInput } from "./TableData";
import equal from 'deep-equal';

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
    containerClassName: "max-w-[calc(100%-24px)] m-auto overflow-x-auto custom-scrollbar ",
    minColumnSize: 100,
  }}
  columns={columnDataForDisplay}
  columnRenderer={(row) => <>{row}</>}
  cellRenderer={({cell}) => <TableInput cell={cell} 
  currentData={tableValue[cell.row.index]}
  onChange={updateTableData}
  />}
/>

}
