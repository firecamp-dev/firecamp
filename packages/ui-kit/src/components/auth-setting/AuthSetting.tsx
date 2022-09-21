import { FC, useState, Fragment, useEffect, useReducer } from 'react';
import _compact from 'lodash/compact';
import equal from 'deep-equal';

import {
  Atlassion,
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

import { typeList as authTypesList, typePayload } from './constants';
import {
  AvailableOnElectron,
  Notes,
  Dropdown,
  Button,
  EButtonSize,
  EButtonColor,
  Container,
} from '@firecamp/ui-kit';

import { IAuthSetting } from './interfaces/AuthSetting.interfaces';
import { _misc, _object } from '@firecamp/utils';
import { EFirecampAgent, EAuthTypes, IUiAuth } from '@firecamp/types';

const AuthSetting: FC<IAuthSetting> = ({
  auth = {},
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
  //TODO: undo code for HAWK
  if (activeAuth === EAuthTypes.Hawk || !activeAuth) {
    activeAuth = EAuthTypes.Inherit;
  }

  let typeList = authTypesList || [];

  if (!allowInherit) {
    typeList = typeList.filter((a) => a.id !== EAuthTypes.Inherit);
  }

  /**
   * To generate payload with auth types for which who's belongs to inpux box input
   * @type {{}}
   */
  let auth_types_keys: any = {};
  if (typePayload && Object.keys(typePayload).length) {
    let k: any;
    for (k in typePayload) {
      let keys: any[] = [];
      if (typePayload[k].inputList) {
        typePayload[k].inputList.map((i: { id: any }) => {
          keys.push(i.id || '');
        });
      }
      if (typePayload[k].advancedInputList) {
        typePayload[k].advancedInputList.map((i: { id: any }) => {
          keys.push(i.id || '');
        });
      }
      auth_types_keys = Object.assign({}, auth_types_keys, { [k]: keys });
    }
  }

  let reducer = (
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

  let _isAPIAuthEmpty = (authObj: { [x: string]: any }) => {
    if (!authObj) return;
    let authPayload = {},
      key: string,
      isAuthEmpty = true;

    for (key in authObj) {
      let isKeyEmpty = true;
      if (key !== EAuthTypes.OAuth2) {
        let i: any,
          payload = [];

        for (i in authObj[key]) {
          //Check for those keys which is having Inputbox
          if (
            auth_types_keys[key] &&
            auth_types_keys[key].includes(i) &&
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
        let oauth2Payload = authObj[EAuthTypes.OAuth2].grant_types;

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

  let _generateAuthTypesDD = (authPayload: IUiAuth) => {
    let isEmptyAPIAuth = _isAPIAuthEmpty(authPayload || {});
    let authTypes = _compact(
      typeList.map((type, i) => {
        if (type.enable) {
          return _object.omit(type, ['enable']);
        }
      })
    );
    let authTypesPayload = authTypes.map((v: any, k) => {
      if (v.id !== EAuthTypes.Hawk) {
        let isEmpty = isEmptyAPIAuth[v.id] as Boolean;
        return Object.assign(v, {
          isEmpty:
            v.id !== EAuthTypes.NoAuth
              ? Object.keys(isEmptyAPIAuth).includes(v.id)
                ? isEmpty
                : true
              : true,
        });
      }
    });

    // console.log({ authTypesPayload });

    return authTypesPayload;
  };

  let initialState = {
    isAuthTypesDDOpen: false,
    activeAuthType: typeList.find((type) => type.id === activeAuth),
    authTypes: _generateAuthTypesDD(auth),
  };

  let [state, setState] = useReducer(reducer, initialState);
  let [inheitedAuth, setInheitedAuth] = useState({ parent_name: '' });

  let { isAuthTypesDDOpen, activeAuthType, authTypes } = state;

  useEffect(() => {
    setState({
      type: 'setActiveAuthType',
      value: typeList.find((type) => type.id === activeAuth),
    });
    let _fetchInherit = async () => {
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
    let updatedAuthTypes = _generateAuthTypesDD(auth);
    if (!equal(updatedAuthTypes, authTypes)) {
      setState({
        type: 'authTypes',
        value: authTypes,
      });
    }
  }, [auth]);

  let _onchangeActiveAuth = async (authType: EAuthTypes) => {
    try {
      let authData = await onChangeActiveAuth(authType);

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

  let _renderTabBody = () => {
    switch (activeAuth || EAuthTypes.Inherit) {
      case EAuthTypes.NoAuth:
        return (
          <NoAuth
            onChangeActiveAuth={_onchangeActiveAuth}
            typeList={typeList}
          />
        );
        break;
      case EAuthTypes.Bearer:
        return (
          <Bearer auth={auth[EAuthTypes.Bearer]} onChange={onChangeAuth} />
        );
        break;
      case EAuthTypes.Basic:
        return <Basic auth={auth[EAuthTypes.Basic]} onChange={onChangeAuth} />;
        break;
      case EAuthTypes.Digest:
        return (
          <Digest auth={auth[EAuthTypes.Digest]} onChange={onChangeAuth} />
        );
        break;
      case EAuthTypes.OAuth1:
        return (
          <OAuth1 auth={auth[EAuthTypes.OAuth1]} onChange={onChangeAuth} />
        );
        break;
      case EAuthTypes.OAuth2:
        if (_misc.firecampAgent() === EFirecampAgent.desktop) {
          return (
            <OAuth2
              auth={auth[EAuthTypes.OAuth2]}
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
        // <Hawk auth={auth[EAuthTypes.Hawk]} onChange={onChangeAuth} />;
        break;
      case EAuthTypes.Aws4:
        return <Aws auth={auth[EAuthTypes.Aws4]} onChange={onChangeAuth} />;
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
            auth={auth[EAuthTypes.Atlassian]}
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
            parentName={inheitedAuth?.parent_name || ''}
            message={inheritAuthMessage}
          />
        );
        break;
      default:
        return allowInherit ? (
          <Inherit
            openParentAuthModal={openParentAuthModal}
            parentName={inheitedAuth?.parent_name || ''}
            message={inheritAuthMessage}
          />
        ) : (
          <NoAuth
            onChangeActiveAuth={_onchangeActiveAuth}
            typeList={typeList}
          />
        );
        break;
    }
  };

  let _onToggleAuthTypesDD = () => {
    setState({
      type: 'toggleAuthTypesDD',
      value: !state.isAuthTypesDDOpen,
    });
  };

  let _onSelectAuthType = (element: { id: EAuthTypes }) => {
    if (!element || !element.id) return;

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
                xs
                className="font-bold"
                ghost={true}
                transparent={true}
                withCaret={true}
                primary
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
