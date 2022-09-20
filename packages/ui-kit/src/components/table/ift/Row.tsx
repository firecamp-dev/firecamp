import { FC, memo } from "react";
import classnames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';

import { IRow } from '../interfaces/IFT.interfaces';
import { IRowCellMeta } from "../interfaces";

const Row: FC<IRow> = ({
  columns = [],
  row,
  cellRenderer,
  rowIndex = 0,
  isTableDisabled = false,
  onChange = (cell) => console.log(cell),
  removeRow = () => {},
  onSort = () => {},
  meta = {
    disabledColumns: [],
    allowRowRemove: true,
    allowRowAdd: true,
    allowSort: true,
  },
}) => {

  const [collectRowDrag, rowDrag, rowDragPreview] = useDrag({
    item: {
      index: rowIndex,
    },
    type: 'ROW',
    // isDragging: (monitor) => {
    //   console.log(`monitor`, monitor);
    //   return monitor.isDragging();
    // },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  const [collectRowDrop, rowDrop ] = useDrop({
    accept: ['ROW'],
    drop: (i: any, m) => {
      if (isTableDisabled) return;
      if (i.index !== rowIndex) {
        onSort(i.index, rowIndex);
      }
    },
    hover: (i, m) => {
      if (isTableDisabled) return;
      // console.log(`Hover`, i);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  let _onChange = (cell: IRowCellMeta) => {
    if (isTableDisabled) return;
    // console.log(cell, 77777);
    onChange(cell);
  };

  /**
   * On change row type
   */
  let _onTypeChange = (type: string = 'text') => {
    if (isTableDisabled) return;
    onChange({ key: 'type', value: type });
  };


  const opacity = collectRowDrag.isDragging || collectRowDrop.isOver ? 0.5 : 1;

  return (
    <div
      className="smart-table-row"
      style={{ opacity }}
      ref={(elm) => {
        if(meta?.allowSort && !isTableDisabled) {
          rowDrag(elm);
          rowDrop(elm);
        }
      }}
    >
      {columns.map((cl, i) => {
        let cell = {
          disable: meta?.disabledColumns?.includes(cl.key) || false,
          key: cl.key,
          value: row[cl.key],
          type: cl.key == 'value' ? row.type || cl.type : cl.type, //todo: This is a hack, only 'value' cell holds the row's ty
        };

        // console.log(cell, c, "celllllll");

        return (
          <div
            key={cl.key}
            style={{ width: cl.width }}
            className={classnames('smart-table-row-cell', {
              // "w-10": c.type == "boolean"
            })}
          >
            {
              cellRenderer({
                ...cell,
                row,
                onChange: (v: any) => {
                  if (meta?.disabledColumns?.includes(cell.key)) return;
                  _onChange({ ...cell, value: v });
                },
                onChangeRowType: (t: string) => _onTypeChange(t),
              },
              {
                connectDropTarget: rowDrop,
                connectDragSource: rowDragPreview,
              }
              )
            }
          </div>
        );
      })}
      {
        !isTableDisabled && meta.allowRowRemove
          ? (<div className="smart-table-row-remove" onClick={removeRow}>×</div>)
            : <></>
      }
    </div>
  );
};

export default memo(Row);
