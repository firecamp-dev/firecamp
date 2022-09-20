import { FC, useReducer } from 'react';

import { Input } from '@firecamp/ui-kit';
import { typePayload } from './constants';
import { IAuthBasic, EAuthTypes } from '@firecamp/types'

const Basic: FC<IBasic> = ({ auth , onChange = () => { } }) => {
const inputList = typePayload[EAuthTypes.Basic]['inputList'];

let isDirtyState = {};
(inputList || []).map((e) => {
  isDirtyState = Object.assign(isDirtyState, { [e.id]: false });
});

let _setDirty = (state: any, action: { type: any; element: any; value: any; }) => {
  switch (action.type) {
    case 'setDirty':
      return {
        ...state,
        [action.element]: action.value,
      };
  }
};

let [isDirty, setIsDirty] = useReducer(_setDirty, isDirtyState);

const reducer = (state: any, action: { type: any; element: any; value: any; }) => {
  switch (action.type) {
    case 'setDirty':
      return {
        ...state,
        [action.element]: action.value,
      };
      break;
  }
};

let _handleChange = (e: any, id: string) => {
  e.preventDefault();
  let { value } = e.target;
  setIsDirty({ type: 'setDirty', element: id, value: true });
  onChange(EAuthTypes.Basic, { key: id, value });
  // console.log("value", value, id)
};

let _handleSubmit = (e: { preventDefault: () => any; }) => {
  e && e.preventDefault();
};

return (
  <form className="fc-form grid" onSubmit={_handleSubmit}>
  {(inputList || []).map((input, i) => {
    let errorMsg = '';
    if (isDirty[input.id] && !auth?.[input.id]?.length) {
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
        value={auth?.[input.id] || ''}
        error={isDirty[input.id] && errorMsg ? errorMsg : ''}
        /* style={{
          borderColor:
            isDirty[input.id] && errorMsg
              ? 'red'
              : isDirty[input.id] && 'green',
        }} */
        onChange={(e) => _handleChange(e, input.id)}
        isEditor={true}
      /*onKeyDown={_onKeyDown}*/
      />
    );
  })}
</form>
);
};

export default Basic;

interface IBasic {
  auth: IAuthBasic,
  onChange: ( authType: EAuthTypes.Basic,
    updates: { key: string, value: any }) => void
}
