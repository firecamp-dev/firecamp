import { useMemo, useRef } from 'react';
import { _array } from '@firecamp/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';
import Table from '../primitive/FlatTable';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { IBasicTable } from '../basic-table/BasicTable.interfaces';

type TProps = {
  titleRenderer?: (log: any) => React.ReactChild;
};

const LogTable = ({
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
  onFocusRow,
  classes = {},
  titleRenderer = (log: any) => log?.value?.value || log?.title, // @note: default title renderer as set for WS logs
}: IBasicTable<any> & TProps) => {
  const apiRef = useRef<TTableApi>();
  const _columns = useMemo(() => {
    return [
      {
        id: 'type',
        key: 'type',
        name: 'Type',
        width: '40px',
        fixedWidth: true,
      },
      { id: 'event', key: 'event', name: 'Event', width: '100px' },
      {
        id: 'value',
        key: 'value',
        name: 'Message',
        width: '150px',
        resizeWithContainer: true,
      },
      { id: 'length', key: 'length', name: 'Length', width: '100px' },
      { id: 'time', key: 'time', name: 'Time', width: '80px' },
    ];
  }, []);

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
    const { title = '', value = {}, __meta = {}, __ref = {} } = row;
    const _title = titleRenderer(row);

    // console.log('in log table', value, 787897);
    switch (column.id) {
      case 'type':
        if (__meta.type == 'r') {
          return <ArrowDown size={18} />;
        } else if (__meta.type == 's') {
          return <ArrowUp size={18} />;
        } else if (__meta.type == 'sys') {
          return <VscCircleFilled size={18} />;
        }
        return <></>;
      case 'event':
        return __meta.event;
      case 'value':
        if (__meta.type == 'sys') {
          return (
            <span
              className="w-32 min-w-full block truncate"
              dangerouslySetInnerHTML={{ __html: _title as string }}
            />
          );
        } else {
          return (
            <div className="w-32 min-w-full block truncate">
              {__meta.type !== 'file' ? _title : 'Sending File'}
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
      showDefaultEmptyRows={false}
    />
  );
};

export default LogTable;
