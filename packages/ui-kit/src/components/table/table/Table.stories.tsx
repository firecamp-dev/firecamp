//@ts-nocheck
import { useState } from 'react';
import equal from 'deep-equal';
import { _array } from '@firecamp/utils';
import { within } from '@testing-library/react';

import Table, { TableInput, TableColumnHeading } from './Table';
import { defaultData, columnDataForDisplay } from './TableData';

export default {
  title: 'UI-Kit/Table',
  component: Table,
  argTypes: {
    name: { control: 'text' },
    resizable: { control: 'boolean' },
    width: { control: 'number' },
    columns: { control: 'object' },
    data: { control: 'object' },
    options: { control: 'object' },
  },
};

const SimpleTableTemplate = ({
  name,
  resizable,
  width,
  columns,
  data: _data,
  options,
  columnRenderer,
}) => {
  let [data, setData] = useState(_data);

  let updateTableData = (newRows: any[] = []) => {
    if (!equal(newRows, data)) {
      setData(newRows);
    }
  };
  return (
    <Table
      name={name}
      width={width}
      resizable={resizable}
      data={data}
      options={options}
      columns={columns}
      columnRenderer={columnRenderer}
      cellRenderer={(cell) => {

        if(cell.column.id == 'pincode') return <span>A</span>;
        return <TableInput cell={cell} onChange={updateTableData} />;
      }}
    />
  );
};
export const SimpleTable = SimpleTableTemplate.bind({});
SimpleTable.args = {
  name: 'test-table-2',
  resizable: true,
  width: 500,
  columns: columnDataForDisplay,
  data: defaultData,
  options: {
    containerClassName: 'container-wrapper',
    minColumnSize: 100,
  },
  columnRenderer: (value) => <TableColumnHeading heading={value} />,
};

SimpleTable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  //table is rendered
  const renderedTable = await canvas.getByRole('table');
};
