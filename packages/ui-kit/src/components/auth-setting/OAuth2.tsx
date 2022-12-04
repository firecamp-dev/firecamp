import { FC, useState, useReducer, useEffect, Key } from 'react';
import { Dropdown, Button, Input } from '@firecamp/ui-kit';
import { EAuthTypes, IUiOAuth2 } from '@firecamp/types';
import { typePayload } from './constants';

const _setDirty = (
  state: any,
  action: { type: any; element?: any; value: any }
) => {
  switch (action.type) {
    case 'setDirty':
      return {
        ...state,
        [action.element]: action.value,
      };

    case 'setInitial':
      return {
        ...state,
        ...action.value,
      };
      break;
  }
};

const OAuth2: FC<IOAuth2Comp> = ({
  auth,
  onChangeOAuth2Value = () => {},
  oauth2LastToken = '',
  fetchTokenOnChangeOAuth2 = () => {},
}) => {
  let { activeGrantType, grantTypes } = auth;

  const grantTypesOptions = typePayload[EAuthTypes.OAuth2]['grantTypes'];
  const grantTypesPayloads =
    typePayload[EAuthTypes.OAuth2]['grantTypesPayload'];
  const inputList = grantTypesPayloads?.[activeGrantType]['inputList'];
  const advancedInputList =
    grantTypesPayloads?.[activeGrantType]['advancedInputList'];

  let isDirtyState = {};
  (inputList || []).map((e: { id: any }) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  const [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);
  const [isDDOpen, toggleDD] = useState(false);

  useEffect(() => {
    setIsDirty({ type: 'setInitial', value: isDirtyState });
  }, [activeGrantType]);

  const _handleChange = (e: any, id: any) => {
    e.preventDefault();
    // console.log("id", id);
    const value = e.target.value;
    if (((inputList || []).map((e: { id: any }) => e.id) || []).includes(id)) {
      setIsDirty({ type: 'setDirty', element: id, value: true });
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
        <Dropdown
          selected={
            grantTypesOptions.find((t) => t.id === activeGrantType) || ''
          }
        >
          <Dropdown.Handler>
            <Button
              text={
                grantTypesOptions.find((t) => t.id === activeGrantType)?.name ||
                ''
              }
              sm
              secondary
              withCaret={true}
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={grantTypesOptions}
            onSelect={(element) => _onSelectGrantType(element)}
          />
        </Dropdown>
      </div>
      {inputList.map((input: { [key: string]: string }, i) => {
        let errorMsg = '';
        if (
          isDirty[input.id] &&
          !grantTypes[activeGrantType][input.id]?.length
        ) {
          errorMsg = `${input.name} can not be empty`;
        }
        return (
          <Input
            key={i}
            autoFocus={i === 0}
            label={input.name}
            type={
              input.id === 'password'
                ? 'password'
                : input.id === 'timestamp'
                ? 'number'
                : 'text'
            }
            placeholder={input.name}
            name={input.id}
            value={grantTypes[activeGrantType]?.[input.id] || ''}
            error={errorMsg}
            /* style={{
            borderColor:
              isDirty[input.id] && errorMsg
                ? 'red'
                : isDirty[input.id] && 'green',
          }} */
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
          />
        );
      })}
      <label className="fc-form-field-group">
        Advanced
        <span>(optional)</span>
      </label>
      {advancedInputList.map((input: { name: string; id: string }, i: Key) => {
        return (
          <Input
            key={i}
            label={input.name}
            type={
              input.id === 'password'
                ? 'password'
                : input.id === 'timestamp'
                ? 'number'
                : 'text'
            }
            placeholder={input.name}
            value={grantTypes[activeGrantType]?.[input.id] || ''}
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
          />
        );
      })}

      <div className="form-group">
        <Button
          text="Fetch Token"
          primary
          onClick={() => _fetchTokenOnChangeOAuth2()}
        />
      </div>

      <Input
        key={'oauth2LastToken'}
        label={'Fetched Token'}
        type={'text'}
        value={oauth2LastToken || ''}
        disabled={true}
        isEditor={true}
      />
    </form>
  );
};

export default OAuth2;

interface IOAuth2Comp {
  auth: IUiOAuth2;

  /**
   * Update auth value for auth tyoe OAuth2
   */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /**
   * OAuth2 previous/ last fetched token
   */
  oauth2LastToken: string;

  /**
   * Fetch OAuth2 token
   */
  fetchTokenOnChangeOAuth2: (options: any) => void;
}
