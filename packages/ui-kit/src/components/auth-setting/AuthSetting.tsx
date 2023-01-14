import { FC, useState, Fragment, useEffect, useReducer } from 'react';
import _compact from 'lodash/compact';
import equal from 'deep-equal';
import { _misc, _object } from '@firecamp/utils';
import { EFirecampAgent, EAuthTypes, IAuthUiState } from '@firecamp/types';
import {
  AvailableOnElectron,
  Notes,
  Dropdown,
  Button,
  Container,
} from '@firecamp/ui-kit';

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
} from './index';
import { authTypeList, authUiState } from './constants';
import { IAuthSetting } from './interfaces/AuthSetting.interfaces';

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

  /** to generate payload with auth types for which who's belongs to inpux box input */
  let authTypesKeys: any = {};
  for (let k in authUiState) {
    let keys: any[] = [];
    //@ts-ignore
    const authUi = authUiState[k]
    if (authUi.inputList) {
      authUi.inputList.map((i: { id: any }) => {
        keys.push(i.id || '');
      });
    }
    if (authUi.advancedInputList) {
      authUi.advancedInputList.map((i: { id: any }) => {
        keys.push(i.id || '');
      });
    }
    authTypesKeys = Object.assign({}, authTypesKeys, { [k]: keys });
  }

  const reducer = (
    state: { isAuthTypesDDOpen: any; activeAuthType: any; authTypes: any },
    action: { type: any; value: any }
  ) => {
    switch (action.type) {
      case 'toggleAuthTypesDD':
        return {
          ...state,
          isAuthTypesDDOpen: !state.isAuthTypesDDOpen,
        };
        break;
      case 'setActiveAuthType':
        if (action.value !== state.activeAuthType) {
          return {
            ...state,
            activeAuthType: action.value,
          };
        } else {
          return state;
        }
      case 'authTypes':
        return {
          ...state,
          authTypes: action.value,
        };
        break;
    }
  };

  const _isApiAuthEmpty = (authObj: { [x: string]: any }) => {
    if (!authObj) return;
    let authPayload = {},
      isAuthEmpty = true;

    for (let key in authObj) {
      let isKeyEmpty = true;
      if (key !== EAuthTypes.OAuth2) {
        let i: any,
          payload = [];

        for (i in authObj[key]) {
          //Check for those keys which is having Inputbox
          if (
            authTypesKeys[key] &&
            authTypesKeys[key].includes(i) &&
            authObj[key][i] &&
            authObj[key][i].length
          ) {
            isKeyEmpty = false;
            isAuthEmpty = false;
            break;
          }
        }

        authPayload = Object.assign(authPayload, { [key]: isKeyEmpty });
      } else {
        let oauth2Payload = authObj[EAuthTypes.OAuth2].grantTypes;

        let i;
        for (i in oauth2Payload) {
          let gtKey;
          for (gtKey in oauth2Payload[i]) {
            if (gtKey !== 'grant_type') {
              if (oauth2Payload?.[i]?.[gtKey]?.length) {
                isKeyEmpty = false;
                isAuthEmpty = false;
                break;
              }
            }
          }
        }
        authPayload = Object.assign(authPayload, { [key]: isKeyEmpty });
      }
    }

    return isAuthEmpty
      ? { isEmpty: true }
      : Object.assign(authPayload, { isEmpty: false });
  };

  const _generateAuthTypesDD = (authPayload: IAuthUiState) => {
    const isEmptyApiAuth = _isApiAuthEmpty(authPayload || {});
    const authTypes = _compact(
      _authTypeList.map((type, i) => {
        if (type.enable) {
          return _object.omit(type, ['enable']);
        }
      })
    );
    const authTypesPayload = authTypes.map((v: any, k) => {
      if (v.id !== EAuthTypes.Hawk) {
        const isEmpty = isEmptyApiAuth[v.id] as Boolean;
        return Object.assign(v, {
          isEmpty:
            v.id !== EAuthTypes.None
              ? Object.keys(isEmptyApiAuth).includes(v.id)
                ? isEmpty
                : true
              : true,
        });
      }
    });

    // console.log({ authTypesPayload });
    return authTypesPayload;
  };

  const initialState = {
    isAuthTypesDDOpen: false,
    activeAuthType: _authTypeList.find((type) => type.id === activeAuth),
    authTypes: _generateAuthTypesDD(authUiState),
  };

  const [state, setState] = useReducer(reducer, initialState);
  const [inheitedAuth, setInheitedAuth] = useState({ parentName: '' });
  const { isAuthTypesDDOpen, activeAuthType, authTypes } = state;

  useEffect(() => {
    setState({
      type: 'setActiveAuthType',
      value: _authTypeList.find((type) => type.id === activeAuth),
    });
    const _fetchInherit = async () => {
      if (activeAuth === EAuthTypes.Inherit) {
        let inherited = await fetchInheritedAuth();
        if (inherited && inherited !== inheitedAuth) {
          setInheitedAuth(inherited);
        }
      }
    };
    _fetchInherit();
  }, [activeAuth]);

  useEffect(() => {
    const updatedAuthTypes = _generateAuthTypesDD(authUiState);
    if (!equal(updatedAuthTypes, authTypes)) {
      setState({
        type: 'authTypes',
        value: authTypes,
      });
    }
  }, [authUiState]);

  const _onchangeActiveAuth = async (authType: EAuthTypes) => {
    try {
      const authData = await onChangeActiveAuth(authType);
      if (
        authData &&
        authType === EAuthTypes.Inherit &&
        !equal(authData, inheitedAuth)
      ) {
        setInheitedAuth(authData);
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
        break;
      case EAuthTypes.Bearer:
        return (
          <Bearer auth={authUiState[EAuthTypes.Bearer]} onChange={onChangeAuth} />
        );
        break;
      case EAuthTypes.Basic:
        return <Basic auth={authUiState[EAuthTypes.Basic]} onChange={onChangeAuth} />;
        break;
      case EAuthTypes.Digest:
        return (
          <Digest auth={authUiState[EAuthTypes.Digest]} onChange={onChangeAuth} />
        );
        break;
      case EAuthTypes.OAuth1:
        return (
          <OAuth1 auth={authUiState[EAuthTypes.OAuth1]} onChange={onChangeAuth} />
        );
        break;
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
        break;
      case EAuthTypes.Hawk:
        return <></>;
        // <Hawk auth={authUiState[EAuthTypes.Hawk]} onChange={onChangeAuth} />;
        break;
      case EAuthTypes.Aws4:
        return <Aws auth={authUiState[EAuthTypes.Aws4]} onChange={onChangeAuth} />;
        break;
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
        break;
      /* case EAuthTypes.Atlassian:
        return (
          <Atlassion
            auth={authUiState[EAuthTypes.Atlassian]}
            onChange={onChangeAuth}
          />
        );
        break; */
      case EAuthTypes.Nertc:
        return <Netrc />;
        break;
      case EAuthTypes.Inherit:
        return (
          <Inherit
            openParentAuthModal={openParentAuthModal}
            parentName={inheitedAuth?.parentName || ''}
            message={inheritAuthMessage}
          />
        );
        break;
      default:
        return allowInherit ? (
          <Inherit
            openParentAuthModal={openParentAuthModal}
            parentName={inheitedAuth?.parentName || ''}
            message={inheritAuthMessage}
          />
        ) : (
          <NoAuth
            onChangeActiveAuth={_onchangeActiveAuth}
            authTypeList={_authTypeList}
          />
        );
        break;
    }
  };

  const _onToggleAuthTypesDD = () => {
    setState({
      type: 'toggleAuthTypesDD',
      value: !state.isAuthTypesDDOpen,
    });
  };

  const _onSelectAuthType = (element: { id: EAuthTypes }) => {
    setState({ type: 'setActiveAuthType', value: element });
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
                ghost
                transparent
                withCaret
                primary
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
