import { FC, useState } from 'react';
import { Button, Modal, TabHeader } from '@firecamp/ui-kit';

const _texts: IConfirm['texts'] = {
  btnConfirm: 'Create',
  btnCancle: 'Cancle',
};

const ConfirmationModal: FC<IConfirm> = ({
  title = '',
  message = '',
  texts = {
    btnCancle: 'Cancle',
    btnConfirm: 'Confirm',
  },
  onConfirm = () => {},
  onCancel = () => {},
  onClose = () => {},
  onResolve,
}) => {
  const [state, setState] = useState({
    isOpen: true,
  });
  const _close = (e) => {
    if (e) e.preventDefault();
    setState((s) => ({ ...s, isOpen: false }));
    setTimeout(() => {
      onClose(e);
    }, 500);
  };
  const _onConfirm = (e) => {
    if (e) e.preventDefault();
    onConfirm();
    _close(false);
    onResolve && onResolve("I am confirming that It'll work perfectly.");
  };
  texts = { ..._texts, ...texts };

  return (
    <Modal isOpen={state.isOpen} onClose={_close} width={'400px'}>
      <Modal.Body>
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            {`CONFIRMATION Required.`}
          </label>
          <div className="mt-4">{title}</div>
          <TabHeader className="px-4">
            <TabHeader.Right>
              <Button
                text={texts?.btnCancle || `Cancel`}
                onClick={_close}
                secondary
                sm
              />
              <Button
                text={texts?.btnConfirm || 'Confirm'}
                onClick={_onConfirm}
                disabled={false}
                primary
                sm
              />
            </TabHeader.Right>
          </TabHeader>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;

export interface IConfirm {
  /** title for the confirmation popup */
  title: string;

  /** the confirmation messsage texts */
  message: string;

  /** btn texts */
  texts?: {
    btnConfirm?: string;
    btnCancle?: string;
  };

  /** show a specific note in eye caching note box */
  note?: string;

  /** callback fucntion on successfull confirmation */
  onConfirm: () => any;

  /** callback fucntion on rejected confirmation */
  onCancel: () => any;

  /** callback fn on close the confirmation */
  onClose: Function;

  onResolve: (res: any) => void;
}
