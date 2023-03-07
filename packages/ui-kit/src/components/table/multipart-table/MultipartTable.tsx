import React, { FC, memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscTextSize } from '@react-icons/all-files/vsc/VscTextSize';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { EEditorLanguage } from '@firecamp/types';

import Button from '../../buttons/Button';
import Checkbox from '../../checkbox/Checkbox';
import SingleLineEditor from '../../editors/monaco-v2/SingleLineEditor';
import Table from '../primitive/Table';
import { ITableRows, TRenderCell, TTableApi } from '../primitive/table.interfaces';

import { IMultipartTable, IMultiPartInput, ERowType } from './MultipartTable.interfaces';

const MultipartTable = ({
  rows = [],
  options = {},
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: IMultipartTable<any> ) => {
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
              draggable={true}
              onDragStart={(e) => {
                handleDrag(row);
              }}
              className="flex"
            >
              <GrDrag opacity={0.3} />
            </span>

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
            disabled={options.disabledColumns.includes(column.key)}
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
            // loading={<>{cellValue}</>}
            // loading={
            //   <input
            //     value={cellValue}
            //     className="bg-transparent text-base text-appForeground font-sans"
            //     readOnly
            //   />
            // }
          />
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
          className="small transparent font-light without-border with-padding with-ic-left"
          icon={<VscAdd size={16} />}
          primary
          sm
          transparent
          ghost
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
    onChangeFile = (e = { target: { file: null } as any}) => {},
    onChangeRowType = () => {},
    options,
  }) => {
    const inputFileRef = useRef(null);
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

    const _onChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(e.target.files, 'e...');
      const file = e.target.files[0];
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

    const _onClick = () => {
      if (inputFileRef.current) inputFileRef.current.click();
    };

    // console.log(`type`, type);
    console.log(row, 'row');

    return (
      <div className="flex items-center">
        {type == 'text' ? (
          <SingleLineEditor
            key={`${row.id}`}
            language={EEditorLanguage.HeaderKey}
            className="without-border px-2"
            style={{
              position: 'absolute',
              width: 'calc(100% - 20px)',
              top: '2px',
              overflow: 'hidden',
              padding: '0px 4px',
            }}
            type="text"
            height={21}
            // value={cellValue}
            value={typeof value === 'string' ? value : ''}
            disabled={options.disabledColumns.includes('value')}
            onChange={(e) => _onChangeTextInput(e)}
          />
        ) : (
          <>
            <input
              key={`${row.id}-multipart-input`}
              name="select-file"
              ref={inputFileRef}
              id="file"
              accept="text"
              type="file"
              onChange={_onChangeFileInput}
              className="fc-file-input hidden"
            />

            <div
              key={`${row.id}-file-type`}
              className="cursor-pointer text-left text-base text-ellipsis overflow-hidden pl-1 pr-4 whitespace-pre w-full mr-1"
              onClick={_onClick}
            >
              {row?.file?.name ? `file: ${row?.file?.name}` : 'select file'}
            </div>
          </>
        )}
        <div className="cursor-pointer ml-auto pr-1 h-4">
          {type == 'text' ? (
            <VscTextSize onClick={_changeType} title='IconTextSize' />
          ) : (
            <VscFile onClick={_changeType} title='IconFile' />
          )}
        </div>
      </div>
    );
  },
  (p, n) => {
    return isEqual(p.row, n.row) && isEqual(p.value, n.value);
  }
);
