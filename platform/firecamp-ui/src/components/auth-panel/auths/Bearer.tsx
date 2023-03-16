import { FC, useState } from 'react';
import { Input } from '@firecamp/ui';
import { IAuthBearer, EAuthTypes, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Bearer: FC<IBearer> = ({ auth, onChange = () => {} }) => {
  const { Bearer } = EAuthTypes;
  const inputList = authUiFormState[Bearer]['inputList'] || [];

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );
  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    setDirtyInputs((s) => ({ ...s, [id]: true }));
    onChange(Bearer, { key: id, value });
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
          !auth?.[input.id as keyof IAuthBearer]?.length
        ) {
          errorMsg = `${input.name} can not be empty`;
        }
        return (
          <Input
            key={i}
            autoFocus={i === 0}
            label={input.name || ''}
            type={setInputType(input.id)}
            placeholder={input.name || ''}
            value={auth?.[input.id as keyof IAuthBearer] || ''}
            error={errorMsg}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}
    </form>
  );
};

export default Bearer;

interface IBearer {
  auth: IAuthBearer;
  onChange: (
    authType: EAuthTypes.Bearer,
    updates: { key: string; value: any }
  ) => void;
}
