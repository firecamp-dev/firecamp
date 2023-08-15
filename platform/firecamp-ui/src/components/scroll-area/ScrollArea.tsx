import { FC } from 'react';
import {
  ScrollArea as MantineScrollArea,
  ScrollAreaProps,
  createStyles,
} from '@mantine/core';

export interface IScrollArea extends ScrollAreaProps {}

const useStyles = createStyles((theme) => ({
  root: {
    height: '100%',
    whiteSpace: 'nowrap',
  },
  // TODO: update styles `&[data-radix-scroll-area-viewport]` when issue is resolved
  // @ref: https://github.com/radix-ui/primitives/issues/926#issuecomment-1266790070
  viewport: {
    '&[data-radix-scroll-area-viewport]': {
      '& > :first-of-type': {
        display: 'block !important',
      },
    },
  },
  scrollbar: {
    '&, &:hover': {
      backgroundColor: 'transparent',
    },

    '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
      backgroundColor:
        theme.colorScheme === 'light'
          ? theme.fn.rgba(theme.colors.dark[3], 0.18)
          : theme.fn.rgba(theme.colors.gray[6], 0.18),
    },

    '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
      backgroundColor:
        theme.colorScheme === 'light'
          ? theme.fn.rgba(theme.colors.dark[3], 0.18)
          : theme.fn.rgba(theme.colors.gray[6], 0.18),
    },
  },
}));

const ScrollArea: FC<IScrollArea> = ({
  classNames = {},
  children,
  ...props
}) => {
  const { classes, cx } = useStyles();
  return (
    <MantineScrollArea
      type="hover"
      scrollbarSize={8}
      {...props}
      classNames={{
        ...classNames,
        scrollbar: cx(classes.scrollbar, classNames.scrollbar),
        root: cx(classes.root, classNames.root),
        viewport: cx(classes.viewport, classNames.viewport),
      }}
    >
      {children}
    </MantineScrollArea>
  );
};
export default ScrollArea;
