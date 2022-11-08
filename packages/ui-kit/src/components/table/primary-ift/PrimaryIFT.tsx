import { FC } from 'react';
import {
  IFT,
  SingleLineEditor,
  Checkbox,
} from '@firecamp/ui-kit';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';

import { IPrimaryIFT } from '../interfaces/PrimaryIFT.interfaces';

import Table from '../table/Table';

const PrimaryIFT: FC<IPrimaryIFT> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => {},
  meta = { mode: {} },
  custom = false,
  columnDetails,
}) => {
  return (
    <IFT
      onChange={(v) => {
        // console.log(v, 999777888)
        onChange(v);
      }}
      rows={rows}
      title={title || ''}
      disabled={disabled}
      cellRenderer={(
        { key, value, type, disable, onChange = () => {} },
        { connectDropTarget, connectDragSource }
      ) => {
        // console.log(`type`, type, value, key);
        if (type == 'text') {
          // return value;
          // return (
          //   <input
          //     value={value}
          //     onChange={e => onChange(e.target.value)}
          //     className="without-border"
          //   />
          // );
          console.log(key, 'key....');
          return (
            <SingleLineEditor
              path={key}
              value={value}
              type="text"
              disabled={disabled || disable}
              language={meta?.mode?.[key] || 'ife-text'}
              onChange={(e) => onChange(e.target.value)}
              className="without-border"
            />
          );
        } else if (type == 'boolean') {
          //If cell's disable value is undefined then value will be false.
          if (value === undefined) {
            value = false;
          }
          // console.log(key, `!value`, !value)
          return (
            <div
              className="-cell-option-wrapper"
              ref={(ref) => {
                connectDropTarget(ref);
              }}
            >
              <div
                className="-cell-drag"
                ref={(ref) => {
                  // console.log(`let drag`, ref);
                  connectDragSource(ref);
                }}
              >
                <GrDrag />
              </div>
              <Checkbox
                isChecked={!value} // disabled: false means checked
                showLabel={false}
                label=""
                onToggleCheck={() => {
                  if (!disabled) {
                    onChange(!value);
                  }
                }}
                disabled={disabled || disable}
              />
            </div>
          );
        }
      }}
      meta={meta}
    />
  );
};

export default PrimaryIFT;
