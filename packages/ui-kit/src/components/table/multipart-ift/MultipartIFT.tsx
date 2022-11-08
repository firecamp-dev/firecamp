//@ts-nocheck
import { FC, useEffect, useState, useRef } from 'react';
import { IFT, SingleLineEditor, Checkbox } from '@firecamp/ui-kit';

import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { TiSortAlphabetically } from '@react-icons/all-files/ti/TiSortAlphabetically';

import {
  IMultiPartInput,
  IMultipartIFT,
} from '../interfaces/MultipartIFT.interfaces';

const MultipartIFT: FC<IMultipartIFT> = ({
  rows,
  multipartKey = 'value',
  onChange = () => {},
}) => {
  return (
    <IFT
      rows={rows}
      onChange={(rows) => onChange(rows)}
      cellRenderer={(
        {
          key,
          value,
          type,
          disable,
          onChange = () => {},
          onChangeRowType = () => {},
          row = {},
        },
        { connectDropTarget, connectDragSource }
      ) => {
        // console.log(`type`, type, { row });

        if (key == multipartKey) {
          return (
            <MultiPartInput
              row={row}
              value={value}
              onChange={(v) => onChange(v)}
              onChangeRowType={(type) => onChangeRowType(type)}
            />
          );
        } else if (type == 'text') {
          return (
            <SingleLineEditor
              path={key}
              value={value}
              className="without-border px-2"
              onChange={(e) => onChange(e.target.value)}
              height="21px"
            />
          );
        } else if (type == 'boolean') {
          //If cell's disable value is undefined then value will be false.
          if (value === undefined) {
            value = false;
          }
          return (
            <div
              className="smart-table-cell-option-wrapper"
              ref={(ref) => {
                connectDropTarget(ref);
              }}
            >
              <div
                className="smart-table-cell-drag"
                ref={(ref) => {
                  // console.log(`let drag`, ref);
                  connectDragSource(ref);
                }}
              >
                <img src={'icon/png/drag.png'} />
              </div>
              <Checkbox
                isChecked={!value} // disabled: false means checked
                showLabel={false}
                label=""
                onToggleCheck={() => onChange(!value)}
              />
              {/*<div className="checkbox-group">*/}
              {/*<div className="checkbox-group-item">*/}
              {/*<div*/}
              {/*className={classnames(*/}
              {/*{ checked: !value },*/}
              {/*"checkbox-wrapper"*/}
              {/*)}*/}
              {/*onClick={e => onChange(value)}*/}
              {/*/>*/}
              {/*</div>*/}
              {/*</div>*/}
            </div>
          );
        }
      }}
    />
  );
};

export default MultipartIFT;

const MultiPartInput: FC<IMultiPartInput> = ({
  row = {},
  value,
  onChange = () => {},
  onChangeRowType = () => {},
}) => {
  // console.log(`row`, row);

  let [type, setType] = useState(row.type || 'text'); //file

  const inputEle = useRef(null);

  useEffect(() => {
    let newType = row.type || 'text';
    if (newType !== type) {
      setType(newType);
    }
  }, [value]);

  let _onChange = (e) => {
    let _type = e.target.type == 'file' ? 'file' : 'text';
    let value = _type == 'file' ? e.target.files[0] : e.target.value;
    onChange(value);
  };

  let _changeType = () => {
    let newType = type == 'text' ? 'file' : 'text';
    if (newType === 'file' && type === 'text') {
      onChange('');
    }
    onChangeRowType(newType);
    setType(newType);
  };

  const _onClick = () => {
    if (inputEle.current) inputEle.current.click();
  };

  // console.log(`type`, type);

  return (
    <div className="smart-table-cell-multipart w-full">
      {
      type == 'text' ? (
        <div className="!w-32">
        <SingleLineEditor
          className="without-border px-2"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => _onChange(e)}
          height="21px"
        />
        </div>
      ) : (
        [
          <input
            key={`ift-multipart-input`}
            name="select"
            // style={{ display: "none" }}
            ref={inputEle}
            id="file"
            accept="text"
            type="file"
            onChange={_onChange}
            className="fc-file-input"
          />,
          row && row.value && row.value.name ? (
            <div
              className="fc-input-file-name "
              key={`ift-multipart-file-name`}
              onClick={_onClick}
            >
              {row.value.name || ''}
            </div>
          ) : (
            ''
          ),
        ]
      )}
      {type == 'text' ? (
        <VscFile className="ml-auto mr-2" onClick={_changeType} />
      ) : (
        <TiSortAlphabetically onClick={_changeType} />
      )}
    </div>
  );
};
