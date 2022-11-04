import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { useRef } from 'react';
import Button from '../buttons/Button';
import Checkbox from '../checkbox/Checkbox';
import SingleLineEditor from '../editors/monaco-v2/SingleLineEditor';
import Table, { TTableApi } from './primitive/Table';

const BasicTable = ({ apiRef, initialRows, onChange = (rs) => {} }) => {
  const tableApi = useRef<TTableApi>();

  const _columns = [
    { id: 'select', key: 'disable', name: '', width: '40px' },
    { id: 'key', key: 'key', name: 'Key', width: '100px' },
    { id: 'value', key: 'value', name: 'Value', width: '100px' },
    {
      id: 'description',
      key: 'description',
      name: 'Description',
      width: '150px',
    },
    { id: 'remove', key: '', name: '', width: 20 },
  ];

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'select':
        return (
          <div style={{ display: 'flex' }}>
            <span
              draggable={true}
              onDragStart={(e) => {
                // console.log(e, trRef);
                // const td = trRef.current.firstChild;
                // console.log(td, td.contains(e.target))
                // if(!td.contains(e.target)) e.preventDefault();
                // else handleDrag(row.index);
                // handleDrag(row.index);
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
            />
          </div>
        );
        break;
      case 'key':
      case 'value':
        // return (
        //   <input
        //     value={cellValue}
        //     className="bg-transparent text-base text-appForeground font-sans"
        //     onChange={(e: any) => onChange(column.key, e.target.value, e)}
        //   />
        // );
        return (
          <SingleLineEditor
            // path={`${rowIndex}_${column.id}`}
            language={'ife-header-key'}
            className="without-border"
            style={{
              position: 'absolute',
              height: '21px',
              width: '100%',
              left: '0px',
              bottom: '0px',
              overflow: 'hidden',
            }}
            type="text"
            value={cellValue}
            height={25}
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
      case 'description':
        return (
          <input
            value={cellValue}
            className="bg-transparent text-base text-appForeground font-sans"
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
          />
        );
        break;
      case 'remove':
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
        initialRows={initialRows}
        apiRef={apiRef}
        columns={_columns}
        renderColumn={(c) => c.name}
        defaultRow={{
          key: '',
          value: '',
          description: '',
        }}
        renderCell={renderCell}
        onChange={(rows) => {
          // console.log(rows)
          onChange(rows);
        }}
        onLoad={(tApi) => {}}
      />
      <div className="">
        <Button
          onClick={() => apiRef.current.addRow()}
          text="Add Row"
          className="small transparent font-light without-border with-padding with-icon-left"
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

export default BasicTable;
