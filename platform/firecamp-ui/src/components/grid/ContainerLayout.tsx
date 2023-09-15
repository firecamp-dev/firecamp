import { FC } from 'react';
import { Container, ContainerProps, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  root: {
    padding: '0px',
  },
}));
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
  const { classes, cx } = useStyles();
  return (
    <Container
      className={cx('invisible-scrollbar', { 'flex-1': flex }, {'overflow-auto': overflow}, classes.root, className)}
      fluid
      {...props}
    >
      {children}
    </Container>
  );
};
export default ContainerLayout;
