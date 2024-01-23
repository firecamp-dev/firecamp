import { FC } from 'react';
import cx from 'classnames';
import FlexLayout, { IFlexLayout } from './FlexLayout';

export interface IGridLayout extends IFlexLayout {}
const GridLayout: FC<IGridLayout> = ({
  children = <></>,
  className = '',
  ...props
}) => {

  // return <SimpleGrid className={cx(classes.root, className)} {...props}>{children}</SimpleGrid>;
  return (
    <FlexLayout direction={'column'} className={cx('m-0 px-0 w-full max-w-full', className)} {...props}>
      {children}
    </FlexLayout>
  );
};

export default GridLayout;
