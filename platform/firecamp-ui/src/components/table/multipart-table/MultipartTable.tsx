import React, { FC, memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { File, GripVertical, Plus, Trash2 } from 'lucide-react';
import { _array } from '@firecamp/utils';
import { VscTextSize } from '@react-icons/all-files/vsc/VscTextSize';
import { EEditorLanguage } from '@firecamp/types';
import { Button, Checkbox, FileInput, Input } from '@firecamp/ui';

import SingleLineEditor from '../../editors/monaco-v2/SingleLineEditor';
import Table from '../primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';

import {
  IMultipartTable,
  IMultiPartInput,
  ERowType,
} from './MultipartTable.interfaces';

const MultipartTable = ({
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IMultipartTable<any>) => {
  const apiRef = useRef<TTableApi>();

  const _columns = [
    { id: 'select', key: 'disable', name: '', width: '40px', fixedWidth: true },
    { id: 'key', key: 'key', name: 'Key', width: '100px' },
    { id: 'value', key: 'value', name: 'Value', width: '100px' },
    {
      id: 'description',
      key: 'description',
      name: 'Description',
      width: '150px',
      resizeWithContainer: true,
    },
    { id: 'remove', key: '', name: '', width: '20px' },
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
    switch (column.id) {
      case 'select':
        return (
          <div style={{ display: 'flex' }}>
            <span
              className="flex drag-icon"
              draggable={true}
              onDragStart={(e) => {
                handleDrag(row);
              }}
            >
              <GripVertical opacity={0.3} size={16} />
            </span>

            <Checkbox
              checked={!cellValue}
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
        if (column.id == 'value') {
          return (
            <MultiPartInput
              row={row}
              options={options}
              value={cellValue}
              onChange={(e: any) => {
                console.log(e, ' from multi part input');
                onChange(column.key, e.target.value);
              }}
              onChangeFile={(e: any) => {
                onChange('file', e.target.file);
              }}
              onChangeRowType={(type) => {
                onChange('type', type);
                console.log(type, 'type changed');
              }}
            />
          );
        }
        return (
          <SingleLineEditor
            // path={`${rowIndex}_${column.id}`}
            language={EEditorLanguage.HeaderKey}
            className="without-border px-1"
            // style={{
            //   position: 'absolute',
            //   width: '100%',
            //   top: '2px',
            //   overflow: 'hidden',
            //   padding: '0px 4px',
            // }}
            type="text"
            value={cellValue}
            height={18}
            disabled={options.disabledColumns.includes(column.key)}
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
            // loading={<>{cellValue}</>}
            // loading={
            //   <input
            //     value={cellValue}
            //     className="bg-transparent text-base text-app-foreground font-sans"
            //     readOnly
            //   />
            // }
          />
        );

        break;
      case 'description':
        return (
          <Input
            value={cellValue}
            classNames={{
              root: '!mb-0',
              input:
                '!bg-transparent !border-none focus:!border-none focus-visible:!border-none text-base text-tabForegroundInactive px-1 h-[21px] min-h-0',
            }}
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
          />
        );
        break;

      case 'remove':
        if (!options.allowRowRemove) return <></>;
        return (
          <div className="px-2 flex">
            <Trash2
              size={14}
              className="text-primaryColor cursor-pointer"
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
        columns={_columns}
        renderColumn={(c) => c.name}
        defaultRow={{
          key: '',
          value: '',
          description: '',
        }}
        renderCell={renderCell}
        options={options}
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
      />

      <div className="">
        <Button
          onClick={() => apiRef.current.addRow()}
          text="Add Row"
          leftIcon={<Plus size={16} />}
          primary
          transparent
          xs
        />
      </div>
    </>
  );
};

export default MultipartTable;

const MultiPartInput: FC<IMultiPartInput> = memo(
  ({
    row,
    value,
    onChange = (e = { target: { value: '' } }) => {},
    onChangeFile = (e = { target: { file: null } as any }) => {},
    onChangeRowType = () => {},
    options,
  }) => {
    const [type, setType] = useState(row.type || ERowType.Text);

    // useEffect(() => {
    //   console.log(row.type, 'row.type');
    //   const newType = row.type || ERowType.Text;
    //   if (newType !== type) {
    //     setType(newType);
    //   }
    // }, [value]);

    const _onChangeTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange({ target: { value } });
    };

    const _onChangeFileInput = (file: File) => {
      onChangeFile({ target: { file } }); // It'll always be a single file
    };

    const _changeType = () => {
      const newType = type == ERowType.Text ? ERowType.File : ERowType.Text;
      if (newType === ERowType.File && type === ERowType.Text) {
        onChangeFile({ target: { file: null } });
      }
      setType(newType);
      onChangeRowType(newType);
    };

    // console.log(`type`, type);
    console.log(row, 'row');

    return (
      <div className="flex items-center">
        {type == 'text' ? (
          <SingleLineEditor
            key={`${row.id}`}
            language={EEditorLanguage.HeaderKey}
            className="without-border px-1 w-full"
            // style={{
            //   position: 'absolute',
            //   width: 'calc(100% - 20px)',
            //   top: '2px',
            //   overflow: 'hidden',
            //   padding: '0px 4px',
            // }}
            type="text"
            height={18}
            // value={cellValue}
            value={typeof value === 'string' ? value : ''}
            disabled={options.disabledColumns.includes('value')}
            onChange={(e) => _onChangeTextInput(e)}
          />
        ) : (
          <FileInput
            placeholder={
              row?.file?.name ? `file: ${row?.file?.name}` : 'select file'
            }
            accept="text"
            onChange={(file) => _onChangeFileInput(file)}
          />
        )}
        <div className="cursor-pointer ml-auto pr-1 h-4">
          {type == 'text' ? (
            <VscTextSize onClick={_changeType} title="IconTextSize" />
          ) : (
            <File onClick={_changeType} size={16} data-testid="file-icon" />
          )}
        </div>
      </div>
    );
  },
  (p, n) => {
    return isEqual(p.row, n.row) && isEqual(p.value, n.value);
  }
);
