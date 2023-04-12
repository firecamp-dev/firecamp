import { FC, useState } from 'react';
import { Input } from '@firecamp/ui';
import { IAuthAwsV4, EAuthTypes, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Aws: FC<IAws> = ({ auth, onChange = () => {} }) => {
  const { AwsV4 } = EAuthTypes;
  const inputList = authUiFormState[AwsV4].inputList;
  const advancedInputList = authUiFormState[AwsV4].advancedInputList;

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    setDirtyInputs((s) => ({ ...s, [id]: true }));
    onChange(AwsV4, { key: id, value });
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {inputList.map((input, i) => {
        let errorMsg = '';
        if (
          dirtyInputs[input.id] &&
          !auth?.[input.id as keyof IAuthAwsV4]?.length
        ) {
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
            value={auth?.[input.id as keyof IAuthAwsV4] || ''}
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
            value={auth?.[input.id as keyof IAuthAwsV4] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}
    </form>
  );
};

export default Aws;

interface IAws {
  auth: IAuthAwsV4;
  onChange: (
    authType: EAuthTypes.AwsV4,
    updates: { key: string; value: any }
  ) => void;
}
