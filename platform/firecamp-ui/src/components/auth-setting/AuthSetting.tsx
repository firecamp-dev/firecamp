import { FC, useState, useEffect } from 'react';
import _compact from 'lodash/compact';
import isEqual from 'react-fast-compare';
import { _misc, _object } from '@firecamp/utils';
import { EFirecampAgent, EAuthTypes } from '@firecamp/types';
import {
  AvailableOnElectron,
  Notes,
  Dropdown,
  Button,
  Container,
} from '@firecamp/ui';

import {
  // Atlassion,
  Aws,
  Basic,
  Bearer,
  Digest,
  // Hawk,
  Netrc,
  Ntlm,
  OAuth1,
  OAuth2,
  NoAuth,
  Inherit,
} from './auths';
import { authTypeList } from './constants';
import { IAuthSetting } from './interfaces/AuthSetting.interface';

const AuthSetting: FC<IAuthSetting> = ({
  authUiState,
  activeAuth = '',
  allowInherit = true,
  inheritAuthMessage = '',
  onChangeAuth = () => {},
  onChangeActiveAuth = () => {},
  onChangeOAuth2Value = () => {},
  openParentAuthModal = () => {},
  fetchTokenOnChangeOAuth2 = (authPayload: any) => {},
  fetchInheritedAuth = () => {},
  oauth2LastToken = '',
}) => {
  const _authTypeList = allowInherit
    ? [...authTypeList]
    : authTypeList.filter((a) => a.id !== EAuthTypes.Inherit);

  /** to generate payload with auth types for which who's belongs to input box input */
  // let authTypesKeys: any = {};
  // for (let k in authUiState) {
  //   let keys: any[] = [];
  //   //@ts-ignore
  //   const authUi = authUiState[k];
  //   if (authUi.inputList) {
  //     authUi.inputList.map((i: { id: any }) => {
  //       keys.push(i.id || '');
  //     });
  //   }
  //   if (authUi.advancedInputList) {
  //     authUi.advancedInputList.map((i: { id: any }) => {
  //       keys.push(i.id || '');
  //     });
  //   }
  //   authTypesKeys = Object.assign({}, authTypesKeys, { [k]: keys });
  // }


  const initialState = {
    isAuthTypesDDOpen: false,
    activeAuthType: _authTypeList.find((type) => type.id === activeAuth),
    authTypes: _authTypeList,
  };
  const [state, setState] = useState(initialState);
  const [inheritedAuth, setInheritedAuth] = useState({ parentName: '' });
  const { isAuthTypesDDOpen, activeAuthType, authTypes } = state;

  useEffect(() => {
    setState((s) => ({
      ...s,
      activeAuthType: _authTypeList.find((type) => type.id === activeAuth),
    }));

    const _fetchInherit = async () => {
      if (activeAuth === EAuthTypes.Inherit) {
        let inherited = await fetchInheritedAuth();
        if (inherited && inherited !== inheritedAuth) {
          setInheritedAuth(inherited);
        }
      }
    };
    _fetchInherit();
  }, [activeAuth]);

  const _onchangeActiveAuth = async (authType: EAuthTypes) => {
    try {
      const authData = await onChangeActiveAuth(authType);
      if (
        authData &&
        authType === EAuthTypes.Inherit &&
        !isEqual(authData, inheritedAuth)
      ) {
        setInheritedAuth(authData);
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const _renderTabBody = () => {
    switch (activeAuth) {
      case EAuthTypes.None:
        return (
          <NoAuth
            onChangeActiveAuth={_onchangeActiveAuth}
            authTypeList={_authTypeList}
          />
        );
      case EAuthTypes.Bearer:
        return (
          <Bearer
            auth={authUiState[EAuthTypes.Bearer]}
            onChange={onChangeAuth}
          />
        );
      case EAuthTypes.Basic:
        return (
          <Basic auth={authUiState[EAuthTypes.Basic]} onChange={onChangeAuth} />
        );
      case EAuthTypes.Digest:
        return (
          <Digest
            auth={authUiState[EAuthTypes.Digest]}
            onChange={onChangeAuth}
          />
        );
      case EAuthTypes.OAuth1:
        return (
          <OAuth1
            auth={authUiState[EAuthTypes.OAuth1]}
            onChange={onChangeAuth}
          />
        );
      case EAuthTypes.OAuth2:
        if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
          return (
            <OAuth2
              auth={authUiState[EAuthTypes.OAuth2]}
              oauth2LastToken={oauth2LastToken}
              onChangeOAuth2Value={onChangeOAuth2Value}
              fetchTokenOnChangeOAuth2={fetchTokenOnChangeOAuth2}
            />
          );
        } else {
          return <AvailableOnElectron name="OAuth2" />;
        }
      case EAuthTypes.Hawk:
        return <></>;
      // <Hawk auth={authUiState[EAuthTypes.Hawk]} onChange={onChangeAuth} />;
      case EAuthTypes.Aws4:
        return (
          <Aws auth={authUiState[EAuthTypes.Aws4]} onChange={onChangeAuth} />
        );
      case EAuthTypes.Ntlm:
        return (
          <div className="p-3">
            <Notes
              type="info"
              title="Coming soon!!"
              description={`Firecamp team is building this feature and it’ll be releasing very soon. Keep us watching on <span>  <a href="https://github.com/firecamp-io/firecamp/releases" target="_blank">
Github </a>, <a href="https://twitter.com/FirecampHQ" target="_blank">Twitter</a>, <a href="https://discord.com/invite/8hRaqhK" target="_blank"> Discord</a> </span>.`}
            />
          </div>
        );
      /* case EAuthTypes.Atlassian:
        return (
          <Atlassion
            auth={authUiState[EAuthTypes.Atlassian]}
            onChange={onChangeAuth}
          />
        );*/
      case EAuthTypes.Nertc:
        return <Netrc />;
        break;
      case EAuthTypes.Inherit:
        return (
          <Inherit
            openParentAuthModal={openParentAuthModal}
            parentName={inheritedAuth?.parentName || ''}
            message={inheritAuthMessage}
          />
        );
      default:
        return allowInherit ? (
          <Inherit
            openParentAuthModal={openParentAuthModal}
            parentName={inheritedAuth?.parentName || ''}
            message={inheritAuthMessage}
          />
        ) : (
          <NoAuth
            onChangeActiveAuth={_onchangeActiveAuth}
            authTypeList={_authTypeList}
          />
        );
    }
  };

  const _onToggleAuthTypesDD = () => {
    setState((s) => ({
      ...s,
      isAuthTypesDDOpen: !state.isAuthTypesDDOpen,
    }));
  };

  const _onSelectAuthType = (element: {
    id: EAuthTypes;
    name: string;
    enable: boolean;
  }) => {
    setState((s) => ({ ...s, activeAuthType: element }));
    _onchangeActiveAuth(element.id);
  };

  return (
    <Container>
      <Container.Header>
        <div className="tab-pane-body-header flex items-center px-3 py-1 relative z-10">
          <Dropdown
            isOpen={isAuthTypesDDOpen}
            // style={{ width: '115px' }}
            selected={activeAuthType?.name || ''}
            onToggle={() => _onToggleAuthTypesDD()}
          >
            <Dropdown.Handler>
              <Button
                text={activeAuthType?.name || ''}
                className="font-bold"
                transparent
                withCaret
                primary
                ghost
                xs
              />
            </Dropdown.Handler>
            <Dropdown.Options
              options={authTypes}
              onSelect={(element) => _onSelectAuthType(element)}
            />
          </Dropdown>
        </div>
      </Container.Header>
      <Container.Body>
        <div className="p-4 max-w-xl">{_renderTabBody()}</div>
      </Container.Body>
    </Container>
  );
};

export default AuthSetting;
