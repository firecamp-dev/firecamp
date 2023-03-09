import { FC, useState } from 'react';
import { EAuthTypes, TPlainObject } from '@firecamp/types';
import { Input } from '@firecamp/ui';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Ntlm: FC<INtlm> = ({ auth = {}, onChange = () => {} }) => {
  const { Bearer, Ntlm } = EAuthTypes;
  const inputList = authUiFormState[Bearer].inputList;
  const advancedInputList = authUiFormState[Bearer].inputList;

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if (((inputList || []).map((e) => e.id) || []).includes(id)) {
      setDirtyInputs((s) => ({ ...s, [id]: true }));
    }
    onChange(Ntlm, { key: id, value });
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {inputList.map((input, i) => {
        let errorMsg = '';
        if (dirtyInputs[input.id] && !auth[Ntlm][input.id]?.length) {
          errorMsg = `${input.name} can not be empty`;
        }
        return (
          <Input
            key={i}
            autoFocus={i === 0}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            name={input.id}
            value={auth?.[Ntlm]?.[input.id] || ''}
            error={errorMsg}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}
      <label className="fc-form-field-group">
        Advanced
        <span>optional</span>
      </label>
      {advancedInputList.map((input, i) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            name={input.id}
            value={auth[Ntlm]?.[input.id] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
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
