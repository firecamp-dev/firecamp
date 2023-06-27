import { FC, useState } from 'react';
import { Button, DropdownMenu, Input } from '@firecamp/ui';
import { IAuthDigest, EAuthTypes, TPlainObject } from '@firecamp/types';
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
          errorMsg = `${input.name} can not be empty`;
        }
        return (
          <Input
            key={i}
            autoFocus={i === 0}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            name={input.name}
            value={auth?.[input.id as keyof IAuthDigest] || ''}
            error={errorMsg}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
            // onKeyDown={_onKeyDown}
          />
        );
      })}

      <label className="fc-form-field-group">
        Advanced
        <span>optional</span>
      </label>
      <div className="form-group">
        <label>Algorithm:</label>

        <DropdownMenu
          handleRenderer={() => (
            <Button
              text={auth['algorithm'] || 'MD5'}
              secondary
              withCaret
              sm
              className="mb-2"
            />
          )}
          options={algorithmList}
          onSelect={(algorithm) => {
            _onSelectAlgorithm(algorithm?.name);
          }}
          selected={auth['algorithm'] || 'MD5'} //defalut "MD5"
          classNames={{
            trigger: 'mb-[10px]',
            dropdown: 'border-focusBorder !py-0 -mt-[10px]',
            item: '!text-sm !leading-[18px] !px-2 !py-1',
          }}
          width={144}
          menuProps={{
            position: 'bottom-start',
          }}
        />
      </div>
      {(advancedInputList || []).map((input, i) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            name={input.id}
            value={auth?.[input.id as keyof IAuthDigest] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
            disabled={input.id === 'qop'}
            // onKeyDown={_onKeyDown}
          />
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
