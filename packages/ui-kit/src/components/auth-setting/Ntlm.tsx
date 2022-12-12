import { FC, useReducer } from 'react';
import { EAuthTypes } from '@firecamp/types';
import { Input } from '@firecamp/ui-kit';
import { authUiState } from './constants';

const Ntlm: FC<INtlm> = ({ auth = {}, onChange = () => {} }) => {
  const { Bearer, Ntlm } = EAuthTypes
  const inputList = authUiState[Bearer].inputList;
  const advancedInputList = authUiState[Bearer].inputList;

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  const _setDirty = (
    state: any,
    action: { type: any; element: any; value: any }
  ) => {
    switch (action.type) {
      case 'setDirty':
        return {
          ...state,
          [action.element]: action.value,
        };
    }
  };

  const [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if (((inputList || []).map((e) => e.id) || []).includes(id)) {
      setIsDirty({ type: 'setDirty', element: id, value: true });
    }
    onChange(Ntlm, { key: id, value });
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {(inputList || []).map((input, i) => {
        let errorMsg = '';
        if (isDirty[input.id] && !auth[Ntlm][input.id]?.length) {
          errorMsg = `${input.name} can not be empty`;
        }
        return (
          <Input
            key={i}
            autoFocus={i === 0}
            label={input.name}
            type={
              input.id === 'password'
                ? 'password'
                : input.id === 'timestamp'
                ? 'number'
                : 'text'
            }
            placeholder={input.name}
            name={input.id}
            value={auth?.[Ntlm]?.[input.id] || ''}
            error={errorMsg}
            /* style={{
              borderColor:
                isDirty[input.id] && errorMsg
                  ? 'red'
                  : isDirty[input.id] && 'green',
            }} */
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
          />
        );
      })}
      <label className="fc-form-field-group">
        Advanced
        <span>optional</span>
      </label>
      {(advancedInputList || []).map((input, i) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={
              input.id === 'password'
                ? 'password'
                : input.id === 'timestamp'
                ? 'number'
                : 'text'
            }
            placeholder={input.name}
            name={input.id}
            value={auth[Ntlm]?.[input.id] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
          />
        );
      })}
    </form>
  );
};

export default Ntlm;

interface INtlm {
  auth: any; // TODO: add interface
  onChange: (
    authType: EAuthTypes.Ntlm,
    updates: { key: string; value: any }
  ) => void;
}
