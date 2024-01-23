import { FC } from 'react';
import cx from 'classnames';
import { Container, ContainerProps } from '@mantine/core';

export interface IContainerLayout extends ContainerProps {
  /**
   * to use the container wrapped in flex layout
   */
  flex?: boolean;
  /**
   * When the child content overflows, this will add the necessary scrollbar and prevent the row from getting larger
   */
  overflow?: boolean;
}
const ContainerLayout: FC<IContainerLayout> = ({
  flex = false,
  overflow = false,
  children = <></>,
  className = '',
  ...props
}) => {
  return (
    <Container
      className={cx(
        'invisible-scrollbar p-0',
        { 'flex-1': flex },
        { 'overflow-auto': overflow },
        className
      )}
      fluid
      {...props}
    >
      {children}
    </Container>
  );
};
export default ContainerLayout;
