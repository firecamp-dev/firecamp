import { FC, useState } from 'react';
import { Button, Input, Modal, TabHeader } from '@firecamp/ui-kit';
export interface IPromptInput {
  header;
  texts?: {
    btnOk: string;
    btnOking: string;
    btnCancle: string;
  };
  value: string;
  onClose: Function;
  validator?: (value: string) => boolean;
  executor?: (value: string) => Promise<void>;
  onResolve: (res: any) => void;
  onReject: (e) => void;
}

export const PromptInput: FC<IPromptInput> = ({
  header,
  texts,
  value,
  onClose,
  validator,
  executor,
  onReject,
  onResolve,
}) => {
  const [state, setState] = useState({
    isOpen: true,
    isExecuting: false,
    value,
  });
  const _close = (e) => {
    setState((s) => ({ ...s, isOpen: false }));
    setTimeout(() => {
      onClose(e);
    }, 500);
  };
  const _onChangeValue = (e) => {
    const { value } = e.target;
    setState((s) => ({ ...s, value }));
  };
  const _onClickOk = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (typeof validator == 'function') isValid = validator(state.value);
    if (isValid !== true) {
      onReject(new Error('validation error'));
    } else {
      if (typeof executor == 'function') {
        setState((s) => ({ ...s, isExecuting: true }));
        executor(state.value)
          .then((res) => onResolve(res))
          .catch((e) => onReject(e))
          .finally(() => {
            setState((s) => ({ ...s, isExecuting: false }));
          });
      } else {
        onResolve(state.value);
      }
    }
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={_close}
      height="250px"
      width={'400px'}
    >
      <Modal.Body>
        {/* <ProgressBar active={isRequesting} /> */}
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            {header || `THIS IS A HEADER PLACE`}
          </label>
          <div className="mt-4">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Folder name"
              name={'prompInput'}
              value={value}
              onChange={_onChangeValue}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={''}
            />
          </div>
          <TabHeader className="px-4">
            <TabHeader.Right>
              <Button
                text={texts?.btnCancle || `Cancel`}
                onClick={_close}
                sm
                secondary
                transparent
                ghost
              />
              <Button
                text={
                  state.isExecuting ? texts?.btnOking : texts?.btnOk || 'Create'
                }
                onClick={_onClickOk}
                disabled={state.isExecuting}
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
