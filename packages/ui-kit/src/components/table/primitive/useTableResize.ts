import { MutableRefObject, useEffect } from 'react';

const useTableResize = (tableRef: MutableRefObject<HTMLTableElement>) => {
  useEffect(() => {
    const createResizableTable = (table: HTMLElement) => {
      const cols = table.querySelectorAll('th');
      [].forEach.call(cols, (col: HTMLElement) => {
        // Add a resizer element to the column
        const resizer = document.createElement('div');
        resizer.classList.add('pt-resizer');
        resizer.dataset.testid = 'col-resizer';

        // Set the height
        resizer.style.height = `${table.offsetHeight}px`;

        //add resizer element to the cols whose width are not fixed
        if (col.dataset.allow_resize === 'true') {
          col.appendChild(resizer);
          createResizableColumn(col, resizer);
        }
      });
    };

    const createResizableColumn = (col: HTMLElement, resizer: HTMLElement) => {
      let x = 0;
      let w = 0;

      const mouseDownHandler = (e: MouseEvent) => {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        resizer.classList.add('pt-resizing');
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        const dx = e.clientX - x;
        //prevent resize when new width is less than the provided col width
        if (w + dx >= parseInt(col.dataset.initial_width))
          col.style.minWidth = `${w + dx}px`;
      };

      const mouseUpHandler = () => {
        resizer.classList.remove('pt-resizing');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      resizer.addEventListener('mousedown', mouseDownHandler);
    };

    setTimeout(() => {
      if (tableRef.current) createResizableTable(tableRef.current);
    }, 500);
  }, []);
};

export default useTableResize;
