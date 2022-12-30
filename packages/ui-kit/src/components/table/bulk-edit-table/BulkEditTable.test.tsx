import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import BulkEditTable from "./BulkEditTable";
import { IBulkEditTable } from "./BulkEditTable.interfaces";
import { ITableRows, TTableApi } from "../primitive/table.interfaces";

import { _array } from '@firecamp/utils';
import ResizeObserver from "../../../../__mocks__/ResizeObserver";
import { click } from "../../../../__mocks__/eventMock";
import { defaultData } from "../../../../__mocks__/testData";

window.ResizeObserver = ResizeObserver;


const Template = ({...args}: IBulkEditTable) => {
  return (
    <BulkEditTable
    {...args}
    />
  );
};
const WithTableOptionsArgs = {
  rows: defaultData,
  title: 'Table Title',
  options: { 
    disabledColumns: ["key"],
    allowRowRemove: true,
    allowRowAdd: true,
    allowSort: true
  },
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value)
};

describe("Table : ", () => {

  const mountTableComponent = () => render(<Template {...WithTableOptionsArgs} />);

  const getRenderedTable = () => screen.queryByRole('table');

  test('Table should render with provided title along with header containing BulkEdit button ', () => {
    let { container } = mountTableComponent();

    //validate the table title if not empty
    let headerDiv = container.getElementsByClassName("fc-tab-panel-header")[0];
    let titleElement = headerDiv.getElementsByTagName("span")[0];
    if (WithTableOptionsArgs.title !== "") {
      expect(titleElement.textContent).toBe(WithTableOptionsArgs.title);
    }

    //At initial time buttonelement text should be "Bulk Edit";
    let buttonElement = screen.getByText("Bulk Edit");
    expect(buttonElement).toBeInTheDocument();

    expect(getRenderedTable()).toBeInTheDocument();
  });

  test('Table should switch to editor when BulkEdit button from header is clicked', async () => {
    let { container } = mountTableComponent();

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
    // screen.debug();  
    // // debug the elements rendered on the screen & validate the editor on the screen
    // await waitFor(() => {
    //   let editor = screen.queryByTestId('monaco-editor');
    //   expect(editor).toBeInTheDocument();
    // })


  });
});

// replace import in BulkEditTable to run this test
// import { default as TabHeader } from '../../tab-header/TabHeader';
// import { default as Button } from '../../buttons/Button';
// import { default as BasicTable } from '../basic-table/BasicTable';
// import { default as Editor } from '../../editors/monaco-v2/Editor';

//@ts-nocheck
//SingleLineEditor
//BulkEditTable
//Editor
//firecamp.completion-provider.ts
//firecamp.hover-provider.ts