import {fireEvent} from "@testing-library/react";

/* Drag & drop event */
const dragAndDrop = async (elemDrag: HTMLElement, elemDrop: HTMLElement) => {
      // calculate positions
      let pos = elemDrag.getBoundingClientRect();
      const center1X = Math.floor((pos.left + pos.right) / 2);
      const center1Y = Math.floor((pos.top + pos.bottom) / 2);

      pos = elemDrop.getBoundingClientRect();
      const center2X = Math.floor((pos.left + pos.right) / 2);
      const center2Y = Math.floor((pos.top + pos.bottom) / 2);

      // mouse over dragged element and mousedown
      await fireEvent.mouseMove(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseEnter(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseOver(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseDown(elemDrag, {clientX: center1X, clientY: center1Y});
      
      // start dragging process over to drop target
      const dragStarted =  await fireEvent.dragStart(elemDrag, {clientX: center1X, clientY: center1Y});
      if (!dragStarted) {
          return;
      }

      await fireEvent.drag(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.mouseMove(elemDrag, {clientX: center1X, clientY: center1Y});
      await fireEvent.drag(elemDrag, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseMove(elemDrop, {clientX: center2X, clientY: center2Y});

      // trigger dragging process on top of drop target
      await fireEvent.mouseEnter(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragEnter(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseOver(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragOver(elemDrop, {clientX: center2X, clientY: center2Y});
      
      // release dragged element on top of drop target
      await fireEvent.drop(elemDrop, {clientX: center2X, clientY: center2Y});
      await fireEvent.dragEnd(elemDrag, {clientX: center2X, clientY: center2Y});
      await fireEvent.mouseUp(elemDrag, {clientX: center2X, clientY: center2Y});
  
};

/* Drop & Move event */
const dropAndMove = async (resizerElement: HTMLElement, moveOffset: Array<{clientX: number, clientY: number}>) => {

    await fireEvent.mouseDown(resizerElement, moveOffset[0]);
    await fireEvent.mouseMove(resizerElement, moveOffset[1]);
    await fireEvent.mouseUp(resizerElement, moveOffset[1])

}

/* Mouse hover/drop event */
const mouseDrop = async (element:HTMLElement) => {
    await fireEvent.mouseDown(element);
}

/* Mouse up event */
const mouseUp = async (element:HTMLElement) => {
    await fireEvent.mouseUp(element);
}

/* Click Event */
const click = (element: HTMLElement) => fireEvent.click(element);

/* Input Type Event */
const change = (element: HTMLElement, value: string) => fireEvent.change(element, {target: {value}});

export { dragAndDrop, dropAndMove, mouseDrop, mouseUp, click, change };