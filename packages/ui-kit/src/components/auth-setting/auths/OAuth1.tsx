import { FC, useState } from 'react';
import { Button, Dropdown, Input, CheckboxInGrid } from '@firecamp/ui-kit';
import { IOAuth1, EAuthTypes, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const OAuth1: FC<IOAuth1Comp> = ({ auth, onChange = () => {} }) => {
  const { OAuth1 } = EAuthTypes;
  const signatureMethodList = (
    authUiFormState?.[OAuth1]?.signatureMethodList || []
  ).map((i) => ({ name: i }));
  const inputList = authUiFormState[OAuth1].inputList;
  const advancedInputList = authUiFormState[OAuth1].advancedInputList;

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );
  const [isDDOpen, toggleDD] = useState(false);

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if ((inputList.map((e) => e.id) || []).includes(id)) {
      setDirtyInputs((s) => ({ ...s, [id]: true }));
    }
    onChange(OAuth1, { key: id, value });
  };

  const _onSelectSignatureMethod = (method: string) => {
    if (!method) return;
    toggleDD(!isDDOpen);
    onChange(OAuth1, {
      key: 'signatureMethod',
      value: method,
    });
  };

  const _handleSubmit = (e: any) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {inputList.map((input: { [key: string]: any }, i) => {
        let errorMsg = '';
        if (
          dirtyInputs[input.id] &&
          !auth?.[input.id as keyof IOAuth1]?.length
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
            value={auth?.[input.id as keyof IOAuth1] || ''}
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
      <div className="form-group">
        <label>Signature Method:</label>
        <Dropdown
          selected={auth['signatureMethod'] || 'HMAC-SHA1'} //defalut "HMAC-SHA1"
        >
          <Dropdown.Handler>
            <Button
              text={auth['signatureMethod'] || 'HMAC-SHA1'}
              secondary
              withCaret
              sm
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={signatureMethodList}
            onSelect={(method) => {
              _onSelectSignatureMethod(method?.name);
            }}
          />
        </Dropdown>
      </div>
      {/* {auth?.['signatureMethod'] === 'RSA-SHA1' ? (
      <Input
        key={'privateKey'}
        label="Private Key"
        type="text"
        placeholder="Private Key"
        name={'privateKey'}
        value={auth?.['privateKey'] || ''}
        onChange={(e) => _handleChange(e, 'privateKey')}
        isEditor={true}
      />
    ) : (
      ''
    )} */}

      {advancedInputList.map((input, i) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            name={input.id}
            value={auth?.[input.id as keyof IOAuth1] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}
    </form>
  );
};

export default OAuth1;

interface IOAuth1Comp {
  auth: IOAuth1;
  onChange: (
    authType: EAuthTypes.OAuth1,
    updates: { key: string; value: any }
  ) => void;
}
