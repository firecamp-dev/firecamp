import { useRef } from 'react';
import { _array } from '@firecamp/utils';
import Table from './primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from './primitive/table.interfaces';
import { IBasicTable } from './BasicTable.interfaces';

const BasicTable = ({
  name = '',
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IBasicTable<any>) => {
  const apiRef = useRef<TTableApi>();

  const _columns = [
    { id: 'type', key: 'type', name: 'Type', width: '40px', fixedWidth: true },
    { id: 'event', key: 'event', name: 'Event', width: '100px' },
    {
      id: 'message',
      key: 'message',
      name: 'message',
      width: '150px',
      resizeWithContainer: true,
    },
    { id: 'length', key: 'length', name: 'Length', width: '100px' },
    { id: 'time', key: 'time', name: 'Time', width: '80px' },
  ];

  const renderCell: TRenderCell<any> = (
    column,
    cellValue,
    rowIndex,
    row,
    tableApi,
    onChange,
    handleDrag,
    options
  ) => {
    console.log(row, cellValue, column, "cellValue")
    switch (column.id) {
      case 'type':
      case 'event':
      case 'message':
      case 'length':
      case 'time':
        return row.event;
        break;
      default:
        return row.event
    }
  };

  return (
    <Table
      rows={rows}
      columns={_columns}
      renderColumn={(c) => c.name}
      defaultRow={{}}
      renderCell={renderCell}
      onChange={(rows) => {
        // console.log(rows)
        onChange(rows);
      }}
      onMount={(tApi) => {
        if (typeof onMount == 'function') {
          onMount(tApi);
          apiRef.current = tApi;
        }
      }}
      options={options}
    />
  );
};

export default BasicTable;
