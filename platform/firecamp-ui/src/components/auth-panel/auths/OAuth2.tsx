import { FC, useState, useEffect, Key } from 'react';
import { Button, Input, DropdownMenu } from '@firecamp/ui';
// @ts-ignore
import { EAuthTypes, IUiOAuth2, TPlainObject } from '@firecamp/types';
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

  const [dirtyInputs, setDirtyInputs] = useState<TPlainObject>(
    // @ts-ignore
    inputList.reduce((p, n) => {
      return { ...p, [n.id]: false };
    }, {})
  );
  const [isDDOpen, toggleDD] = useState(false);

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
          handleRenderer={() => (
            <Button
              text={
                grantTypesOptions.find((t) => t.id === activeGrantType)?.name ||
                ''
              }
              secondary
              withCaret
              sm
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
            value={grantTypes[activeGrantType]?.[input.id] || ''}
            error={errorMsg}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}
      <label className="fc-form-field-group m-5">
        Advanced
        <span>optional</span>
      </label>
      {advancedInputList.map((input: { name: string; id: string }, i: Key) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={setInputType(input.id)}
            placeholder={input.name}
            value={grantTypes[activeGrantType]?.[input.id] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor
          />
        );
      })}

      <div className="form-group">
        <Button
          text="Fetch Token"
          onClick={() => _fetchTokenOnChangeOAuth2()}
          primary
        />
      </div>

      <Input
        key={'oauth2LastToken'}
        label={'Fetched Token'}
        type={'text'}
        value={oauth2LastToken || ''}
        disabled={true}
        isEditor
      />
    </form>
  );
};
export default OAuth2;

interface IOAuth2Comp {
  auth: IUiOAuth2;

  /** update auth value for auth tyoe OAuth2 */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /** OAuth2 previous/ last fetched token */
  oauth2LastToken: string;

  /** fetch OAuth2 token */
  fetchTokenOnChangeOAuth2: (options: any) => void;
}
