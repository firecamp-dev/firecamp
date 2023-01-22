import { FC, useReducer } from 'react';
import { Button, Dropdown, Input } from '@firecamp/ui-kit';
import { IAuthDigest, EAuthTypes } from '@firecamp/types';
import { authUiFormState } from './constants';

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

  let isDirtyState = {};
  (inputList || []).map((e) => {
    isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
  });

  const reducer = (
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

  const [isDirty, setIsDirty] = useReducer(reducer, isDirtyState);

  const _handleChange = (e: any, id: string) => {
    e.preventDefault();
    const value = e.target.value;
    if (id === 'username' || id === 'password') {
      setIsDirty({ type: 'setDirty', element: id, value: true });
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
          isDirty[input.id] &&
          !auth?.[input.id as keyof IAuthDigest]?.length
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
        <span>optional</span>
      </label>
      <div className="form-group">
        <label>Algorithm:</label>

        <Dropdown
          selected={auth['algorithm'] || 'MD5'} //defalut "MD5"
        >
          <Dropdown.Handler>
            <Button text={auth['algorithm'] || 'MD5'} secondary withCaret sm />
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
