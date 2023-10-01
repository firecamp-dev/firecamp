import { FC, useState } from 'react';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import cx from 'classnames';
import { Button, DropdownMenu, SingleLineEditor } from '@firecamp/ui';
import {
  IAuthDigest,
  EAuthTypes,
  TPlainObject,
  EEditorLanguage,
} from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const Digest: FC<IDigest> = ({
  auth = { username: '', password: '' },
  onChange = () => {},
}) => {
  const { Digest } = EAuthTypes;
  const inputList = authUiFormState[Digest].inputList;
  const advancedInputList = authUiFormState[Digest].advancedInputList;
  const algorithmList = (authUiFormState[Digest].algorithmList || []).map(
    (i) => ({ name: i })
  );
  const [isOpen, toggleOpen] = useState(false);
  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if (id === 'username' || id === 'password') {
      setDirtyInputs((s) => ({ ...s, [id]: true }));
    }
    onChange(Digest, { key: id, value });
    // console.log("value", value, id)
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  const _onSelectAlgorithm = (algorithm: string) => {
    if (!algorithm) return;
    onChange(Digest, {
      key: 'algorithm',
      value: algorithm,
    });
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {(inputList || []).map((input, i) => {
        let errorMsg = '';
        if (
          dirtyInputs[input.id] &&
          !auth?.[input.id as keyof IAuthDigest]?.length
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
                name={input.name}
                value={auth?.[input.id as keyof IAuthDigest] || ''}
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
      <div className="form-group">
        <label>Algorithm:</label>

        <DropdownMenu
          onOpenChange={(v) => toggleOpen(v)}
          handler={() => (
            <Button
              text={auth['algorithm'] || 'MD5'}
              classNames={{
                root: 'mb-2',
              }}
              rightIcon={
                <VscTriangleDown
                  size={12}
                  className={cx({ 'transform rotate-180': isOpen })}
                />
              }
              secondary
              xs
            />
          )}
          options={algorithmList}
          onSelect={(algorithm) => {
            _onSelectAlgorithm(algorithm?.name);
          }}
          selected={auth['algorithm'] || 'MD5'} //default "MD5"
          classNames={{
            trigger: 'mb-[10px]',
            dropdown: 'border-focusBorder !py-0 -mt-[10px]',
          }}
          menuProps={{
            position: 'bottom-start',
          }}
          width={100}
          sm
        />
      </div>
      {(advancedInputList || []).map((input, i) => {
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
                value={auth?.[input.id as keyof IAuthDigest] || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e, input.id)}
                disabled={input.id === 'qop'}
              />
            </div>
          </div>
        );
      })}
    </form>
  );
};

export default Digest;

interface IDigest {
  auth: IAuthDigest;
  onChange: (
    authType: EAuthTypes.Digest,
    updates: { key: string; value: any }
  ) => void;
}
