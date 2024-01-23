import { FC } from 'react';
import cx from 'classnames';
import {
  ScrollArea as MantineScrollArea,
  ScrollAreaProps,
} from '@mantine/core';

export interface IScrollArea extends ScrollAreaProps {}

enum EDefaultStyles {
  scrollbar = 'bg-transparent hover:bg-transparent ',
  thumb = '!bg-focus4',
  root = 'h-full whitespace-nowrap',
  // TODO: update styles of viewport when issue is resolved
  // @ref: https://github.com/radix-ui/primitives/issues/926#issuecomment-1447283516
  viewport = '[&>div]:!block',
}

const ScrollArea: FC<IScrollArea> = ({
  classNames = {},
  children,
  ...props
}) => {
  return (
    <MantineScrollArea
      type="hover"
      scrollbarSize={8}
      {...props}
      classNames={{
        ...classNames,
        scrollbar: cx(EDefaultStyles.scrollbar, classNames.scrollbar),
        thumb: cx(EDefaultStyles.thumb, classNames.thumb),
        root: cx(EDefaultStyles.root, classNames.root),
        viewport: cx(EDefaultStyles.viewport, classNames.viewport),
      }}
    >
      {children}
    </MantineScrollArea>
  );
};
export default ScrollArea;
