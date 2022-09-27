//@ts-nocheck
import { useEffect, useState } from 'react';
import Table, { Td } from './Table';
import { getData } from "./TableData";

export default {
  title: "UI-Kit/Table",
  component: Table,
  argTypes: {
    name: "Firecamp",
    tableResizable: { control: "boolean" },
  }
};

const Template = (args) => <Table {...args} />;

export const columnDataForDisplay = [
  {
    name: "action",
    displayName: " ",
    minSize: 64,
    width: 64
  },
  {
    name: "value",
    displayName: "City",
    width: 145,
    minSize: 145,
    enableResizing: true,
  },
  {
    name: "description",
    displayName: "Description",
    width: 145,
    enableResizing: true,
  },
  {
    name: "popularPlace",
    displayName: "Location",
    enableResizing: true,
  },
  {
    name: "pincode",
    minSize: 60,
    width: 60,
    displayName: "Area Code",
  },
]

export const SimpleTable = Template.bind({});
SimpleTable.args = {
  name: 'Simple Table',
  tableWidth: 800,
  tableResizable: true,
  data: getData(),
  options: {
    containerClassName: "max-w-[calc(100%-24px)] m-auto overflow-x-auto custom-scrollbar ",
    minColumnSize: 65,
  },
  columns: columnDataForDisplay,
  columnRenderer: (row) => {
    return <>{row}</>
  },
  cellRenderer: (cell) => {
    if (typeof cell.getValue() !== "undefined") {
      return <Td style={{ maxWidth: cell.column.getSize() }}
        className={" h-[30px] relative overflow-hidden overflow-ellipsis whitespace-nowrap align-baseline"}>
        {["2-city"].includes(cell.row.original.id) ?
          <TableInput key={cell.id}
            value={cell?.getValue() ?? ""}
            onChange={((value) => {
              let Index = tableValue.findIndex(data => data.id === cell.row.original.id)

              if (Index !== -1 && cell.getValue() !== value) {

                let updatedValues = tableValue;
                let updatedCell = updatedValues[Index];
                updatedCell[cell.column.id] = value;
                updatedValues = [
                  ...updatedValues.slice(0, Index),
                  updatedCell,
                  ...updatedValues.slice(Index + 1),
                ]

                setTableValue(updatedValues)
              }

            })} />
          :
          cell.getValue()
        }
      </Td>
    }
    else {
      return <></>;
    }
  },
};

export const TableInput = (props: { value: string, onChange: Function }) => {
  let { value, onChange } = props
  const [inputValue, setInputValue] = useState(value);

  return <input
    type="text"
    placeholder={``}
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onBlur={(e) => onChange(e.target.value)}
    className="text-appForeground bg-appBackground h-[29px]  w-full
                            absolute top-0 left-0 !border-0 p-1 text-base overflow-ellipsis focus:!border-0"
  />

}