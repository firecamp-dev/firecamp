import { FC, useReducer } from 'react';
import {
  Button,
  Dropdown,
 
  
  Input,
} from '@firecamp/ui-kit';
import { IAuthDigest, EAuthTypes } from '@firecamp/types';
import { typePayload } from './constants';

const Digest: FC<IDigest> = ({ auth = {}, onChange = () => {} }) => {
  const inputList = typePayload[EAuthTypes.Digest].inputList;
  const advancedInputList = typePayload[EAuthTypes.Digest].advancedInputList;
  const algorithmList = (
    typePayload?.[EAuthTypes.Digest].algorithmList || []
  ).map((i) => ({ name: i }));

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  let reducer = (
    state: any,
    action: { type: any; element: any; value: any }
  ) => {
    switch (action.type) {
      case 'setDirty':
        return {
          ...state,
          [action.element]: action.value,
        };
    }
  };

  let [isDirty, setIsDirty] = useReducer(reducer, isDirtyState);

  let _handleChange = (e: any, id: string) => {
    e.preventDefault();
    let value = e.target.value;
    if (id === 'username' || id === 'password') {
      setIsDirty({ type: 'setDirty', element: id, value: true });
    }
    onChange(EAuthTypes.Digest, { key: id, value });
    // console.log("value", value, id)
  };

  let _handleSubmit = (e: { preventDefault: () => any }) => {
    e && e.preventDefault();
  };

  let _onSelectAlgorithm = (algorithm: string) => {
    if (!algorithm) return;

    onChange(EAuthTypes.Digest, {
      key: 'algorithm',
      value: algorithm,
    });
  };

  return (
    <form className="fc-form grid" onSubmit={_handleSubmit}>
      {(inputList || []).map((input, i) => {
        let errorMsg = '';
        if (isDirty[input.id] && !auth?.[input.id as keyof IAuthDigest]?.length) {
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
            name={input.name}
            value={auth?.[input.id as keyof IAuthDigest] || ''}
            error={errorMsg}
            /* style={{
            borderColor:
              isDirty[input.id] && errorMsg
                ? 'red'
                : isDirty[input.id] && 'green',
          }} */
            onChange={(e) => _handleChange(e, input.id)}
            isEditor={true}
            // onKeyDown={_onKeyDown}
          />
        );
      })}

      <label className="fc-form-field-group">
        Advanced
        <span>(optional)</span>
      </label>
      <div className="form-group">
        <label>Algorithm:</label>

        <Dropdown
          selected={auth['algorithm'] || 'MD5'} //defalut "MD5"
        >
          <Dropdown.Handler>
            <Button
              text={auth['algorithm'] || 'MD5'}
              sm
              secondary
              withCaret={true}
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={algorithmList}
            onSelect={(algorithm) => {
              _onSelectAlgorithm(algorithm?.name);
            }}
          />
        </Dropdown>
      </div>
      {(advancedInputList || []).map((input, i) => {
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
