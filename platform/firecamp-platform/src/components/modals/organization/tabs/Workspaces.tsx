import { FC, useEffect, useRef } from 'react';
import {
  Container,
  PrimitiveTable,
  ProgressBar,
  TTableApi,
} from '@firecamp/ui';
import { _array } from '@firecamp/utils';
import { getFormalDate } from '../OrgManagement';

const columns = [
  { id: 'index', name: 'No.', key: 'index', width: '35px', fixedWidth: true },
  {
    id: 'name',
    name: 'Name',
    key: 'name',
    width: '100px',
    resizeWithContainer: true,
  },
  {
    id: 'created',
    name: 'Created Date',
    key: 'created',
    width: '130px',
    fixedWidth: true,
  },
  {
    id: 'members',
    name: 'Members',
    key: 'members',
    width: '100px',
    fixedWidth: true,
  },
];

const Workspaces: FC<{workspaces: Array<any>, isFetching: boolean}> = ({ workspaces = [], isFetching = false }) => {
  const tableApi = useRef<TTableApi>(null);

  useEffect(() => {
    if (!_array.isEmpty(workspaces)) {
      const workspaceList = workspaces.map((m, i) => {
        return {
          id: m.__ref?.id,
          name: m.name,
          created: getFormalDate(m.__ref.createdAt),
          members: m.members.length,
        };
      });
      tableApi.current.initialize(workspaceList);
    }
  }, [workspaces]);

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'index':
        return <div className="px-2"> {rowIndex + 1} </div>;
        break;
      case 'name':
      case 'members':
      case 'created':
        return <div className="p-1 text-base">{cellValue}</div>;
        break;
      default:
        return <></>;
    }
  };

  return (
    <Container className="gap-2 pt-2 !h-[80vh]">
      <Container.Body>
        <ProgressBar active={isFetching} className={'top-auto'} />
        <PrimitiveTable
          classes={{
            container: 'h-full',
          }}
          columns={columns}
          rows={[]}
          showDefaultEmptyRows={false}
          renderColumn={(c) => c.name}
          renderCell={renderCell}
          onChange={console.log}
          onMount={(api) => (tableApi.current = api)}
        />
      </Container.Body>
    </Container>
  );
};
export default Workspaces;
