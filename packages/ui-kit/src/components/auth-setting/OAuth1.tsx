import { FC, useState, useReducer } from 'react';
import { Button, Dropdown, Input, CheckboxInGrid } from '@firecamp/ui-kit';
import { IOAuth1, EAuthTypes } from '@firecamp/types';
import { authUiFormState } from './constants';

const OAuth1: FC<IOAuth1Comp> = ({ auth, onChange = () => {} }) => {
  const { OAuth1 } = EAuthTypes;
  const signatureMethodList = (
    authUiFormState?.[OAuth1]?.signatureMethodList || []
  ).map((i) => ({ name: i }));
  const inputList = authUiFormState[OAuth1].inputList;
  const advancedInputList = authUiFormState[OAuth1].advancedInputList;

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  const _setDirty = (state: any, action: any) => {
    switch (action.type) {
      case 'setDirty':
        return {
          ...state,
          [action.element]: action.value,
        };
    }
  };

  const [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);
  const [isDDOpen, toggleDD] = useState(false);

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if (((inputList || []).map((e) => e.id) || []).includes(id)) {
      setIsDirty({ type: 'setDirty', element: id, value: true });
    }
    onChange(OAuth1, { key: id, value });
  };

  const _onSelectSignatureMethod = (method: string) => {
    if (!method) return;
    toggleDD(!isDDOpen);
    onChange(OAuth1, {
      key: 'signatureMethod',
      value: method,
    });
  };

  const _handleSubmit = (e: any) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {(inputList || []).map((input: { [key: string]: any }, i) => {
        let errorMsg = '';
        if (isDirty[input.id] && !auth?.[input.id as keyof IOAuth1]?.length) {
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
            value={auth?.[input.id as keyof IOAuth1] || ''}
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
      <div className="form-group">
        <label>Signature Method:</label>

        <Dropdown
          selected={auth['signatureMethod'] || 'HMAC-SHA1'} //defalut "HMAC-SHA1"
        >
          <Dropdown.Handler>
            <Button
              text={auth['signatureMethod'] || 'HMAC-SHA1'}
              sm
              secondary
              withCaret={true}
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={signatureMethodList}
            onSelect={(method) => {
              _onSelectSignatureMethod(method?.name);
            }}
          />
        </Dropdown>
      </div>
      {/* {auth?.['signatureMethod'] === 'RSA-SHA1' ? (
      <Input
        key={'privateKey'}
        label="Private Key"
        type="text"
        placeholder="Private Key"
        name={'privateKey'}
        value={auth?.['privateKey'] || ''}
        onChange={(e) => _handleChange(e, 'privateKey')}
        isEditor={true}
      />
    ) : (
      ''
    )} */}

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
            value={auth?.[input.id as keyof IOAuth1] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
          />
        );
      })}
    </form>
  );
};

export default OAuth1;

interface IOAuth1Comp {
  auth: IOAuth1;
  onChange: (
    authType: EAuthTypes.OAuth1,
    updates: { key: string; value: any }
  ) => void;
}
