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
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
  onFocusRow,
  classes = {},
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
    // console.log(row, cellValue, column, 'cellValue');
    const { title = '', message = {}, __meta = {}, __ref = {} } = row;
    switch (column.id) {
      case 'type':
        if (__meta.type == 'r') {
          return <VscArrowDown size={18} />;
        } else if (__meta.type == 's') {
          return <VscArrowUp size={18} />;
        } else if (__meta.type == 'sys') {
          return <VscCircleFilled size={18} />;
        }
        return <></>;
      case 'event':
        return __meta.event;
      case 'message':
        if (__meta.type == 'sys') {
          return (
            <span
              className="w-32 min-w-full block truncate"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          );
        } else {
          return (
            <div className="w-32 min-w-full block truncate">
              {__meta.type !== 'file'
                ? message.body || ''
                : message.name || 'Sending File'}
            </div>
          );
        }
      case 'length':
        return __meta.length;
      case 'time':
        return <>{new Date(__meta.timestamp).toLocaleTimeString()}</>;
        break;
      default:
        return JSON.stringify(cellValue);
    }
  };

  return (
    <Table
      classes={classes}
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
      onFocusRow={onFocusRow}
      options={options}
    />
  );
};

export default LogTable;
