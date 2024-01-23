import { FC } from 'react';
import cx from 'classnames';
import { Modal as MantineModal, ModalProps, ScrollArea } from '@mantine/core';

export interface IModal extends ModalProps {}

const Modal: FC<IModal> = ({
  id = '',
  opened = false,
  classNames = {},
  onClose = () => {},
  children = <></>,
  ...props
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={() => onClose()}
      id={id}
      centered
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
      {...props}
    >
      {children}
    </MantineModal>
  );
};

export default Modal;
