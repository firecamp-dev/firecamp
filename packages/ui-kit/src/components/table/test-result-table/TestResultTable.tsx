import { useRef, memo } from 'react';
import isEqual from 'react-fast-compare';
import { _array } from '@firecamp/utils';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import Button from '../../buttons/Button';
import Table from '../primitive/Table';
import {
  ITableRows,
  TRenderCell,
  TTableApi,
} from '../primitive/table.interfaces';
import { ITestResultTable } from './TestResultTable.interfaces';

const _columns = [
  {
    id: 'status',
    key: 'status',
    name: 'Status',
    width: '100px',
  },
  {
    id: 'name',
    key: 'name',
    name: 'Test Name',
    width: '200px',
    resizeWithContainer: true,
  },
];

const TestResultTable = ({
  rows = [],
  options = { allowRowAdd: false, allowRowRemove: false },
  onChange = (rs: ITableRows) => {},
  onMount = (api: TTableApi) => {},
}: ITestResultTable<any>) => {
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
      case 'status':
        return (
          <div className="mx-2 text-base uppercase">
            {row.isPassed ? 'PASS' : 'FAIL'}
          </div>
        );
      case 'name':
        return <div className="mx-2 text-base">{cellValue}</div>;
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
          status: '',
          name: '',
        }}
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

export default memo(TestResultTable, (p, n) => !isEqual(p, n));
