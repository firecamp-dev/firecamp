import { FC, useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Modal } from '@firecamp/ui';

import './ErrorPopup.sass';

const ErrorPopup: FC<FallbackProps> = ({ error }) => {
  const bg = {
    modal: {
      background: '#c84a1782',
      color: '#e3dfdf',
    },
  };

  let [isOpen, toggleOpen] = useState(true);

  let _onClose = async () => {
    // on close, refresh app
    // onClose();
    // await initApp();
    toggleOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      modalConfig={{
        styles: bg,
      }}
      onClose={_onClose}
      className="fc-error-popup"
    >
      <div
        style={{
          paddingRight: '60px',
        }}
      >
        {error.message || ''}
      </div>
    </Modal>
  );
};

export default ErrorPopup;
