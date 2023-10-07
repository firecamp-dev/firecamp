import { FC, useState } from 'react';
import {
  IAuthBasic,
  EAuthTypes,
  TPlainObject,
  EEditorLanguage,
} from '@firecamp/types';
import { SingleLineEditor } from '@firecamp/ui';
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
          errorMsg = `${input.name} cannot be empty`;
        }
        return (
          <div
            className={
              'relative items-center text-input-text text-sm w-full mb-5'
            }
            key={i}
          >
            <label
              className="text-app-foreground mb-1 block !pb-4"
              htmlFor={input.name}
            >
              {input.name}
            </label>
            <div className="!pb-4">
              <SingleLineEditor
                className={'border px-2 py-1 border-input-border'}
                autoFocus={i === 0}
                type={setInputType(input.id) == 'number' ? 'number' : 'text'}
                value={auth?.[input.id as keyof IAuthBasic] || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e, input.id)}
              />
              {!!errorMsg && (
                <div className={'font-light text-error block absolute'}>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
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
