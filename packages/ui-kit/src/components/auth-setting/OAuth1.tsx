import { FC, useState, useReducer } from 'react';

import { Button, Dropdown ,EButtonColor,Input,CheckboxInGrid} from '@firecamp/ui-kit';
import { typePayload } from './constants';
import { IOAuth1, EAuthTypes } from '@firecamp/types'


const OAuth1: FC<IOAuth1Comp> = ({ auth, onChange= ()=> { } }) => {
  const signatureMethodList = (
    typePayload?.[EAuthTypes.OAuth1]?.['signatureMethodList'] || []
  ).map((i) => ({ name: i }));
  const inputList = typePayload[EAuthTypes.OAuth1]['inputList'];
  const advancedInputList = typePayload[EAuthTypes.OAuth1]['advancedInputList'];

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  let _setDirty = (state: any, action: any) => {
    switch (action.type) {
      case 'setDirty':
        return {
          ...state,
          [action.element]: action.value,
        };
    }
  };

  let [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);
  let [isDDOpen, toggleDD] = useState(false);

  let _handleChange = (e: any, id: string) => {
    e.preventDefault();
    let value = e.target.value;
    if (((inputList || []).map((e) => e.id) || []).includes(id)) {
      setIsDirty({ type: 'setDirty', element: id, value: true });
    }
    onChange(EAuthTypes.OAuth1, { key: id, value });
  };

  let _onSelectSignatureMethod = (method: string) => {
    if (!method) return;
    toggleDD(!isDDOpen);
    onChange(EAuthTypes.OAuth1, {
      key: 'signature_method',
      value: method,
    });
  };

  let _handleSubmit = (e: any) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
    {(inputList || []).map((input:{[key: string]: any}, i) => {
      let errorMsg = '';
      if (isDirty[input.id] && !auth?.[input.id]?.length) {
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
          value={auth?.[input.id] || ''}
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
      <span>(optional)</span>
    </label>
    <div className="form-group">
      <label>Signature Method:</label>

      <Dropdown
        selected={auth['signature_method'] || 'HMAC-SHA1'} //defalut "HMAC-SHA1"
      >
        <Dropdown.Handler>
        <Button 
          text={auth['signature_method'] || 'HMAC-SHA1'}
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
    {/* {auth?.['signature_method'] === 'RSA-SHA1' ? (
      <Input
        key={'private_key'}
        label="Private Key"
        type="text"
        placeholder="Private Key"
        name={'private_key'}
        value={auth?.['private_key'] || ''}
        onChange={(e) => _handleChange(e, 'private_key')}
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
          value={auth?.[input.id] || ''}
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
  auth: IOAuth1,
  onChange: (authType: EAuthTypes.OAuth1, updates: { key: string, value: any }) => void
}