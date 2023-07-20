import { FC } from 'react';
import { Modal as MantineModal, ScrollArea } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { IModal } from './Modal.interface';

// custom styles for variants
const useStyles = createStyles((theme, { title }: IModal) => ({
  content: {
    backgroundColor:
      theme.colorScheme === 'light'
        ? theme.colors.gray[1]
        : theme.colors.dark[6],
    color:
      theme.colorScheme === 'light'
        ? theme.colors.dark[5]
        : theme.colors.gray[4],
    maxWidth: '48rem',
    minHeight: '400px'
  },
  header: {
    backgroundColor: 'transparent',
    color:
      theme.colorScheme === 'light'
        ? theme.colors.dark[5]
        : theme.colors.gray[4],
    paddingRight: '1rem',
    paddingTop: '1rem',
    paddingBottom: !!title ? '1rem' : '0px',
    ...(!!title
      ? {
          borderBottom: `1px solid ${
            theme.colorScheme === 'light'
              ? theme.colors.gray[4]
              : theme.colors.dark[4]
          }`,
        }
      : {}),
  },
  body: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingBottom: '2rem',
    position: 'relative'
  },
}));

const Modal: FC<IModal> = ({
  id = '',
  opened = false,
  classNames = {},
  onClose = () => {},
  children = <></>,
  ...props
}) => {
  const { classes, cx, theme } = useStyles({
    title: props.title,
    opened,
    onClose: () => {},
  });

  return (
    <MantineModal
      opened={opened}
      onClose={() => onClose()}
      id={id}
      centered
      classNames={{
        ...classNames,
        content: cx('invisible-scrollbar', classes.content, classNames.content),
        header: cx(classes.header, classNames.header),
        body: cx(classes.body, classNames.body),
      }}
      scrollAreaComponent={ScrollArea.Autosize}
      closeButtonProps={{
        bg:
          theme.colorScheme === 'light'
            ? theme.colors.gray[1]
            : theme.colors.dark[6],
      }}
      {...props}
    >
      {children}
    </MantineModal>
  );
};

export default Modal;
