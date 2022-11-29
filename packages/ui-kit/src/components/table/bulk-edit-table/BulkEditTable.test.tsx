import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WithTableOptions, TemplateWithRowChange } from "./BulkEditTable.stories";
import { _array } from '@firecamp/utils';
import ResizeObserver from "../../../../__mocks__/ResizeObserver";
import { click } from "../../../../__mocks__/eventMock";

window.ResizeObserver = ResizeObserver;

describe("Table : ", () => {

  const mountTableComponent = () => render(<WithTableOptions {...WithTableOptions.args} />);
  
  const getRenderedTable = () => screen.queryByRole('table');

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
    
    //At initial time, validate button text & rendered component based on selected mode
    let SwitchButton = screen.getAllByRole('button');
    expect(SwitchButton[0].textContent).toBe("Bulk Edit");
    expect(getRenderedTable()).toBeInTheDocument();
    await click(SwitchButton[0]);
    
    let updatedButton = await waitFor(() => screen.getAllByRole('button'));
    expect(updatedButton[0].textContent).toBe("Key-Value Edit");
    expect(getRenderedTable()).toBeNull();

    let editorWrapper = container.getElementsByClassName('firecamp-editor__placeholder')[0]?.parentElement;
    expect(editorWrapper).toBeInTheDocument();
    // let editor = await screen.findAllByTestId('monaco-editor');
    // console.log(`editorWrapper`, editor)


  });
});

//@ts-nocheck
//SingleLineEditor
//BulkEditTable
//Editor
//firecamp.completion-provider.ts
//firecamp.hover-provider.ts