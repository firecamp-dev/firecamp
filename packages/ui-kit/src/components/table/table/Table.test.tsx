import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {SimpleTable} from "./Table.stories";
import  ResizeObserver  from "../../../../__mocks__/ResizeObserver";
import { _array } from '@firecamp/utils';

window.ResizeObserver = ResizeObserver;

describe("Table : " , () => {

  const COLUMNS_PROVIDED = SimpleTable.args.columns;
  const ROWS_PROVIDED = SimpleTable.args.data;

  const mountTableComponent = () => render(<SimpleTable {...SimpleTable.args}/>);
  const getRenderedTable = () => screen.getByRole('table');

  const getAllColumnHeading = () => screen.getAllByRole('columnheader');
  const getAllColumnHeadingResizableElement = () => screen.findAllByTestId('col-resizer');
  
  const getRenderedTableRow = () => screen.findAllByRole("row");
  const getAllSortableRow = async () => (await screen.findAllByTestId('row-sorter')).map(ele => ele.parentElement);
  const getAllSortableRowElement = () => screen.findAllByTestId('row-sorter');

  test('Table should render', () => {
    mountTableComponent();
    expect(getRenderedTable()).toBeInTheDocument();
  });

  test('Table columns should be same as provided in COLUMNS_PROVIDED(columns)', () => {
    mountTableComponent();
    expect(getAllColumnHeading()).toHaveLength(COLUMNS_PROVIDED.length)
  });

  test('Table columns heading value should be same as provided in displayName of columns', () => {
    mountTableComponent();
    const columnHeading = getAllColumnHeading();
    const columnHeadingDifferFromDisplayName = columnHeading.filter((data, index) => COLUMNS_PROVIDED[index].displayName !== data.textContent)
    expect(columnHeadingDifferFromDisplayName).toHaveLength(0);
  });
  
  test('Table rows should be same as provided in ROWS_PROVIDED(data)', async () => {
    mountTableComponent();
    const tableRows = await getAllSortableRow();
    expect(tableRows).toHaveLength(ROWS_PROVIDED.length);
  });
  
  test('Table rows are sortable', async() => {
    mountTableComponent();
    const tableRows = await getAllSortableRow();
    tableRows.map((row: HTMLElement) => expect(row.draggable).toBeTruthy());
  });

  test('on mousedown/touch start on column header resizer div should update the styles of the element',async () => {
    
    mountTableComponent();
    const columnResizer = await getAllColumnHeadingResizableElement();
    
    //table columns should be resizable 
    if(!_array.isEmpty(columnResizer)){
      const moveElementWidthIndex = 2;
      
      //table column resizer element : updating the classname on hover over the element
      await fireEvent.mouseDown(columnResizer[moveElementWidthIndex]);
      await waitFor(() => getAllColumnHeadingResizableElement());
      expect(columnResizer[moveElementWidthIndex].className).toBe("pt-resizer h-full pt-resizing");
      await fireEvent.mouseUp(columnResizer[moveElementWidthIndex]);  
      
    //table column resize logic : column width is updating along with resizer div's offsetLeft value
    const resizerElement = columnResizer[moveElementWidthIndex];
    const intialColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);
    const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 },{ clientX: 200, clientY: 0 }] 

    await fireEvent.mouseDown(resizerElement, columnMouseMoveOffset[0]);
    await fireEvent.mouseMove(resizerElement, columnMouseMoveOffset[1]);
    await fireEvent.mouseUp(resizerElement, columnMouseMoveOffset[1])
    await waitFor(() => getAllColumnHeadingResizableElement());
    let updatedColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);

    expect(updatedColumnWidth).toBeGreaterThan(intialColumnWidth);
    }else{
      expect(SimpleTable.args.tableResizable).toBeFalsy();
    }
  });

  test('table row sorting logic : first row location should be shifted to last using the drag buttons row key',async() => {
    mountTableComponent();
    const dragIndex = 0, dropIndex = 2;
    const rowSorter = await getAllSortableRowElement();
    const initialRowId = rowSorter[dragIndex].parentElement.id;

    dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);    
    await waitFor(() => getAllSortableRow());
    const rowSorted = await getAllSortableRowElement();
    const updatedRowId = rowSorted[dropIndex].parentElement.id;

    expect(initialRowId).toBe(updatedRowId);
    });

})


/* Drag & drop event for testing */
const dragAndDrop = async (elemDrag: HTMLElement, elemDrop: HTMLElement) => {
      // calculate positions
      let pos = elemDrag.getBoundingClientRect();
      const center1X = Math.floor((pos.left + pos.right) / 2);
      const center1Y = Math.floor((pos.top + pos.bottom) / 2);

      pos = elemDrop.getBoundingClientRect();
      const center2X = Math.floor((pos.left + pos.right) / 2);
      const center2Y = Math.floor((pos.top + pos.bottom) / 2);

      // mouse over dragged element and mousedown
      await fireEvent.mouseMove(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseEnter(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseOver(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseDown(elemDrag, {clientX: center1X, clientY: center1Y});
      
      // start dragging process over to drop target
      const dragStarted =  await fireEvent.dragStart(elemDrag, {clientX: center1X, clientY: center1Y});
      if (!dragStarted) {
          return;
      }

      await fireEvent.drag(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseMove(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.drag(elemDrag, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseMove(elemDrop, {clientX: center2X, clientY: center2Y});

      // trigger dragging process on top of drop target
      await fireEvent.mouseEnter(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragEnter(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseOver(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragOver(elemDrop, {clientX: center2X, clientY: center2Y});
      
      // release dragged element on top of drop target
      await fireEvent.drop(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragEnd(elemDrag, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseUp(elemDrag, {clientX: center2X, clientY: center2Y});
  
};
