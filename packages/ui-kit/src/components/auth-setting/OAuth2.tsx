import { FC, useState, useReducer, useEffect, Key } from 'react';
import {
  Dropdown,
  Button,
 
  Input,
  
} from '@firecamp/ui-kit';
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
  let { active_grant_type, grant_types } = auth;

  const grantTypes = typePayload[EAuthTypes.OAuth2]['grant_types'];
  const grantTypesPayloads =
    typePayload[EAuthTypes.OAuth2]['grant_types_payload'];
  const inputList = grantTypesPayloads?.[active_grant_type]['inputList'];
  const advancedInputList =
    grantTypesPayloads?.[active_grant_type]['advancedInputList'];

  let isDirtyState = {};
  (inputList || []).map((e: { id: any }) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  let [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);
  let [isDDOpen, toggleDD] = useState(false);

  useEffect(() => {
    setIsDirty({ type: 'setInitial', value: isDirtyState });
  }, [active_grant_type]);

  let _handleChange = (e: any, id: any) => {
    e.preventDefault();
    // console.log("id", id);
    let value = e.target.value;
    if (((inputList || []).map((e: { id: any }) => e.id) || []).includes(id)) {
      setIsDirty({ type: 'setDirty', element: id, value: true });
    }
    onChangeOAuth2Value('activeGrantTypeValue', { key: id, value });
  };

  let _onSelectGrantType = (type: { id: any }) => {
    console.log({ type });
    if (!type || !type.id) return;
    onChangeOAuth2Value('activeGrantType', type.id);
  };

  let _fetchTokenOnChangeOAuth2 = async () => {
    let activeGrantType = auth.active_grant_type;
    let activeGrantTypePayload = auth.grant_types[activeGrantType];

    fetchTokenOnChangeOAuth2(activeGrantTypePayload || {});
  };

  let _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      <div className="form-group">
        <label>Grant Type:</label>
        <Dropdown
          selected={grantTypes.find((t) => t.id === active_grant_type) || ''}
        >
          <Dropdown.Handler>
            <Button
              text={
                grantTypes.find((t) => t.id === active_grant_type)?.name || ''
              }
              sm
              secondary
              withCaret={true}
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={grantTypes}
            onSelect={(element) => _onSelectGrantType(element)}
          />
        </Dropdown>
      </div>
      {inputList.map((input: { [key: string]: string }, i) => {
        let errorMsg = '';
        if (
          isDirty[input.id] &&
          !grant_types[active_grant_type][input.id]?.length
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
            value={grant_types?.[active_grant_type]?.[input.id] || ''}
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
            value={grant_types?.[active_grant_type]?.[input.id] || ''}
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
        key={'oauth2_last_token'}
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
