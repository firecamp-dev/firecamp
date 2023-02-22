import { FC } from "react";
import cx from 'classnames';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import ResponsiveModal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './Modal.scss';

import { Container, Row } from '../../ui-kit'
import { IModal } from "./interfaces/Modal.interface"

const Modal: FC<IModal> & {
  Header: FC<IHeader>,
  Body: FC<IBody>,
  Footer: FC<IFooter>
} = ({
  id = '',
  showCloseIcon = true,
  isOpen = false,
  className = '',
  modalClass = '',
  modalConfig = {},
  onClose = () => { },
  children = '',
  height,
  width,
}) => {

  return (
    <ResponsiveModal
      open={isOpen}
      onClose={() => {
        onClose();
      }}
      center
      closeIcon={(<VscClose size={20} className="cursor-pointer z-50" />)}
      {...modalConfig}
    >
        <div
          className={cx(
            className,
            'max-w-screen-md min-w-screen-md bg-modalBackground text-appForeground w-full relative z-9999 max-h-modal flex fc-modal-wrapper h-full'
          )}
          style={{ height: height, width: width }}
          id={id}
        >
          {/* {showCloseIcon ? (
            <VscClose
              size={20}
              className="absolute top-3 right-3 cursor-pointer z-50"
              onClick={(e) => {
                onClose();
              }}
            />
          ) : <></>} */}
            {children}
        </div>
    </ResponsiveModal>
  )
}

let Header: FC<IHeader> = ({ id = '', children = '', className = '' }) => {
  return (
    <Container.Header className={className || ''} id={id}>
      {children}
    </Container.Header>
  );
};

let Body: FC<IBody> = ({ id = '', children = '', className = '' }) => {
  return (
    <Container.Body
    className={cx(
      className,
      'flex flex-col overflow-auto visible-scrollbar thin !p-4'
    )}
    id={id}>
      {children}
    </Container.Body>
  );
};

let Footer: FC<IFooter> = ({ id = '', children = '', className = '' }) => {
  return (
    <Container.Footer className={className || 'flex'} id={id}>
      <Row className="w-full with-divider">{children}</Row>
    </Container.Footer>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;

interface IHeader {
  id?: string
  children?: any
  className?: string
}

interface IBody {
  id?: string
  children?: any
  className?: string
}

interface IFooter {
  id?: string
  children?: any
  className?: string
}