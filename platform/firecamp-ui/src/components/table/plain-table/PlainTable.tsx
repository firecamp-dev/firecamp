import { useRef } from 'react';
import cx from 'classnames';
import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';

import Checkbox from '../../checkbox/Checkbox';
import Table from '../primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { IPlainTable } from './PlainTable.interfaces';

const _columns = [
  { id: 'select', key: 'disable', name: '', width: '40px', fixedWidth: true },
  { id: 'key', key: 'key', name: 'Key', width: '150px' },
  { id: 'value', key: 'value', name: 'Value', width: '150px' },
  {
    id: 'description',
    key: 'description',
    name: 'Description',
    width: '100px',
    resizeWithContainer: true,
  },
  { id: 'remove', key: '', name: '', width: '20px', fixedWidth: true },
];

const PlainTable = ({
  title = '',
  columns,
  classes,
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IPlainTable<any>) => {
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
    switch (column.id) {
      case 'select':
        return (
          <div
            className={cx('flex drag', {
              'justify-center': !options.allowSort,
            })}
          >
            {options.allowSort && (
              <span
                className="flex drag-icon"
                draggable={true}
                onDragStart={(e) => {
                  handleDrag(row);
                }}
                data-testid="row-sorter"
              >
                <GrDrag opacity={0.3} size={16} />
              </span>
            )}

            <Checkbox
              isChecked={!cellValue}
              onToggleCheck={(label, val: boolean) => {
                onChange(column.key, !val);
              }}
              disabled={options.disabledColumns.includes(column.key)}
            />
          </div>
        );
        break;
      case 'key':
      case 'value':
      case 'description':
        return (
          <div className="bg-transparent text-base text-appForeground font-sans px-2 select-text">
            {cellValue}
          </div>
        );
        break;
      case 'remove':
        if (!options.allowRowRemove) return <></>;
        return (
          <div className="px-2 flex">
            <VscTrash
              size={14}
              className="text-error cursor-pointer"
              onClick={(e) => tableApi?.removeRow(row.id)}
            />
          </div>
        );
        break;
      default:
        return column.key;
    }
  };

  return (
    <Table
      rows={rows}
      columns={columns ?? _columns}
      classes={classes}
      renderColumn={(c) => c.name}
      defaultRow={{
        key: '',
        value: '',
        disable: false,
        type: 'text',
        description: '',
      }}
      renderCell={renderCell}
      onChange={(rows) => onChange(rows)}
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

export default PlainTable;
