import { render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BasicDataWithDefaultRows } from "./MultipartTable.stories";
import { _array } from '@firecamp/utils';
import ResizeObserver from "../../../../__mocks__/ResizeObserver";
import { click } from "../../../../__mocks__/eventMock";
import { _columns } from "../../../../__mocks__/testData";

window.ResizeObserver = ResizeObserver;

describe("Table : ", () => {

  const mountTableComponent = () => render(<BasicDataWithDefaultRows {...BasicDataWithDefaultRows.args} />);

  const getRenderedTable = () => screen.queryByRole('table');
  const getTableBody = () => screen.getAllByRole('rowgroup');
  const getRenderedTableRow = async () => within(getTableBody()[1]).findAllByRole("row");

  //discuss add test cases similar to basic table - ?
  test('Table should render', () => {
    mountTableComponent();

    expect(getRenderedTable()).toBeInTheDocument();
  });

  test('table add options : should add a new row on click action on "Add Row" button ', async () => {
    mountTableComponent();
    let initialMountedRow = await getRenderedTableRow();
    let AddRowButton = screen.getByRole('button', { name: 'Add Row' });
    click(AddRowButton);
    let updatedMountedRow = await waitFor(() => getRenderedTableRow());
    expect(updatedMountedRow).toHaveLength(initialMountedRow.length + 1);
  });

  test('Table should render components based on column id provied', async () => {
    // ColumnId - value : MultipartInput component 
    // validate the icon & checking its icon click event
    // validate the icon input fields available based on type update

    mountTableComponent();
    let initialMountedRow = await getRenderedTableRow();

    let columnIndexForMultipartInput = _columns.findIndex(col => col.key === 'value');
    let MultipartInputElement = initialMountedRow[0].children?.[columnIndexForMultipartInput].firstElementChild;

    // initial - icon title should be IconTextSize & text field is of SingleLineEditor
    let svgIconWrapperDiv = MultipartInputElement.lastElementChild;
    expect(svgIconWrapperDiv).toHaveClass("absolute cursor-pointer");

    let svgIcon = svgIconWrapperDiv.firstElementChild as HTMLElement;
    expect(svgIcon.textContent).toBe("IconTextSize");

    let textFieldWrapperDiv = MultipartInputElement.firstElementChild;
    expect(textFieldWrapperDiv).toHaveClass("without-border px-2");

    click(svgIcon);

    // later - icon title should be IconFile & text field is of input type
    expect(svgIconWrapperDiv.querySelector('svg').textContent).toBe("IconFile");
    let fileSelectionInputField = MultipartInputElement.children[0];
    expect(fileSelectionInputField).toHaveAttribute("type", "file");
    expect(fileSelectionInputField).toHaveClass("fc-file-input hidden");

    let selectedFileTextWrapper = MultipartInputElement.children[1];
    expect(selectedFileTextWrapper).toHaveClass("cursor-pointer text-left text-sm text-base text-ellipsis overflow-hidden pl-1 pr-4 whitespace-pre");
    expect(selectedFileTextWrapper.textContent).toBe("select file");

  });

});

//@ts-nocheck
//MultipartTable