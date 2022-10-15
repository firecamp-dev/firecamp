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

    await dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);
    await waitFor(() => getAllSortableRow());
    const rowSorter1 = await getAllSortableRowElement();
    const updatedRowId = rowSorter1[dropIndex].parentElement.id;

    expect(initialRowId).toBe(updatedRowId);
    });

})


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

const dragAndDrop = (elemDrag: HTMLElement, elemDrop: HTMLElement) => {
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
