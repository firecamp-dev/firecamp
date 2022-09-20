import { useState } from 'react';

import { Input } from '@firecamp/ui-kit';

const Atlassion = () => {
  let initialState = {
    issuer: '',
    subject: '',
    audience: '',
    additionalClaims: '',
    keyId: '',
    privateKey: '',
  };

  let [state, setState] = useState(initialState);

  let { issuer, subject, audience, additionalClaims, keyId, privateKey } =
    state;

  /*let [issuer, setIssuer] = useState("");
   let [subject, setSubject] = useState("");
   let [audience, setAudience] = useState("");
   let [additionalClaims, setAdditionalClaims] = useState("");
   let [keyId, setKeyId] = useState("");
   let [privateKey, setPrivateKey] = useState("");*/

  const inputList = [
    {
      id: 'issuer',
      labelFor: 'issuer',
      label: 'Issuer',
      type: 'text',
      placeholder: 'Issuer',
      value: issuer,
    },
    {
      id: 'subject',
      labelFor: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Subject',
      value: subject,
    },
    {
      id: 'audience',
      labelFor: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'Audience',
      value: audience,
    },
    {
      id: 'additionalClaims',
      labelFor: 'additionalClaims',
      label: 'Additional claims',
      type: 'text',
      placeholder: 'Additional claims',
      value: additionalClaims,
    },
    {
      id: 'keyId',
      labelFor: 'keyId',
      label: 'Key ID',
      type: 'text',
      placeholder: 'Key ID',
      value: keyId,
    },
    {
      id: 'privateKey',
      labelFor: 'privateKey',
      label: 'Private key',
      type: 'textarea',
      placeholder: 'Private key',
      value: privateKey,
    },
  ];

  let _handleChange = (e: any) => {
    e.preventDefault();
    let { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  let _onKeyDown = ({ key }:{key: string}) => {
    if (key == 'Enter') {
      setState(initialState);
    }
  };

  return (
    <form className="fc-form grid">
        {(inputList || []).map((input, i) => {
          let { id, labelFor, label, type, placeholder, value } = input;
          return (
            <Input
              key={i}
              autoFocus={i === 0}
              label={label}
              type={type}
              placeholder={placeholder}
              name={id}
              isEditor={true}
              value={value || ''}
              className="fc-input"
              onChange={(e) => _handleChange(e)}
              onKeyDown={_onKeyDown}
            />
          );
        })}
      </form>
  );
};

export default Atlassion;
