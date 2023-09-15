import { FC } from 'react';
import cx from 'classnames';
import { Flex, FlexProps } from '@mantine/core';

export interface IFlexLayout extends FlexProps {
  /**
   * to use the flex layout filling all available space
   */
  flex?: boolean;
  /**
   * When the child content overflows, this will add the necessary scrollbar and prevent the row from getting larger
   */
  overflow?: boolean;
}
const FlexLayout: FC<IFlexLayout> = ({
  flex = false,
  overflow = false,
  children = <></>,
  className = '',
  ...props
}) => {
  return (
    <Flex
      direction={'row'}
      className={cx({ 'flex-1': flex }, {'overflow-auto': overflow}, className)}
      {...props}
    >
      {children}
    </Flex>
  );
};
export default FlexLayout;
