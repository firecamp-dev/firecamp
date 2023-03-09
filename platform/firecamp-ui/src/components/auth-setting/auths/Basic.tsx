import { FC, useState } from 'react';
import { Input } from '@firecamp/ui';
import { IAuthBasic, EAuthTypes, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Basic: FC<IBasic> = ({ auth, onChange = () => {} }) => {
  const { Basic } = EAuthTypes;
  const inputList = authUiFormState[Basic].inputList;

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const { value } = e.target;
    setDirtyInputs((s) => ({ ...s, [id]: true }));
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
          dirtyInputs[input.id] &&
          !auth?.[input.id as keyof IAuthBasic]?.length
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
            value={auth?.[input.id as keyof IAuthBasic] || ''}
            error={errorMsg}
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
