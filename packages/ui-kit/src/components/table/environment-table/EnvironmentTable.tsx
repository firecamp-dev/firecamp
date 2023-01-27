import { useRef, memo } from 'react';
import isEqual from 'react-fast-compare';
import cx from 'classnames';
import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { EEditorLanguage } from '@firecamp/types';
import Button from '../../buttons/Button';
import SingleLineEditor from '../../editors/monaco-v2/SingleLineEditor';
import Table from '../primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { IEnvironmentTable } from './EnvironmentTable.interfaces';

const _columns = [
  { id: 'select', key: 'disable', name: '', width: '25px', fixedWidth: true },
  { id: 'variable', key: 'variable', name: 'Variable', width: '200px' },
  //   { id: 'type', key: 'type', name: 'Type', width: '200px' },
  {
    id: 'initialValue',
    key: 'initialValue',
    name: 'Initial Value',
    width: '200px',
  },
  {
    id: 'currentValue',
    key: 'currentValue',
    name: 'Current Value',
    width: '200px',
    resizeWithContainer: true,
  },
  { id: 'remove', key: '', name: '', width: '20px', fixedWidth: true },
];

const EnvironmentTable = ({
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IEnvironmentTable<any>) => {
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
                className="flex drag-icon m-auto"
                draggable={true}
                onDragStart={(e) => {
                  handleDrag(row);
                }}
                data-testid="row-sorter"
              >
                <GrDrag opacity={0.3} />
              </span>
            )}
          </div>
        );
      case 'variable':
      case 'type':
      case 'initialValue':
      case 'currentValue':
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
            language={EEditorLanguage.HeaderKey}
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
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
            disabled={options.disabledColumns.includes(column.key)}
          />
        );
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
      default:
        return column.key;
    }
  };

  return (
    <>
      <Table
        rows={rows}
        columns={_columns}
        renderColumn={(c) => c.name}
        defaultRow={{
          variable: 'variable name',
          type: 'variable type',
          initialValue: '',
          currentValue: '',
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

      <div className="">
        <Button
          text="Add Row"
          className="small transparent font-light without-border with-padding with-icon-left"
          onClick={() => apiRef.current.addRow()}
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
    </>
  );
};

export default memo(EnvironmentTable, (p, n) => !isEqual(p, n));
