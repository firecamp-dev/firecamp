//@ts-nocheck
import { FC } from "react";
import {
  IFT,
  SingleLineIFE,
  Checkbox
} from '@firecamp/ui-kit';

import { IPrimaryIFT } from "../interfaces/PrimaryIFT.interfaces"

import Table from '../table/Table';
import { TableInput} from '../table/TableData';


const PrimaryIFT: FC<IPrimaryIFT> = ({
  rows,
  disabled = false,
  title = '',
  onChange = () => { },
  meta = { mode: {} },
  custom = false,
  columnDetails
}) => {

  if(custom)
  return (
    <div>

      <div className="smart-table-header-wrapper">
        {title ? <div className="smart-table-header">{title}</div> : ''}
      </div>


      <Table name='test-table-1'
        tableWidth={500}
        tableResizable={true}
        data={rows}
        options={{
          containerClassName: "max-w-[calc(100%-24px)] m-auto overflow-x-auto custom-scrollbar ",
          minColumnSize: 100,
        }}
        columns={columnDetails}
        columnRenderer={(row) => <>{row}</>}
        cellRenderer={( cell ) => <TableInput cell={cell}
          rows={rows}
          onChange={onChange}
        />}
      />
        
    </div>
  )

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
        { key, value, type, disable, onChange = () => { } },
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
          return (
            <SingleLineIFE
              value={value}
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
