import { useState, useEffect, Fragment } from 'react';
import equal from 'deep-equal';
import { MultiLineIFE } from '@firecamp/ui-kit';
import { _table } from '@firecamp/utils'

const SmartJSONEditor = ({ JSONState, detach = false, onChange }) => {
  let [JSONEditorString, setJSONEditorString] = useState(`{
      
}`);

  /**
   * onMount
   */
  useEffect(() => {
    // debugger;
    try {
      if (JSONState) {
        let jsonObject = Object.assign(
          {},
          _table.toObject([...JSONState]) || {}
        );
        let JSONObjectString = JSON.stringify(jsonObject, 2, 2);

        if (!equal(JSONEditorString, JSONObjectString)) {
          setJSONEditorString(JSONObjectString);
        }
      }
    } catch (e) {
      console.log(`e`, e);
    }
  }, []);

  useEffect(() => {
    // console.log(`detach`, detach);

    try {
      // debugger;
      if (detach) {
        let jsonObject = Object.assign(
          {},
          _table.toObject([...JSONState]) || {}
        );
        let JSONObjectString = JSON.stringify(jsonObject, 2, 2);

        if (!equal(jsonObject, JSON.parse(JSONEditorString))) {
          setJSONEditorString(JSONObjectString);
        }
      }
    } catch (e) {
      console.log(`e`, e);
    }
  }, [JSONState]);

  let _setJSONEditorString = (editorString) => {
    setJSONEditorString(editorString);
    try {
      if (editorString.length) {
        let jsonObject = JSON.parse(editorString);
        let jsonTable = [
          ..._table.objectToTable(Object.assign({}, jsonObject), [...JSONState]),
        ];

        onChange(jsonTable);
      } else {
        onChange([]);
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  // console.log(`detach`, detach)

  return (
    <MultiLineIFE
      value={JSONEditorString}
      language="json"
      options={{
        style: { display: 'table-caption' },
        height: '100px',
      }}
      onChange={({ target: { value } }) => _setJSONEditorString(value)}
    />
  );
};

export default SmartJSONEditor;
