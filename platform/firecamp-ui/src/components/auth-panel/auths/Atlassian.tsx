import { useState } from 'react';
import { EEditorLanguage } from '@firecamp/types';
import { SingleLineEditor } from '@firecamp/ui';

const Atlassian = () => {
  const initialState = {
    issuer: '',
    subject: '',
    audience: '',
    additionalClaims: '',
    keyId: '',
    privateKey: '',
  };

  const [state, setState] = useState(initialState);

  const { issuer, subject, audience, additionalClaims, keyId, privateKey } =
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

  const _handleChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  // const _onKeyDown = ({ key }: { key: string }) => {
  //   if (key == 'Enter') {
  //     setState(initialState);
  //   }
  // };

  return (
    <form className="fc-form grid">
      {(inputList || []).map((input, i) => {
        const { id,
          // labelFor, 
          label, type,
          // placeholder,
          value } = input;
        return (
          <div
            className={
              'relative items-center text-input-text text-sm w-full mb-5'
            }
            key={i}
          >
            <label
              className="text-app-foreground mb-1 block !pb-4"
              htmlFor={label}
            >
              {label}
            </label>
            <div className="!pb-4">
              <SingleLineEditor
                className={'border px-2 py-1 border-input-border fc-input'}
                autoFocus={i === 0}
                type={type == 'number' ? 'number' : 'text'}
                name={id}
                value={value || ''}
                height="21px"
                language={EEditorLanguage.FcText}
                onChange={(e) => _handleChange(e)}
              // onKeyDown={_onKeyDown}
              />
            </div>
          </div>
        );
      })}
    </form>
  );
};

export default Atlassian;
