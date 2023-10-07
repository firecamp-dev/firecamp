import { FC, useState, useEffect, Key } from 'react';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button, DropdownMenu, SingleLineEditor } from '@firecamp/ui';
// @ts-ignore
import { EAuthTypes, EEditorLanguage, IUiOAuth2, TPlainObject } from '@firecamp/types';
import { authUiFormState } from '../constants';
import { setInputType } from '../service';

const OAuth2: FC<IOAuth2Comp> = ({
  auth,
  onChangeOAuth2Value = () => {},
  oauth2LastToken = '',
  fetchTokenOnChangeOAuth2 = () => {},
}) => {
  const { OAuth2 } = EAuthTypes;
  const { activeGrantType, grantTypes } = auth;
  const grantTypesOptions = authUiFormState[OAuth2].grantTypes;
  const grantTypesPayloads = authUiFormState[OAuth2].grantTypesPayload;
  // @ts-ignore
  const inputList = grantTypesPayloads?.[activeGrantType].inputList;
  // @ts-ignore
  const advancedInputList = grantTypesPayloads?.[activeGrantType].advancedInputList;

  const [isOpen, toggleOpen] = useState(false);
  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    // @ts-ignore
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );
  // const [isDDOpen, toggleDD] = useState(false);

  useEffect(() => {
    setDirtyInputs({}); //TODO: check this later
  }, [activeGrantType]);

  const _handleChange = (e: any, id: any) => {
    e.preventDefault();
    // console.log("id", id);
    const value = e.target.value;
    if ((inputList.map((e: { id: any }) => e.id) || []).includes(id)) {
      setDirtyInputs((s) => ({ ...s, [id]: true }));
    }
    onChangeOAuth2Value('activeGrantTypeValue', { key: id, value });
  };

  const _onSelectGrantType = (type: { id: any }) => {
    console.log({ type });
    if (!type || !type.id) return;
    onChangeOAuth2Value('activeGrantType', type.id);
  };

  const _fetchTokenOnChangeOAuth2 = async () => {
    const activeGrantType = auth.activeGrantType;
    const activeGrantTypePayload = auth.grantTypes[activeGrantType];

    fetchTokenOnChangeOAuth2(activeGrantTypePayload || {});
  };

  const _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      <div className="form-group">
        <label>Grant Type:</label>
        <DropdownMenu
          onOpenChange={(v) => toggleOpen(v)}
          handler={() => (
            <Button
              text={
                grantTypesOptions.find((t) => t.id === activeGrantType)?.name ||
                ''
              }
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
          options={grantTypesOptions}
          onSelect={(element) => _onSelectGrantType(element)}
          selected={
            grantTypesOptions.find((t) => t.id === activeGrantType)?.name || ''
          }
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
      {inputList.map((input: { [key: string]: string }, i: number) => {
        let errorMsg = '';
        if (
          dirtyInputs[input.id] &&
          !grantTypes[activeGrantType][input.id]?.length
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
                value={grantTypes[activeGrantType]?.[input.id] || ''}
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
      <label className="fc-form-field-group m-5">
        Advanced
        <span>optional</span>
      </label>
      {advancedInputList.map((input: { name: string; id: string }, i: Key) => {
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
                value={grantTypes[activeGrantType]?.[input.id] || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e, input.id)}
              />
            </div>
          </div>
        );
      })}

      <div className="form-group">
        <Button
          text="Fetch Token"
          onClick={() => _fetchTokenOnChangeOAuth2()}
          primary
          sm
        />
      </div>

      <div
        className={'relative items-center text-input-text text-sm w-full mb-5'}
        key={'oauth2LastToken'}
      >
        <label
          className="text-app-foreground mb-1 block !pb-4"
          htmlFor={'Fetched Token'}
        >
          {'Fetched Token'}
        </label>
        <div className="!pb-4">
          <SingleLineEditor
            className={'border px-2 py-1 border-input-border'}
            type={'text'}
            value={oauth2LastToken || ''}
            disabled={true}
            height="21px"
            language={EEditorLanguage.FcText}
          />
        </div>
      </div>
    </form>
  );
};
export default OAuth2;

interface IOAuth2Comp {
  auth: IUiOAuth2;

  /** update auth value for auth type OAuth2 */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /** OAuth2 previous/ last fetched token */
  oauth2LastToken: string;

  /** fetch OAuth2 token */
  fetchTokenOnChangeOAuth2: (options: any) => void;
}
