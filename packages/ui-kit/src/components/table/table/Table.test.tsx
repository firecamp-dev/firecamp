import {SimpleTable} from "./Table.stories";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import  ResizeObserver  from "../../../../__mocks__/ResizeObserver";

window.ResizeObserver = ResizeObserver;

describe("Table : " , () =>{

  test('Table is rendered', () => {
    render(<div></div>);
        // render(<SimpleTable {...SimpleTable.args}/>);
        // const renderedTable = screen.getByRole('table');
        // expect(renderedTable).toBeInTheDocument();
  });


  // //table columns should be same as provided in columns
  // const columnHeading = within(renderedTable).getAllByRole('columnheader')
  // expect(columnHeading).toHaveLength(columnDataForDisplay.length)

  // //column heading value should be same as provided in displayName
  // const columnHeadingDifferFromDisplayName = columnHeading.filter((data, index) => columnDataForDisplay[index].displayName !== data.textContent)
  // expect(columnHeadingDifferFromDisplayName).toHaveLength(0);
  
  // //validate the rows rendered into the table
  // const tableBody = await within(renderedTable).getAllByRole("rowgroup")[1]
  // const tableRows = await within(tableBody).findAllByRole("row")
  // expect(tableRows).toHaveLength(defaultData.length);
 
  // //validate all rows are sortable
  // tableRows.map(row => expect(row.draggable).toBeTruthy());

  // //on mousedown/touch start on column header resizer div should update the styles of the element
  // const columnResizer = await canvas.queryAllByTestId('col-resizer');
  // if(!_array.isEmpty(columnResizer)){
    
  //   await fireEvent.mouseDown(columnResizer[0]);
  //   expect(columnResizer[0].className).toBe("pt-resizer h-full pt-resizing");
  //   await fireEvent.mouseUp(columnResizer[0]);  

  // //table column resize logic : column width is updating along with resizer div's offsetLeft value
  // const resizerElement = columnResizer[2] , resizerElementColumnWidth = resizerElement.parentNode;
  // const intialColumnWidth = resizerElementColumnWidth.offsetWidth;
  // const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 },{ clientX: 200, clientY: 0 }] 

  // await fireEvent.mouseDown(resizerElement, columnMouseMoveOffset[0]);
  // await fireEvent.mouseMove(resizerElement, columnMouseMoveOffset[1]);
  // await fireEvent.mouseUp(resizerElement, columnMouseMoveOffset[1])

  // expect(resizerElementColumnWidth.offsetWidth).toBeGreaterThan(intialColumnWidth);
  // }

  // //table row sorting logic : first row location should be shifted to last using the drag button's row key
  // const dragIndex = 0, dropIndex = 2;
  // const rowSorter = await within(tableBody).findAllByTestId('row-sorter');
  // const initialRowId = rowSorter[dragIndex].parentNode.id;

  // dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);
  // const rowSorted = await within(tableBody).findAllByTestId('row-sorter');
  // const updatedRowId = rowSorted[dropIndex].parentNode.id;
  
  // expect(initialRowId).toBe(updatedRowId)

})
