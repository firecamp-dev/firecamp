import { useRef } from 'react';
import cx from 'classnames';
import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { EEditorLanguage } from '@firecamp/types';
import Button from '../../buttons/Button';
import Checkbox from '../../checkbox/Checkbox';
import SingleLineEditor from '../../editors/monaco-v2/SingleLineEditor';
import Table from '../primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { IBasicTable } from './BasicTable.interfaces';

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

const BasicTable = ({
  title = '',
  columns,
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => { },
  onMount = (api: TTableApi) => { },
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
                <GrDrag opacity={0.3} />
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
        // return <></>
        // return (
        //   <input
        //     value={cellValue}
        //     className="bg-transparent text-base text-appForeground font-sans"
        //     onChange={(e: any) => onChange(column.key, e.target.value, e)}
        //   />
        // );
        return (
          <SingleLineEditor
            path={`${row.id}_${column.id}`}
            language={
              options?.languages?.[column.key] || EEditorLanguage.FcText
            }
            className="without-border px-2"
            style={{
              position: 'absolute',
              width: '100%',
              top: '2px',
              overflow: 'hidden',
              padding: '0px 4px',
            }}
            type="text"
            value={cellValue}
            height={21}
            onChange={(e) => {
              onChange(column.key, e.target.value, e);
            }}
            // loading={<>{cellValue}</>}
            // loading={
            //   <input
            //     value={cellValue}
            //     className="bg-transparent text-base text-appForeground font-sans"
            //     readOnly
            //   />
            // }
            disabled={options.disabledColumns.includes(column.key)}
          />
        );
        break;
      // case 'description':
      //   return (
      //     <input
      //       value={cellValue}
      //       className="bg-transparent text-base text-appForeground font-sans"
      //       onChange={(e: any) => onChange(column.key, e.target.value, e)}
      //     />
      //   );
      //   break;
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
    <>
      <Table
        rows={rows}
        columns={columns ?? _columns}
        renderColumn={(c) => c.name}
        defaultRow={{
          key: '',
          value: '',
          disable: false,
          type: 'text',
          description: '',
        }}
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

      {!options?.hideRowAdd && (
        <div className="">
          <Button
            onClick={() => apiRef.current.addRow()}
            text="Add Row"
            className="small transparent font-light without-border with-padding with-icon-left"
            icon={<VscAdd size={16} />}
            disabled={
              options.hasOwnProperty('allowRowAdd') && !options.allowRowAdd
            }
            transparent
            primary
            ghost
            sm
          />
        </div>
      )}
    </>
  );
};

export default BasicTable;
