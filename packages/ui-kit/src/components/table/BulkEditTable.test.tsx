//@ts-nocheck
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WithTableOptions, TemplateWithRowChange } from "./BulkEditTable.stories";
import ResizeObserver from "../../../__mocks__/ResizeObserver";
import { dragAndDrop, dropAndMove, mouseDrop, mouseUp, click } from "../../../__mocks__/eventMock";
import { _array } from '@firecamp/utils';
import { defaultData, _columns } from '../../../__mocks__/testData';

window.ResizeObserver = ResizeObserver;


describe("Table : ", () => {

  const mountTableComponent = () => render(<WithTableOptions {...WithTableOptions.args} />);
  
  const getRenderedTable = () => screen.getByRole('table');

  const getAllColumnHeading = () => screen.getAllByRole('columnheader');
  const getAllColumnHeadingResizableElement = () => screen.findAllByTestId('col-resizer');

  const getTableBody = () => screen.getAllByRole('rowgroup');
  const getRenderedTableRow = async () => within(getTableBody()[1]).findAllByRole("row");
  const getAllSortableRow = async () => (await screen.findAllByTestId('row-sorter')).map(ele => ele.parentElement.parentElement);
  const getAllSortableRowElement = () => screen.findAllByTestId('row-sorter');

  test('Table should render with provided title', () => {
    mountTableComponent();
    let titleElement = screen.getByText(WithTableOptions.args.title); 
    console.log(`getElement byt tile`, titleElement)
    expect(getRenderedTable()).toBeInTheDocument();
  });
})
