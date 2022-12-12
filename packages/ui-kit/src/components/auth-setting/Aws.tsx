import { FC, useReducer } from 'react';
import { Input } from '@firecamp/ui-kit';
import { IAuthAws4, EAuthTypes } from '@firecamp/types'
import { authUiState } from './constants';

const Aws: FC<IAws> = ({ auth , onChange = () => { } }) => {
  const { Aws4 } = EAuthTypes;
  const inputList = authUiState[Aws4].inputList;
  const advancedInputList = authUiState[Aws4].advancedInputList;

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  const _setDirty = (state: any, action: { type: any; element: any; value: any; }) => {
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
    onChange(Aws4, { key: id, value });
  };

  const _handleSubmit = (e: { preventDefault: () => any; }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
    {(inputList || []).map((input, i) => {
      let errorMsg = '';
      if (isDirty[input.id] && !auth?.[input.id as keyof IAuthAws4]?.length) {
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
          value={auth?.[input.id as keyof IAuthAws4] || ''}
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
          value={auth?.[input.id as keyof IAuthAws4] || ''}
          onChange={(e) => _handleChange(e, input.id)}
          isEditor={true}
        />
      );
    })}
  </form>
  );
};

export default Aws;


interface IAws {
  auth: IAuthAws4,
  onChange: (authType: EAuthTypes.Aws4,
    updates: { key: string, value: any }) => void
}
