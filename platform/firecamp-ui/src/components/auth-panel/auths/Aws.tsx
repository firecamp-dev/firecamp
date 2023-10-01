import { FC, useState } from 'react';
import { SingleLineEditor } from '@firecamp/ui';
import {
  IAuthAwsV4,
  EAuthTypes,
  TPlainObject,
  EEditorLanguage,
} from '@firecamp/types';
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
                name={input.id}
                value={auth?.[input.id as keyof IAuthAwsV4] || ''}
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
      <label className="fc-form-field-group">
        Advanced
        <span>optional</span>
      </label>
      {advancedInputList.map((input, i) => {
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
                // autoFocus={i === 0}
                type={setInputType(input.id) == 'number' ? 'number' : 'text'}
                name={input.id}
                value={auth?.[input.id as keyof IAuthAwsV4] || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e, input.id)}
              />
            </div>
          </div>
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
