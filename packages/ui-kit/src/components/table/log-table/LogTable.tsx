import { useRef } from 'react';
import { _array } from '@firecamp/utils';
import { VscArrowUp } from '@react-icons/all-files/vsc/VscArrowUp';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';
import Table from '../primitive/FlatTable';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { IBasicTable } from '../basic-table/BasicTable.interfaces';

const _columns = [
  { id: 'type', key: 'type', name: 'Type', width: '40px', fixedWidth: true },
  { id: 'event', key: 'event', name: 'Event', width: '100px' },
  {
    id: 'message',
    key: 'message',
    name: 'Message',
    width: '150px',
    resizeWithContainer: true,
  },
  { id: 'length', key: 'length', name: 'Length', width: '100px' },
  { id: 'time', key: 'time', name: 'Time', width: '80px' },
];

const LogTable = ({
  name = '',
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IBasicTable<any>) => {
  const apiRef = useRef<TTableApi>();

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
    console.log(row, cellValue, column, 'cellValue');
    switch (column.id) {
      case 'type':
        if (row.type == 'R') {
          return <VscArrowDown size={18} />;
        } else if (row.type == 'S') {
          return <VscArrowUp size={18} />;
        } else if (row.type == 'SYS') {
          return <VscCircleFilled size={18} />;
        }
        return <></>;
      case 'event':
        return row.event;
      case 'message':
        if (row.type == 'SYS') {
          return <span dangerouslySetInnerHTML={{ __html: row.title }} />;
        } else {
          return (
            <>
              {row.type !== 'file'
                ? row.body || ''
                : row.name || 'Sending File'}
            </>
          );
        }
      case 'length':
        return row.meta?.length;
      case 'time':
        return <>{new Date(row.timestamp).toLocaleTimeString()}</>;
        break;
      default:
        return JSON.stringify(cellValue);
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

export default LogTable;
