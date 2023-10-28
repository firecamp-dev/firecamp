import { FC, useState } from 'react';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import {
  Button,
  DropdownMenu,
  SingleLineEditor,
} from '@firecamp/ui';
import {
  IOAuth1,
  EAuthTypes,
  TPlainObject,
  EEditorLanguage,
} from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const OAuth1: FC<IOAuth1Comp> = ({ auth, onChange = () => {} }) => {
  const { OAuth1 } = EAuthTypes;
  const signatureMethodList = (
    authUiFormState?.[OAuth1]?.signatureMethodList || []
  ).map((i) => ({ name: i }));
  const inputList = authUiFormState[OAuth1].inputList;
  const advancedInputList = authUiFormState[OAuth1].advancedInputList;

  const [isOpen, toggleOpen] = useState(false);
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
                value={auth?.[input.id as keyof IOAuth1] || ''}
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
        <label>Signature Method:</label>
        <DropdownMenu
          onOpenChange={(v) => toggleOpen(v)}
          handler={() => (
            <Button
              text={auth['signatureMethod'] || 'HMAC-SHA1'}
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
          options={signatureMethodList}
          onSelect={(method) => {
            _onSelectSignatureMethod(method?.name);
          }}
          selected={auth['signatureMethod'] || 'HMAC-SHA1'} //default "HMAC-SHA1"
          classNames={{
            trigger: 'mb-[10px]',
            dropdown: 'border-focusBorder !py-0 -mt-[10px]',
          }}
          menuProps={{
            position: 'bottom-start',
          }}
          width={120}
          sm
        />
      </div>
      {/* {auth?.['signatureMethod'] === 'RSA-SHA1' ? (
        <div
          className={
            'relative items-center text-input-text text-sm w-full mb-5'
          }
          key={'privateKey'}
        >
          <label
            className="text-app-foreground mb-1 block !pb-4"
            htmlFor={'Private Key'}
          >
            Private Key
          </label>
          <div className="!pb-4">
            <SingleLineEditor
              className={'border px-2 py-1 border-input-border'}
              type={setInputType(input.id) == 'number' ? 'number' : 'text'}
              name={privateKey}
              value={auth?.['privateKey'] || ''}
              onChange={(e) => _handleChange(e, 'privateKey')}
              height="21px"
              language={EEditorLanguage.FcText}
            />
          </div>
        </div>
      ) : (
        ''
      )} */}

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
                value={auth?.[input.id as keyof IOAuth1] || ''}
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

export default OAuth1;

interface IOAuth1Comp {
  auth: IOAuth1;
  onChange: (
    authType: EAuthTypes.OAuth1,
    updates: { key: string; value: any }
  ) => void;
}
