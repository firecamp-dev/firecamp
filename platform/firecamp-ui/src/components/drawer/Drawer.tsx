import { FC } from 'react';
import cx from 'classnames';
import {
  Drawer as MantineDrawer,
  DrawerProps,
  ScrollArea,
} from '@mantine/core';

export interface IDrawer extends DrawerProps {}

const Drawer: FC<IDrawer> = ({
  id = '',
  opened = false,
  classNames = {},
  onClose = () => {},
  children = <></>,
  ...props
}) => {
  return (
    <MantineDrawer
      id={id}
      opened={opened}
      onClose={() => onClose()}
      classNames={{
        ...classNames,
        content: cx(
          'invisible-scrollbar',
          'max-w-3xl min-h-[400px] rounded-none	bg-modal-background text-app-foreground',
          classNames.content
        ),
        header: cx(
          'bg-transparent pr-4 pt-4 text-app-foreground',
          {
            'pb-4 border-b border-tab-border bg-modal-background':
              !!props.title,
          },
          { 'pb-0': !props.title },
          classNames.header
        ),
        body: cx('px-8 pb-8 relative', classNames.body),
        close: cx('bg-modal-background'),
      }}
      scrollAreaComponent={ScrollArea.Autosize}
      transitionProps={{ duration: 150, timingFunction: 'linear' }}
      overlayProps={{ opacity: 0.5, blur: 4 }}
      {...props}
    >
      {children}
    </MantineDrawer>
  );
};

export default Drawer;
