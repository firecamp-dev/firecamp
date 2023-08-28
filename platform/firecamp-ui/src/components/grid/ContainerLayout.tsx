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
}
const ContainerLayout: FC<IContainerLayout> = ({
  flex = false,
  children = <></>,
  className = '',
  ...props
}) => {
  const { classes, cx } = useStyles();
  return (
    <Container
      className={cx({ 'flex-1': flex }, classes.root, className)}
      fluid
      {...props}
    >
      {children}
    </Container>
  );
};
export default ContainerLayout;
