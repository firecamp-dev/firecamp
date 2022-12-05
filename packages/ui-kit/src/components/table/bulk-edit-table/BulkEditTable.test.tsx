import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WithTableOptions, TemplateWithRowChange } from "./BulkEditTable.stories";
import { _array } from '@firecamp/utils';
import ResizeObserver from "../../../../__mocks__/ResizeObserver";
import { click } from "../../../../__mocks__/eventMock";

window.ResizeObserver = ResizeObserver;

describe("Table : ", () => {

  const mountTableComponent = () => render(<WithTableOptions {...WithTableOptions.args} />);
  
  const getRenderedTable = () => screen.getByRole('table');

  test('Table should render with provided title along with header containing BulkEdit button ', () => {
    let {container} = mountTableComponent();
    
    //validate the table title if not empty
    let headerDiv = container.getElementsByClassName("fc-tab-panel-header")[0];
    let titleElement = headerDiv.getElementsByTagName("span")[0];
    if(WithTableOptions.args.title !== ""){
      expect(titleElement.textContent).toBe(WithTableOptions.args.title);
    }
    
    //At initial time buttonelement text should be "Bulk Edit";
    let buttonElement = screen.getByText("Bulk Edit");
    expect(buttonElement).toBeInTheDocument();

    expect(getRenderedTable()).toBeInTheDocument();
  });

  test('Table should switch to editor when BulkEdit button from header is clicked', async () => {
    let {container} = mountTableComponent();
    
    //At initial time buttonelement text should be "Bulk Edit";
    let SwitchButton = screen.getAllByRole('button');
    await click(SwitchButton[0]);
    
    expect(SwitchButton[0].textContent).toBe("Key-Value Edit")
    // console.log(`tableComponent`, SwitchButton[0].textContent);
    // expect(tableComponent).not.toBeInTheDocument();
    
  });
})

//@ts-nocheck
//SingleLineEditor
//BulkEditTable
//Editor
//firecamp.completion-provider.ts
//firecamp.hover-provider.ts