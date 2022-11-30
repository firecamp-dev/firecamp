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

  //Todo add test cases similar to basic table
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

  test('Table should render MultipartInput component on columnid- value, & checking click event on icon', async () => {
    mountTableComponent();
    let initialMountedRow = await getRenderedTableRow();

    let columnIndexForMultipartInput = _columns.findIndex(col => col.key === 'value');
    let TDElement = initialMountedRow[0].children?.[columnIndexForMultipartInput];
    //find nested elements from MultipartInput
    let MultipartInputElement = TDElement.firstElementChild;
    let MultipartInputElementSvgIcon = MultipartInputElement.lastElementChild.firstElementChild as HTMLElement;
    let initialIconName = MultipartInputElementSvgIcon.textContent;
    // let MultipartInputElementSvgIcon = screen.getAllByTitle("IconTextSize")[0];

    // screen.debug(screen.getAllByTitle("IconTextSize"));
    expect(initialIconName).toBe("IconTextSize");
  
    click(MultipartInputElementSvgIcon);
    
    await waitFor(() => screen.getAllByTitle("IconTextSize") )
    let updatedIconName = MultipartInputElement.lastElementChild.firstElementChild.textContent;
    
    expect(updatedIconName).toBe("IconFile");
    

  });

});

//@ts-nocheck
//MultipartTable