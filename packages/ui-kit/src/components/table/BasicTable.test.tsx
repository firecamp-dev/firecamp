//@ts-nocheck
import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {BasicTableData} from "./BasicTable.stories";
import  ResizeObserver  from "../../../__mocks__/ResizeObserver";
import  {dragAndDrop, dropAndMove, mouseDrop, mouseUp}  from "../../../__mocks__/eventMock";
import { _array } from '@firecamp/utils';
import { defaultData, _columns } from '../../../__mocks__/testData';

window.ResizeObserver = ResizeObserver;


describe("Table : " , () => {

  const COLUMNS_PROVIDED = _columns;
  const ROWS_PROVIDED = defaultData;

  const mountTableComponent = () => render(<BasicTableData {...BasicTableData.args}/>);
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
    const columnHeadingDifferFromDisplayName = columnHeading.filter((data, index) => COLUMNS_PROVIDED[index].name !== data.textContent)
    expect(columnHeadingDifferFromDisplayName).toHaveLength(0);
  });
  
  test('Table rows should be same as provided in ROWS_PROVIDED(data) including header', async () => {
    mountTableComponent();
    const tableRows = await getRenderedTableRow();
    expect(tableRows).toHaveLength(ROWS_PROVIDED.length + 1);
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
      mouseDrop(columnResizer[moveElementWidthIndex]);
      await waitFor(() => getAllColumnHeadingResizableElement());
      expect(columnResizer[moveElementWidthIndex].className).toBe("pt-resizer pt-resizing");
      mouseUp(columnResizer[moveElementWidthIndex]);  
      
    //table column resize logic : column width is updating along with resizer div's offsetLeft value
    const resizerElement = columnResizer[moveElementWidthIndex];
    const intialColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);
    const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 },{ clientX: 200, clientY: 0 }] 

    dropAndMove(resizerElement, columnMouseMoveOffset);
    await waitFor(() => getAllColumnHeadingResizableElement());
    let updatedColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);

    expect(updatedColumnWidth).toBeGreaterThan(intialColumnWidth);
    }else{
      expect(BasicTableData.args.tableResizable).toBeFalsy();
    }
  });

  test('table row sorting logic : first row location should be shifted to last using the drag buttons row key',async() => {
    mountTableComponent();
    const dragIndex = 0, dropIndex = 1;
    const rowSorter = await getAllSortableRowElement();
    const initialRowId = rowSorter[dragIndex].parentElement.id;

    dragAndDrop(rowSorter[dragIndex], rowSorter[dropIndex]);    
    await waitFor(() => getAllSortableRow());
    const rowSorted = await getAllSortableRowElement();
    const updatedRowId = rowSorted[dropIndex].parentElement.id;

    expect(initialRowId).toBe(updatedRowId);
    });

})

//Todo
// pending test cases for rows sorting && options disabled
// Remove //@ts-nocheck by adding appropriate  types in Checkbox, SingleLineEditor, BasicTable, primitiveTable
// update the type for onMount/onChange event
// remove rt8 table usage
