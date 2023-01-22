import { FC, useReducer } from 'react';
import { Input } from '@firecamp/ui-kit';
import { IAuthBasic, EAuthTypes } from '@firecamp/types';
import { authUiFormState } from './constants';

const Basic: FC<IBasic> = ({ auth, onChange = () => {} }) => {
  const { Basic } = EAuthTypes;
  const inputList = authUiFormState[Basic].inputList;

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
    const { value } = e.target;
    setIsDirty({ type: 'setDirty', element: id, value: true });
    onChange(Basic, { key: id, value });
    // console.log("value", value, id)
  };
  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {(inputList || []).map((input, i) => {
        let errorMsg = '';
        if (
          isDirty[input.id] &&
          !auth?.[input.id as keyof IAuthBasic]?.length
        ) {
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
            value={auth?.[input.id as keyof IAuthBasic] || ''}
            error={isDirty[input.id] && errorMsg ? errorMsg : ''}
            /* style={{
          borderColor:
            isDirty[input.id] && errorMsg
              ? 'red'
              : isDirty[input.id] && 'green',
        }} */
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
            /*onKeyDown={_onKeyDown}*/
          />
        );
      })}
    </form>
  );
};

export default Basic;

interface IBasic {
  auth: IAuthBasic;
  onChange: (
    authType: EAuthTypes.Basic,
    updates: { key: string; value: any }
  ) => void;
}
