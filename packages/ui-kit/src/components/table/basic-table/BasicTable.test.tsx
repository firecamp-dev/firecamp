import { render, screen, waitFor, within } from "@testing-library/react";
import { _array } from '@firecamp/utils';
import "@testing-library/jest-dom";
import { BasicTableData, DisableSortRow, DisableNewRow, DisableRemoveRow, DisableColumns } from "./BasicTable.stories";
import ResizeObserver from "../../../../__mocks__/ResizeObserver";
import { dragAndDrop, dropAndMove, mouseDrop, mouseUp, click } from "../../../../__mocks__/eventMock";
import { defaultData, _columns } from '../../../../__mocks__/testData';

window.ResizeObserver = ResizeObserver;


describe("Table : ", () => {

  const COLUMNS_PROVIDED = _columns;
  const ROWS_PROVIDED = defaultData;

  const mountTableComponent = () => render(<BasicTableData {...BasicTableData.args} />);
  const mountDisableSortRowTableComponent = () => render(<DisableSortRow {...DisableSortRow.args} />);
  const mountDisableNewRowTableComponent = () => render(<DisableNewRow {...DisableNewRow.args} />);
  const mountDisableRemoveRowTableComponent = () => render(<DisableRemoveRow {...DisableRemoveRow.args} />);
  const mountDisableColumnsTableComponent = () => render(<DisableColumns {...DisableColumns.args} />);

  const getRenderedTable = () => screen.getByRole('table');

  const getAllColumnHeading = () => screen.getAllByRole('columnheader');
  const getAllColumnHeadingResizableElement = () => screen.findAllByTestId('col-resizer');

  const getTableBody = () => screen.getAllByRole('rowgroup');
  const getRenderedTableRow = async () => within(getTableBody()[1]).findAllByRole("row");
  const getAllSortableRow = async () => (await screen.findAllByTestId('row-sorter')).map(ele => ele.parentElement.parentElement);
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
    expect(tableRows).toHaveLength(ROWS_PROVIDED.length);
  });

  test('Table rows are sortable', async () => {
    mountTableComponent();
    const tableRows = await getRenderedTableRow();
    tableRows.map((row: HTMLElement) => {

      let SortElementContainerDiv= row.firstChild.firstChild as HTMLElement ;
      expect(SortElementContainerDiv).toHaveClass("flex drag");
      let SortElement = within(row.firstChild as HTMLElement).queryByTestId('row-sorter');
      return expect(SortElement.draggable).toBeTruthy();

    });
  });

  test('on mousedown/touch start on column header resizer div should update the styles of the element', async () => {

    mountTableComponent();
    const columnResizer = await getAllColumnHeadingResizableElement();

    //table columns should be resizable 
    if (!_array.isEmpty(columnResizer)) {
      const moveElementWidthIndex = 2;

      //table column resizer element : updating the classname on hover over the element
      mouseDrop(columnResizer[moveElementWidthIndex]);
      await waitFor(() => getAllColumnHeadingResizableElement());
      expect(columnResizer[moveElementWidthIndex].className).toBe("pt-resizer pt-resizing");
      mouseUp(columnResizer[moveElementWidthIndex]);

      //table column resize logic : column width is updating along with resizer div's offsetLeft value
      const resizerElement = columnResizer[moveElementWidthIndex];
      const intialColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);
      const columnMouseMoveOffset = [{ clientX: 144, clientY: 0 }, { clientX: 200, clientY: 0 }]

      dropAndMove(resizerElement, columnMouseMoveOffset);
      await waitFor(() => getAllColumnHeadingResizableElement());
      let updatedColumnWidth = parseInt(resizerElement.parentElement.style.minWidth);

      expect(updatedColumnWidth).toBeGreaterThan(intialColumnWidth);
    } else {
      expect(BasicTableData.args.tableResizable).toBeFalsy();
    }
  });

  test('table row sorting logic : first row location should be shifted to last using the drag buttons row key', async () => {
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

  test('table options : allowSort to disable the row sorting ', async () => {
    mountDisableSortRowTableComponent()
    const tableRows = await getRenderedTableRow();
    tableRows.map((row: HTMLElement) => {
      let SortElementContainerDiv = row.firstChild.firstChild as HTMLElement;
      expect(SortElementContainerDiv).toHaveClass("flex drag justify-center");
      let SortElement = within(row.firstChild as HTMLElement).queryByTestId('row-sorter');
      return expect(SortElement).toBeNull()
    });
  })

  test('table options : allowRowAdd value should prevent the action on "Add Row" button and apply disable styles ', async () => {
    mountDisableNewRowTableComponent();
    let initialMountedRow = await getRenderedTableRow();
    let AddRowButton = screen.getByRole('button', { name: 'Add Row' });
    expect(AddRowButton).toHaveClass('cursor-default')
    click(AddRowButton);
    let updatedMountedRow = await waitFor(() => getRenderedTableRow());
    expect(initialMountedRow).toHaveLength(updatedMountedRow.length);
  });

  test('table options : allowRowRemove value should not render trash icon ', async () => {
    mountDisableRemoveRowTableComponent();
    let tableRows = await getRenderedTableRow();
    tableRows.map((row: HTMLElement) => {
      expect(row.lastChild.hasChildNodes()).toBeFalsy();
    })
  });

  test('table options : disabledColumns [] should pass the disable prop to the child element whose column key is defined', async () => {
    mountDisableColumnsTableComponent(); //"disable", "value"

    let columnIndex = COLUMNS_PROVIDED.reduce((obj, column, index) =>
      (DisableColumns.args.options.disabledColumns.includes(column.key)) ?
        [...obj, { index, key: column.key }] : obj
      , []);

    let tableRows = await getRenderedTableRow();

    //testing every rows rendered column value (validated for checkbox)
    tableRows.map((row: HTMLElement, i) => {

      columnIndex.map((col) => {

        let TableDataFirstElement = row.childNodes[col.index].firstChild;

        if (col.key === "disable") {
          // For checkbox - styles updated of last child
          let checkBoxElement = TableDataFirstElement.lastChild, checkBoxDiv;
          checkBoxElement.childNodes[0].childNodes.forEach(childElement => {
            if (childElement.nodeName == "DIV") checkBoxDiv = childElement;
          });
          expect(checkBoxDiv).toHaveClass("opacity-50 cursor-default");
        }
        else if(col.key === "value"){
          let editorElement = TableDataFirstElement;
          expect(editorElement).toHaveClass("opacity-50");
        }
      });

    });

  });

})