import { FC } from 'react';
import { SingleLineEditor, Checkbox } from '@firecamp/ui-kit';

import Table from './Table';

const columns = [
    {
      name: 'action',
      displayName: ' ',
      minSize: 64,
      width: 64,
    },
    {
      name: 'value',
      displayName: 'City',
      minSize: 145,
      enableResizing: true,
    },
    {
      name: 'description',
      displayName: 'Description',
      minSize: 145,
      enableResizing: true,
    },
    {
      name: 'popularPlace',
      displayName: 'Location',
      enableResizing: true,
    },
    {
      name: 'pincode',
      minSize: 60,
      displayName: 'Area Code',
    },
  ];

const BasicTable: FC<any> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => {},
  meta = { mode: {} },
}) => {
  return (
    <>
      <div className="smart-table-header-wrapper">
        {title ? <div className="smart-table-header">{title}</div> : ''}
      </div>

      <Table
        name="basic_table"
        width={500}
        resizable={true}
        data={rows}
        options={{
          containerClassName: '',
          minColumnSize: 100,
        }}
        columns={columnDetails}
        columnRenderer={(row) => <>{row}</>}
        cellRenderer={(cell) => {
          return <input />;
        }}
      />
    </>
  );
};

export default BasicTable;
