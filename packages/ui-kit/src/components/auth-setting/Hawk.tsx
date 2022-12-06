import { FC, useState, useReducer } from 'react';

import { Dropdown,Input } from '@firecamp/ui-kit';
import { typePayload } from './constants';
import { EAuthTypes } from '@firecamp/types';

const Hawk: FC<IHawk> = ({ auth = {}, onChange = () => { } }) => {
  const algorithmList = typePayload[EAuthTypes.Hawk]['algorithmList'] as [];
  const inputList = typePayload[EAuthTypes.Hawk]['inputList'];
  const advancedInputList = typePayload[EAuthTypes.Hawk]['advancedInputList'];

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  let _setDirty = (state: any, action: { type: any; element: any; value: any; }) => {
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
    onChange(EAuthTypes.Hawk, { key: id, value });
    // console.log("value", value, id)
  };

  let _setAlgorithm = (algo: any) => {
    if (!algo) return;
    onChange(EAuthTypes.Hawk, {
      key: 'algorithm',
      value: algo,
    });
  };

  let _handleSubmit = (e: { preventDefault: () => any; }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
    {(inputList || []).map((input, i) => {
      // console.log('isDirty', isDirty, "errorMsg", errorMsg)
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
    <div className="form-group">
      <label>Algorithm</label>
      <Dropdown
        selected={auth[EAuthTypes.Hawk]['algorithm'] || 'SHA256'} //default "SHA256
      >
        <Dropdown.Handler>
          <div className={'select-box-title'}>
            {auth[EAuthTypes.Hawk]['algorithm'] || 'SHA256'}
          </div>
        </Dropdown.Handler>
        <Dropdown.Options
          options={algorithmList}
          onSelect={(method) => {
            _setAlgorithm(method);
          }}
        />
      </Dropdown>
    </div>
  </form>
  );
};

export default Hawk;

interface IHawk {
  auth: any, // TODO: add interface
  onChange: ( authType: string, // TODO: add enum
  updates: { key: string, value: any }) => void
}