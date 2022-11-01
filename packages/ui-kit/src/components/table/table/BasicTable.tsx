import { FC } from 'react';
import { SingleLineEditor } from '@firecamp/ui-kit';

import Table from './Table';

const BasicTable: FC<any> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => {},
  meta = { mode: {} },
}) => {
  return (
    <>
      <div className="smart-table-header-wrapper">
        {title ? <div className="smart-table-header">{title}</div> : ''}
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
          console.log(cell, 7777);
          const value = cell.getValue();
          if (cell.column.id == 'action') return <span>A</span>;
          if (cell.column.id == 'description')
            return (
              <input
                placeholder={`input text`}
                value={value}
                onChange={console.log}
                className="bg-transparent w-full text-base text-appForeground font-sans"
                readOnly
              />
            );

          // if (cell.column.id == 'value')
          return (
            <SingleLineEditor
              path={cell.id}
              value={value}
              disabled={false}
              type="text"
              language={'ife-text'}
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
        }}
      />
    </>
  );
};

export default BasicTable;
