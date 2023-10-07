import { FC, useState } from 'react';
import { DropdownMenu, SingleLineEditor } from '@firecamp/ui';
import { EAuthTypes, EEditorLanguage, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Hawk: FC<IHawk> = ({ auth = {}, onChange = () => {} }) => {
  const { Hawk } = EAuthTypes;
  const algorithmList = authUiFormState[Hawk].algorithmList as [];
  const inputList = authUiFormState[Hawk].inputList;
  const advancedInputList = authUiFormState[Hawk].advancedInputList;
  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if ((inputList.map((e) => e.id) || []).includes(id)) {
      setDirtyInputs((s) => ({ ...s, [id]: true }));
    }
    onChange(Hawk, { key: id, value });
    // console.log("value", value, id)
  };

  const _setAlgorithm = (algo: any) => {
    if (!algo) return;
    onChange(Hawk, {
      key: 'algorithm',
      value: algo,
    });
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {inputList.map((input, i) => {
        // console.log('isDirty', isDirty, "errorMsg", errorMsg)
        let errorMsg = '';
        if (dirtyInputs[input.id] && !auth?.[input.id]?.length) {
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
                value={auth?.[input.id] || ''}
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
                type={setInputType(input.id) == 'number' ? 'number' : 'text'}
                name={input.id}
                value={auth?.[input.id] || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e, input.id)}
              />
            </div>
          </div>
        );
      })}
      <div className="form-group">
        <label>Algorithm</label>
        <DropdownMenu
          handler={() => (
            <div className={'select-box-title'}>
              {auth[Hawk]['algorithm'] || 'SHA256'}
            </div>
          )}
          options={algorithmList}
          onSelect={(method) => {
            _setAlgorithm(method);
          }}
          selected={auth[Hawk]['algorithm'] || 'SHA256'} //default "SHA256
          classNames={{
            trigger: 'mb-[10px]',
            dropdown: 'border-focusBorder !py-0 -mt-[10px]',
          }}
          menuProps={{
            position: 'bottom-start',
          }}
          width={144}
          sm
        />
      </div>
    </form>
  );
};

export default Hawk;

interface IHawk {
  auth: any; // TODO: add interface
  onChange: (
    authType: string, // TODO: add enum
    updates: { key: string; value: any }
  ) => void;
}
