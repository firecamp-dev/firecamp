import { FC } from 'react';
import { ScrollBar } from '@firecamp/ui';
import { Modal as MantineModal, ScrollArea } from '@mantine/core';
import { ModalProps } from '@mantine/core';
import { createStyles } from '@mantine/core';
interface IModal extends ModalProps {
  /**
   * Is modal open or not
   */
  isOpen?: boolean;
}
interface IBody {
  id?: string;
  children?: any;
  className?: string;
  scrollbar?: boolean;
}

interface IFooter {
  id?: string;
  children?: any;
  className?: string;
}

// custom styles for variants
const useStyles = createStyles((theme, { title }: IModal) => ({
  // root: {

  // },
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
    // padding: '1rem',

    // width: '100%',
    // maxHeight: '90vh',
    // minHeight: '400px'
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
    padding: '1rem',
  },
}));

const Modal: FC<IModal> & {
  Body: FC<IBody>;
  Footer: FC<IFooter>;
} = ({
  id = '',
  isOpen = false,
  opened = false,
  classNames = {},
  onClose = () => {},
  children = <></>,
  ...props
}) => {
  // console.log(`modal-props...`, props);
  const { classes, cx, theme } = useStyles({
    title: props.title,
    opened: isOpen || opened,
    onClose: () => {},
  });
  return (
    <MantineModal
      opened={isOpen || opened}
      onClose={() => onClose()}
      id={id}
      centered
      classNames={{
        ...classNames,
        content: cx('invisible-scrollbar', classNames.content, classes.content),
        header: cx(classNames.header, classes.header),
        // body: 'invisible-scrollbar '
      }}
      // styles={{
      // body: {
      //   display: 'flex',
      //   flexDirection: 'column',
      //   minHeight: '400px',
      //   maxHeight: '90vh',
      // }
      // }}
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
let Body: FC<IBody> = ({ children = '' }) => {
  return <div className="p-4">{children}</div>;
  return (
    <ScrollBar
      className="p-4 pt-0 flex-1 overflow-y-auto max-h-48"
      transparent
      fullHeight
    >
      {/* provide static height to display the scrollbar */}
      <>{children}</>
    </ScrollBar>
  );
};

const Footer: FC<IFooter> = ({ id = '', children = '', className = '' }) => {
  return (
    <div className={className ?? 'p-4 pt-0'} id={id}>
      {children}
    </div>
  );
};

Modal.Body = Body;
Modal.Footer = Footer;
export default Modal;
