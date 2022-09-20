import { FC, useState } from 'react';
import { Modal } from '@firecamp/ui-kit';

import './ErrorPopup.sass';

const ErrorPopup: FC<IErrorPopup> = ({
  message = `An unexpected error occurs. 
We'll surely fix it out for you soon. We appreciate your patience.`,
  onClose = () => {},
}) => {
  // console.log(`in error popup`, message, isOpen)

  const bg = {
    modal: {
      background: '#c84a1782',
      color: '#e3dfdf',
    },
  };

  let [isOpen, toggleOpen] = useState(true);

  let _onClose = async () => {
    // on close, refresh app
    onClose();
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
        {message || ''}
      </div>
    </Modal>
  );
};

export default ErrorPopup;

/**
 * Handle firecamp errors and show popup menu to instruct users about the same
 */
interface IErrorPopup {
  /**
   * Error message
   */
  message?: string;
  /**
   * Close error popup
   */
  onClose?: () => void;
}
