import { FC, useState } from 'react';
import {
  Container,
  Button,
  EButtonColor,
  EButtonSize,
  Modal,
} from '@firecamp/ui-kit';

import { IConfirmationModal } from './ConfirmationModal.interfaces';

const ConfirmationModal: FC<IConfirmationModal> = ({
  isOpen: propIsOpen = false,
  title = '',
  message = '',
  note = '',
  _meta = {
    buttons: {
      confirm: {
        text: 'Re-sync',
        classname: '',
        color: '',
      },
      cancel: {
        text: 'Force logout',
        classname: '',
        color: '',
      },
    },
  },
  additionalComponents = {},
  onConfirm = () => {},
  onCancel = () => {},
  onClose = () => {},
}) => {
  let [isOpen, toggleOpen] = useState(propIsOpen);

  let _onConfirm = (e) => {
    if (e) e.preventDefault();
    onConfirm();
    toggleOpen(false);
  };

  let _onCancel = (e) => {
    if (e) e.preventDefault();
    onCancel();
    toggleOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={(e: any) => {
        if (e) e.persist();
        toggleOpen(false);
      }}
      modalConfig={{ center: true }}
    >
      <Container className="fc-modal fc-modal-small confirmation-modal">
        <Container.Header className="fc-modal-head">{title}</Container.Header>
        <Container.Body className="fc-modal-body">
          <div className="fc-modal-description">{message || ''}</div>
          <div className="fc-modal-notes fc-error">{note || ''}</div>
          <div className="fc-modal-action">
            <Button
              // color={'primary-alt'}
              // className="fc-button small"
              primary
              sm
              //@ts-ignore
              text={_meta.buttons?.confirm?.text || 'Confirm'}
              onClick={_onConfirm}
            />
            <Button
              // color={'secondary'}
              // className="fc-button small"
              secondary
              sm
              //@ts-ignore
              text={_meta.buttons?.cancel?.text || 'Cancel'}
              onClick={_onCancel}
            />
          </div>
        </Container.Body>
      </Container>
    </Modal>
  );
};

export default ConfirmationModal;
