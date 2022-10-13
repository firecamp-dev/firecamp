import {render, screen, within, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import {SimpleTable} from "./Table.stories";
import { columnDataForDisplay, defaultData, dragAndDrop } from "./TableData";
import  ResizeObserver  from "../../../../__mocks__/ResizeObserver";
import { _array } from '@firecamp/utils';

window.ResizeObserver = ResizeObserver;

describe("Table : " , () =>{

  render(<SimpleTable {...SimpleTable.args}/>);
  const renderedTable = screen.getByRole('table');
  const columnHeading = within(renderedTable).getAllByRole('columnheader');
  let tableBody: any = {}, tableRows: any = [];


  test('Table should render', () => {
    expect(renderedTable).toBeInTheDocument();
  });

  test('table columns should be same as provided in columns', () => {
    expect(columnHeading).toHaveLength(columnDataForDisplay.length)
  });

  test('column heading value should be same as provided in displayName', () => {
    const columnHeadingDifferFromDisplayName = columnHeading.filter((data, index) => columnDataForDisplay[index].displayName !== data.textContent)
    expect(columnHeadingDifferFromDisplayName).toHaveLength(0);
  });
  
  test('validate the rows rendered into the table', async () => {
    tableBody = await within(renderedTable).getAllByRole("rowgroup")[1]
    tableRows = await within(tableBody).findAllByRole("row")
    expect(tableRows).toHaveLength(defaultData.length);
  });
  
  test('validate all rows are sortable', () => {
    tableRows.map((row: HTMLElement) => expect(row.draggable).toBeTruthy());
  });

  const getTableCells = async() => {
   tableRows = Array.from(renderedTable.querySelectorAll("tr td:nth-of-type(2)"));
   let inputArray = tableRows.map((ele: HTMLTableCellElement) => ele.firstChild)
   let cellValue = inputArray.map((ele: HTMLInputElement) => ele.value)
   return cellValue; //[ 'Ahmedabad', 'Surat', 'Mahemdavad' ]
  }
  

  test('table row sorting logic : first row location should be shifted to last using the drag buttons row key',async() => {
    const dragIndex = 0, dropIndex = 2;
    const rowSorter = await within(tableBody).findAllByTestId('row-sorter');
    const initialRowId = rowSorter[dragIndex].parentElement.id;

    dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);

    const rowSorted = await within(tableBody).findAllByTestId('row-sorter');
    const updatedRowId = rowSorted[dropIndex].parentElement.id;
    
    expect(initialRowId).toBe(updatedRowId);
    });
    

  // test('on mousedown/touch start on column header resizer div should update the styles of the element',async () => {
  //   const columnResizer = await screen.queryAllByTestId('col-resizer');
  //   if(!_array.isEmpty(columnResizer)){
      
  //     await fireEvent.mouseDown(columnResizer[0]);
  //     expect(columnResizer[0].className).toBe("pt-resizer h-full pt-resizing");
  //     await fireEvent.mouseUp(columnResizer[0]);  
  
  //   //table column resize logic : column width is updating along with resizer div's offsetLeft value
  //   const resizerElement = columnResizer[2] , resizerElementColumnWidth = resizerElement.parentNode;
  //   const intialColumnWidth = resizerElementColumnWidth.offsetWidth;
  //   const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 },{ clientX: 200, clientY: 0 }] 
  
  //   await fireEvent.mouseDown(resizerElement, columnMouseMoveOffset[0]);
  //   await fireEvent.mouseMove(resizerElement, columnMouseMoveOffset[1]);
  //   await fireEvent.mouseUp(resizerElement, columnMouseMoveOffset[1])
  
  //   expect(resizerElementColumnWidth.offsetWidth).toBeGreaterThan(intialColumnWidth);
  //   }
  // });

  


})
