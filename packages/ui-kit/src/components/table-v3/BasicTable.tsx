import { _array } from '@firecamp/utils';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { useRef } from 'react';
import Checkbox from '../checkbox/Checkbox';
import SingleLineEditor from '../editors/monaco-v2/SingleLineEditor';
import Table from './primitive/Table';

const BasicTable = ({ initialRows, onChange = () => {} }) => {
  const tableApi = useRef({});

  const _columns = [
    { id: 'select', name: '', key: 'select', width: '40px' },
    { id: 'key', name: 'Key', key: 'key', resizable: true },
    { name: 'Value', id: 'value', key: 'value', resizable: true },
    { name: 'Description', id: 'description', key: 'description' },
    { name: '', id: 'remove', key: '', width: 20 },
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

            <Checkbox isChecked={true} />
          </div>
        );
        break;
      case 'key':
      case 'value':
      case 'description':
        return (
          <SingleLineEditor
            // path={`${rowIndex}_${column.id}`}
            language={'ife-header-key'}
            type="text"
            value={cellValue}
            height={25}
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
    <Table
      initialRows={initialRows}
      apiRef={tableApi}
      columns={_columns}
      renderColumn={(c) => c.name}
      defaultRow={{
        key: '',
        value: '',
        description: '',
      }}
      renderCell={renderCell}
      onChange={onChange}
      onLoad={(tApi) => {}}
    />
  );
};

export default BasicTable;
