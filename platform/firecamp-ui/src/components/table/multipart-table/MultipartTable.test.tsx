import { FC } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import MultipartTable from './MultipartTable';
import { IMultipartTable } from './MultipartTable.interfaces';
import { ITableRows, TTableApi } from '../primitive/table.interfaces';

import { _array } from '@firecamp/utils';
import ResizeObserver from '../../../../__mocks__/ResizeObserver';
import { click } from '../../../../__mocks__/eventMock';
import { defaultData, _columns } from '../../../../__mocks__/testData';

window.ResizeObserver = ResizeObserver;

const Template: FC<IMultipartTable<any>> = ({ ...args }) => {
  return <MultipartTable onChange={args.onChange} {...args} />;
};
const BasicDataWithDefaultRowsArgs = {
  rows: defaultData,
  disabled: false,
  title: 'Table Title',
  options: {},
  onChange: (value: ITableRows) => console.log(`change event`, value),
  onMount: (value: TTableApi) => console.log(`mount event`, value),
};

describe('Table : ', () => {
  const mountTableComponent = () =>
    render(<Template {...BasicDataWithDefaultRowsArgs} />);

  const getRenderedTable = () => screen.queryByRole('table');
  const getTableBody = () => screen.getAllByRole('rowgroup');
  const getRenderedTableRow = async () =>
    within(getTableBody()[1]).findAllByRole('row');

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

  test('Table should render components based on column id provided', async () => {
    // ColumnId - value : MultipartInput component
    // validate the icon & checking its icon click event
    // validate the icon input fields available based on type update

    mountTableComponent();
    let initialMountedRow = await getRenderedTableRow();

    let columnIndexForMultipartInput = _columns.findIndex(
      (col) => col.key === 'value'
    );
    let MultipartInputElement =
      initialMountedRow[0].children?.[columnIndexForMultipartInput]
        .firstElementChild;

    // initial - icon title should be IconTextSize & text field is of SingleLineEditor
    let svgIconWrapperDiv = MultipartInputElement.lastElementChild;
    expect(svgIconWrapperDiv).toHaveClass('cursor-pointer ml-auto pr-1 h-4');

    let svgIcon = svgIconWrapperDiv.firstElementChild as HTMLElement;
    expect(svgIcon.textContent).toBe('IconTextSize');

    let textFieldWrapperDiv = MultipartInputElement.firstElementChild;
    expect(textFieldWrapperDiv).toHaveClass('without-border px-1 w-full');

    click(svgIcon);

    // later - icon title should be IconFile & text field is of input type
    expect(
      svgIconWrapperDiv.contains(screen.getByTestId('file-icon'))
    ).toBeTruthy();

    let fileSelectionInputField = MultipartInputElement.children[0];
    expect(fileSelectionInputField.textContent).toBe('select file');
  });
});
