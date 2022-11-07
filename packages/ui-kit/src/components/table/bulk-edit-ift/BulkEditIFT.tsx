import { FC, useState, useEffect, useRef } from 'react';
import { TabHeader, Button, BasicTableV3, Editor } from '@firecamp/ui-kit';
import { _table } from '@firecamp/utils';
import equal from 'deep-equal';

import { IBulkEditIFT } from '../interfaces/BulkEditIFT.interfaces';

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
  onMount,
}) => {
  let [mode, setMode] = useState(modes.TABLE);
  let [raw, setRaw] = useState('');

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
        <BasicTableV3
          onChange={_onChangeRows}
          initialRows={rows}
          name={title}
          meta={meta}
          disabled={disabled}
          onMount={onMount}
        />
      ) : (
        <div className="h-28 pt-3">
          <Editor
            value={raw}
            language="text"
            monacoOptions={{
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
    </div>
  );
};

export default BulkEditIFT;
