import { FC } from 'react';
import cx from 'classnames';
import { Flex, FlexProps } from '@mantine/core';

export interface IFlexLayout extends FlexProps {
  /**
   * to use the flex layout filling all available space
   */
  flex?: boolean;
}
const FlexLayout: FC<IFlexLayout> = ({
  flex = false,
  children = <></>,
  className = '',
  ...props
}) => {
  return (
    <Flex
      direction={'row'}
      className={cx({ 'flex-1': flex }, className)}
      {...props}
    >
      {children}
    </Flex>
  );
};
export default FlexLayout;
