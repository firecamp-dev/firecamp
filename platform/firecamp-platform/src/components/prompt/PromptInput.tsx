import { FC, useState } from 'react';
import { Button, Input, ProgressBar, TabHeader } from '@firecamp/ui';
import { IPromptInput } from './types';

const _texts: IPromptInput['texts'] = {
  btnOk: 'Create',
  btnOking: 'Creating...',
  btnCancel: 'Cancel',
};

export const PromptInput: FC<IPromptInput> = ({
  label = 'Name',
  placeholder,
  texts,
  value,
  onClose,
  validator,
  executor,
  onResolve,
  onError,
}) => {
  const [state, setState] = useState({
    isOpen: true,
    isExecuting: false,
    value,
    error: '',
  });
  const _close = (e) => {
    setState((s) => ({ ...s, isOpen: false }));
    setTimeout(() => {
      onClose(e);
    }, 500);
  };
  const _onChangeValue = (e) => {
    const { value } = e.target;
    setState((s) => ({ ...s, value, error: '' }));
  };
  const _onClickOk = async (e) => {
    e.preventDefault();
    const value = state.value.trim();
    let _validator: { isValid: boolean; message?: string } = { isValid: true };
    if (typeof validator == 'function') _validator = validator(value);
    // console.log(_validator, '_validator');
    if (_validator.isValid == false) {
      setState((s) => ({ ...s, error: _validator.message }));
      if (typeof onError == 'function') onError(new Error(_validator.message));
    } else {
      if (typeof executor == 'function') {
        setState((s) => ({ ...s, error: '', isExecuting: true }));
        executor(value)
          .then((res) => {
            onResolve(res);
            // finally close the prompt on success
            setState((s) => ({ ...s, isOpen: false, isExecuting: false }));
          })
          .catch((e) => {
            if (typeof onError == 'function') {
              console.error(e);
              onError(e);
            }
            setState((s) => ({
              ...s,
              isExecuting: false,
              error: e?.response?.data?.message || e.message,
            }));
          });
      } else {
        onResolve(value);
        // finally close the prompt on success
        setState((s) => ({ ...s, error: '', isOpen: false }));
      }
    }
  };
  const _onKeyDown = (e) => {
    if (e.key == 'Enter') {
      _onClickOk(e);
    }
  };
  texts = { ..._texts, ...texts };

  return (
    <>
      <ProgressBar active={state.isExecuting} />
      <div className="pt-4">
        <div className="">
          <Input
            autoFocus={true}
            label={label}
            placeholder={placeholder}
            name={'promptInput'}
            value={state.value}
            onChange={_onChangeValue}
            onKeyDown={_onKeyDown}
            onBlur={() => { }}
            error={state.error}
          />
        </div>
        <TabHeader className="!px-0">
          <TabHeader.Right>
            <Button
              text={texts?.btnCancel || `Cancel`}
              onClick={_close}
              ghost
              xs
            />
            <Button
              text={
                state.isExecuting ? texts?.btnOking : texts?.btnOk || 'Create'
              }
              onClick={_onClickOk}
              disabled={state.isExecuting}
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </div>
    </>
  );
};
