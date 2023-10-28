import { FC } from 'react';
import { createStyles } from '@mantine/core';
import FlexLayout, { IFlexLayout } from './FlexLayout';

const useStyles = createStyles(() => ({
  root: {
    margin: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    width: '100%',
    maxWidth: '100%',
  },
}));
export interface IGridLayout extends IFlexLayout {}
const GridLayout: FC<IGridLayout> = ({
  children = <></>,
  className = '',
  ...props
}) => {
  const { cx, classes } = useStyles();
  // return <SimpleGrid className={cx(classes.root, className)} {...props}>{children}</SimpleGrid>;
  return (
    <FlexLayout direction={'column'} className={cx(classes.root, className)} {...props}>
      {children}
    </FlexLayout>
  );
};

export default GridLayout;
