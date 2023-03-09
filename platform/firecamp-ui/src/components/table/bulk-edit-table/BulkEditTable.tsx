import { FC, useState, useEffect } from 'react';
import isEqual from 'react-fast-compare';
import { TabHeader, Button, BasicTable, Editor } from '@firecamp/ui';
import { _table } from '@firecamp/utils';
import { EEditorLanguage } from '@firecamp/types';
// import { default as TabHeader } from '../tab-header/TabHeader';
// import { default as Button } from '../buttons/Button';
// import { default as BasicTable } from './BasicTable';
// import { default as Editor } from '../editors/monaco-v2/Editor';

import { IBulkEditTable } from './BulkEditTable.interfaces';

const modes = {
  Table: 'table',
  Raw: 'raw',
};

/** type table payload like in Editor view by separating key value with ':' and new row in new line */
const BulkEditTable: FC<IBulkEditTable> = ({
  rows,
  disabled = false, //unused prop
  title = '',
  onChange = () => {},
  options,
  onMount,
}) => {
  const [mode, setMode] = useState(modes.Table);
  const [raw, setRaw] = useState('');

  useEffect(() => {
    try {
      if (mode === modes.Raw) {
        const tableToString = _table.toText([...rows]);
        // console.log({raw, tableToString});

        if (!isEqual(raw, tableToString)) {
          setRaw(tableToString);
        }
      }
    } catch (e) {
      console.log(`e`, e);
    }
  }, [rows, mode]);

  const _setRaw = (editorString: string) => {
    setRaw(editorString);

    try {
      if (editorString.length) {
        const tableArray = [..._table.textToTable(editorString)];
        _onChangeRows(tableArray);
      } else {
        _onChangeRows([]);
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  const _onChangeRows = (newRows: any[] = []) => {
    if (!isEqual(newRows, rows)) {
      // console.log({ newRows, rows });

      onChange(newRows);
    }
  };

  return (
    <div>
      <TabHeader className="-mb-2">
        {title && (
          <TabHeader.Left>
            <span className="">{title}</span>
          </TabHeader.Left>
        )}

        <TabHeader.Right>
          <Button
            text={mode === modes.Table ? 'Bulk Edit' : 'Key-Value Edit'}
            // color="secondary"
            className="mt-1"
            secondary
            sm
            onClick={() => {
              setMode(mode === modes.Table ? modes.Raw : modes.Table);
            }}
          />
        </TabHeader.Right>
      </TabHeader>
      {mode === modes.Table ? (
        <BasicTable
          title={title}
          rows={rows}
          options={options}
          onChange={_onChangeRows}
          // disabled={disabled}
          onMount={onMount}
        />
      ) : (
        <div className="h-28 pt-3">
          <Editor
            value={raw}
            language={EEditorLanguage.Text}
            onChange={({ target: { value } }) => _setRaw(value)}
            placeholder={`
            key:value    (a new entry should be added to the line with the key, value separated by a ':')
            `}
            monacoOptions={{
              style: { display: 'table-caption' },
              height: '100px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BulkEditTable;
