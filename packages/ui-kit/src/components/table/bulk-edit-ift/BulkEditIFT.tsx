import { FC, useState, useEffect } from 'react';
import {
  Container,
  TabHeader,
  Button,
 
  
  PrimaryIFT,
  MultiLineIFE,
} from '@firecamp/ui-kit';
import equal from 'deep-equal';

import { IBulkEditIFT } from '../interfaces/BulkEditIFT.interfaces';
import { _table } from '@firecamp/utils';


import Table from '../table/Table';
import { defaultData , columnDataForDisplay, headerRow, headerColumnDataForDisplay, TableInput} from '../table/TableData';

const modes = {
  TABLE: 'table',
  RAW: 'raw',
};

/**
 * Bulk edit: user can add data in bulk by separating key value by ':' and new row in new line
 * @param {*} param0
 * @returns
 */
const BulkEditIFT: FC<IBulkEditIFT> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => {},
  meta = { mode: {} },
}) => {
  let [mode, setMode] = useState(modes.TABLE);
  let [raw, setRaw] = useState('');


  let [tableValue, setTableValue] = useState(defaultData);
  useEffect(() => {
    onChange([headerRow])
  },[])

  useEffect(() => {
    try {
      if (mode === modes.RAW) {
        let tableToString = _table.toText([...rows]);
        // console.log({raw, tableToString});

        if (!equal(raw, tableToString)) {
          setRaw(tableToString);
        }
      }
    } catch (e) {
      console.log(`e`, e);
    }
  }, [rows, mode]);

  let _setRaw = (editorString: string) => {
    setRaw(editorString);
    
    try {
      if (editorString.length) {
        let tableArray = [..._table.textToTable(editorString)];
        _onChangeRows(tableArray);
      } else {
        _onChangeRows([]);
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  let _onChangeRows = (newRows: any[] = []) => {
    if (!equal(newRows, rows)) {
      // console.log({ newRows, rows });

      onChange(newRows);
    }
  };

  let updateTableData = (newRows: any [] = []) => {
    if (!equal(newRows, tableValue)) {
      setTableValue(newRows);
    }
  }

  return (
    <div>
      <TabHeader className="-mb-2">
        {title && (
          <TabHeader.Left>
            <span className="smart-table-header-v2">{title}</span>
          </TabHeader.Left>
        )}

        <TabHeader.Right>
          <Button
            text={mode === modes.TABLE ? 'Bulk Edit' : 'Key-Value Edit'}
            // color="secondary"
            className="mt-1"
            secondary
            sm
            onClick={() => {
              setMode(mode === modes.TABLE ? modes.RAW : modes.TABLE);
            }}
          />
        </TabHeader.Right>
      </TabHeader>
      {mode === modes.TABLE ? (
        <PrimaryIFT
          onChange={_onChangeRows}
          rows={rows}
          name={title}
          meta={meta}
          disabled={disabled}
          custom={true}
          columnDetails={headerColumnDataForDisplay}
        />
      ) : (
        <div className="h-28">
          <MultiLineIFE
            value={raw}
            language="text"
            options={{
              style: { display: 'table-caption' },
              height: '100px',
            }}
            onChange={({ target: { value } }) => _setRaw(value)}
            placeholder={`
            key:value    (a new entry should be added to the line with the key, value separated by a ':')
            `}
          />
        </div>
      )}

      <Table name='test-table'
        tableWidth={500}
        tableResizable={true}
        data={tableValue}
        options={{
          containerClassName: "max-w-[calc(100%-24px)] m-auto overflow-x-auto custom-scrollbar ",
          minColumnSize: 100,
        }}
        columns={columnDataForDisplay}
        columnRenderer={(row) => <>{row}</>}
        cellRenderer={({cell}) => <TableInput cell={cell} 
        rows={tableValue}
        onChange={updateTableData}
        />}
      />



    </div>
  );
};

export default BulkEditIFT;
