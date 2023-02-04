import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { LogTable as LTable } from '@firecamp/ui-kit';

const LogTable = ({ onLoad, onFocusRow = (r) => {} }) => {
  return (
    <LTable
      classes={{
        table: 'text-sm !m-0 !border-0 !w-full',
        td: 'px-2 py-1 whitespace-nowrap first:border-t-0 truncate first:border-l-0 leading-5',
        th: 'first:border-l-0',
        thead: 'sticky top-0 !bg-appBackground2 z-10',
        container: 'h-full !overflow-y-auto -mt-px visible-scrollbar thick',
        theadTr: '!border-0 !bg-appBackground2',
        tr: 'hover:!bg-focus1 focus:!bg-primaryColorOpacity  !border-0',
      }}
      rows={[]}
      onChange={(rows) => {
        console.log(rows, 'log table change');
      }}
      onMount={(tApi) => {
        onLoad(tApi);
        console.log(tApi);
      }}
      onFocusRow={(r) => {
        console.log(r, 'r.....');
        onFocusRow(r);
      }}
    />
  );
};

export default memo(LogTable, (pp, np) => {
  const { onLoad: olP, onFocusRow: ofrP, ...restPP } = pp;
  const { onLoad: olN, onFocusRow: ofrN, ...restNP } = np;
  return isEqual(restPP, restNP);
});
