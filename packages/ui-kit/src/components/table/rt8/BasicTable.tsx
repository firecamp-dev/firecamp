// @ts-nocheck
import { FC, useState } from 'react';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { EEditorLanguage } from '@firecamp/types';

import SingleLineEditor from '../../editors/monaco-v2/SingleLineEditor';
import Table from './Table';
import { defaultData } from './TableData';

const BasicTable: FC<any> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => {},

  name,
  resizable,
  width,
  columns = columnsForDisplay,
  data: _data = defaultData,
  options,
  columnRenderer,
}) => {
  const [data, setData] = useState(_data);

  // useEffect(()=> {
  //   setTimeout(()=> {
  //     setData((s)=> [...s, { key: "auth", "value": "Token"}])
  //   }, 5000)
  // }, [])

  // const updateTableData = (newRows: any[] = []) => {
  //   if (!equal(newRows, data)) {
  //     setData(newRows);
  //   }
  // };

  return (
    <>
      <div className="-header-wrapper">
        {title ? <div className="-header">{title}</div> : ''}
      </div>

      <Table
        name={name}
        width={width}
        resizable={resizable}
        data={data}
        options={options}
        columns={columns}
        columnRenderer={columnRenderer}
        cellRenderer={(cell) => {
          // console.log(cell, 7777);
          const value = cell.getValue();

          switch (cell.column.id) {
            case 'description':
              return (
                <input
                  placeholder={`input text`}
                  value={value}
                  onChange={console.log}
                  className="bg-transparent w-full text-base text-appForeground font-sans"
                  readOnly
                />
              );
              break;
            case 'remove':
              return <VscTrash />;
            default:
              return (
                <SingleLineEditor
                  // key={cell.id}
                  // path={cell.id}
                  value={value}
                  disabled={false}
                  type="text"
                  language={EEditorLanguage.HeaderKey}
                  onChange={(e) => {
                    console.log(e);
                  }}
                  height={21}
                  loading={
                    <input
                      placeholder={`input text`}
                      value={value}
                      className="bg-transparent w-full text-base text-appForeground font-sans"
                      readOnly
                    />
                  }
                />
              );
          }
          // return (
          //   <div style={{ display: 'inline-flex' }}>
          //     <VscRemove size={20} />
          //   </div>
          // );
        }}
      />
    </>
  );
};

export default BasicTable;

// for keeping column as static - provide minSize & width without resizing param
const columnsForDisplay = [
  {
    name: 'action',
    displayName: '',
    minWidth: 40,
    width: 40,
  },
  {
    name: 'key',
    displayName: 'Key',
    minWidth: 145,
    resizable: true,
  },
  {
    name: 'value',
    displayName: 'Value',
    minWidth: 145,
    resizable: true,
  },
  {
    name: 'description',
    displayName: 'Description',
    resizable: true,
  },
  {
    name: 'remove',
    displayName: '',
    minWidth: 20,
    width: 20,
  },
];
