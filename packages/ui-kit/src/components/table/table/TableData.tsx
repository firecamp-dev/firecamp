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

//For keeping column as static - provide minSize & width without resizing param
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
    minSize: 145,
    enableResizing: true,
  },
  {
    name: "description",
    displayName: "Description",
    minSize: 145,
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
    width: 64
  },
  {
    name: "key",
    displayName: "Key",
    minSize: 145,
    enableResizing: true,
  },
  {
    name: "value",
    displayName: "Value",
    minSize: 145,
    enableResizing: true,
  },
  {
    name: "description",
    displayName: "Description",
    minSize: 145
  }
]


export const TableInput = (props: any) => {
  let { onChange, autoFocus, cell, rows } = props
  const [inputValue, setInputValue] = useState(cell.cellValue);

    return <Td 
      style={{ width: cell.column.getSize() }}
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

/* Drag & drop event for testing */

const fireMouseEvent = function (
  type: string,
  elem: EventTarget,
  centerX: number,
  centerY: number
) {
  const evt = new MouseEvent(type, {
    bubbles:true,
    cancelable: true,
    view: window,
    detail: 1,
    screenX: 1,
    screenY: 1,
    clientX: centerX,
    clientY: centerY,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: elem
  });
  return elem.dispatchEvent(evt);
};

export const dragAndDrop = (elemDrag: HTMLElement, elemDrop: HTMLElement) => {
      // calculate positions
      let pos = elemDrag.getBoundingClientRect();
      const center1X = Math.floor((pos.left + pos.right) / 2);
      const center1Y = Math.floor((pos.top + pos.bottom) / 2);

      pos = elemDrop.getBoundingClientRect();
      const center2X = Math.floor((pos.left + pos.right) / 2);
      const center2Y = Math.floor((pos.top + pos.bottom) / 2);

      // mouse over dragged element and mousedown
      fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
      fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);
      fireMouseEvent('mouseover', elemDrag, center1X, center1Y);
      fireMouseEvent('mousedown', elemDrag, center1X, center1Y);

      // start dragging process over to drop target
      const dragStarted = fireMouseEvent(
          'dragstart',
          elemDrag,
          center1X,
          center1Y
      );
      if (!dragStarted) {
          return;
      }

      fireMouseEvent('drag', elemDrag, center1X, center1Y);
      fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
      fireMouseEvent('drag', elemDrag, center2X, center2Y);
      fireMouseEvent('mousemove', elemDrop, center2X, center2Y);

      // trigger dragging process on top of drop target
      fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);
      fireMouseEvent('dragenter', elemDrop, center2X, center2Y);
      fireMouseEvent('mouseover', elemDrop, center2X, center2Y);
      fireMouseEvent('dragover', elemDrop, center2X, center2Y);

      // release dragged element on top of drop target
      fireMouseEvent('drop', elemDrop, center2X, center2Y);
      fireMouseEvent('dragend', elemDrag, center2X, center2Y);
      fireMouseEvent('mouseup', elemDrag, center2X, center2Y);
  
};