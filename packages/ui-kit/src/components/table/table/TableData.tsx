import { Td } from "./Table";
import { useEffect, useState } from 'react';

export type Person = {
  key: string,
  value: string,
  description: string,
  popularPlace: string,
  pincode: number  
}

export const defaultData: Person[] = [
  {
    key: "City 1",
    value: "Ahmedabad",
    description: "Ahmedabad, in western India, is the largest city in the state of Gujarat. ",
    popularPlace: "Kankaria Lake",
    pincode: 380001
  },
  {
    key: "City 2",
    value: "Surat",
    description: "Surat is a large city beside the Tapi River in the west Indian state of Gujarat",
    popularPlace: "Dumas Beach",
    pincode: 395003
  },
  {
    key: "City 3",
    value: "Mahemdavad",
    description: "Mahemdavad is a town with municipality in the Kheda district in the Indian state of Gujarat",
    popularPlace: "Siddhivinayak Temple",
    pincode: 387130
  },
];

export function getData() {
  return defaultData
};

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


export const headerRow = {
  description: "Description",
  disable: false,
  key: "test",
  type: "text",
  value: "Value here"
}
export const headerColumnDataForDisplay = [
  {
    name: "action",
    displayName: " ",
    minSize: 64,
    maxSize: 64
  },
  {
    name: "key",
    displayName: "Key",
    width: 145,
    minSize: 145,
    enableResizing: true,
  },
  {
    name: "value",
    displayName: "Value",
    width: 145,
    enableResizing: true,
  },
  {
    name: "description",
    displayName: "Description",
    width: 145
  }
]


export const TableInput = (props: any) => {
  let { onChange, autoFocus, cell, rows } = props
  const [inputValue, setInputValue] = useState(cell.cellValue);

    return <Td 
      style={{ width: cell.columnSize + "px" }}
      className={" h-[30px] relative overflow-hidden overflow-ellipsis whitespace-nowrap align-baseline"}>

      <input
        type="text"
        placeholder={``}
        value={inputValue}
        autoFocus={autoFocus}
        onChange={(e) => {
          setInputValue(e.target.value);}}
          onBlur={(e) => {
          let updatedRow = Object.assign([],rows);
          updatedRow[cell.rowIndex] = {...updatedRow[cell.rowIndex], [cell.columnId]: e.target.value}
          onChange(updatedRow)
        }}
        className="text-appForeground bg-appBackground h-[29px]  w-full
                            absolute top-0 left-0 !border-0 p-1 text-base overflow-ellipsis focus:!border-0"
      />
    </Td>
}