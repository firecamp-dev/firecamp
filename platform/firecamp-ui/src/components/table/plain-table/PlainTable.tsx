import { _array } from '@firecamp/utils';

import Table from '../primitive/Table';
import { TRenderCell } from '../primitive/table.interfaces';
import { IPlainTable } from './PlainTable.interfaces';

const _columns = [
  { id: 'key', key: 'key', name: 'Key', width: '150px' },
  { id: 'value', key: 'value', name: 'Value', width: '150px' },
  {
    id: 'description',
    key: 'description',
    name: 'Description',
    width: '100px',
    resizeWithContainer: true,
  },
];

const PlainTable = ({
  title = '',
  columns,
  classes,
  rows = [],
  options = {},
}: IPlainTable<any>) => {
  const renderCell: TRenderCell<any> = (column, cellValue) => {
    switch (column.id) {
      case 'key':
      case 'value':
      case 'description':
        return (
          <div
            className={`bg-transparent text-base text-appForeground font-sans px-2 select-text ${classes?.td}`}
          >
            {cellValue}
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
      onChange={() => {}}
      onMount={() => {}}
      options={options}
    />
  );
};

export default PlainTable;
