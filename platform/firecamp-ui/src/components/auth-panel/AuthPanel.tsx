import { FC, useState, useEffect } from 'react';
import _compact from 'lodash/compact';
import cx from 'classnames';
// import isEqual from 'react-fast-compare';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { _misc, _object } from '@firecamp/utils';
import {
  EFirecampAgent,
  EAuthTypes,
  IAuthBearer,
  IAuthAwsV4,
  IOAuth1,
  IAuthDigest,
  IAuthBasic,
  IAuth,
} from '@firecamp/types';
import {
  AvailableOnElectron,
  Notes,
  Button,
  Container,
  DropdownMenu,
} from '@firecamp/ui';

import {
  // Atlassian,
  Aws,
  Basic,
  Bearer,
  Digest,
  // Hawk,
  Netrc,
  // Ntlm,
  OAuth1,
  OAuth2,
  NoAuth,
  Inherit,
} from './auths';
import { authTypeList } from './constants';

const AuthPanel: FC<IProps> = ({
  value,
  activeAuthType = EAuthTypes.None,
  allowInherit = true,
  onChangeAuthType = () => { },
  onChangeAuthValue = () => { },
  onChangeOAuth2Value = () => { },
  fetchTokenOnChangeOAuth2 = (authPayload: any) => { },
  fetchInheritedAuth = () => { },
  oauth2LastToken = '',
}) => {
  const _authTypeList = allowInherit
    ? [...authTypeList]
    : authTypeList.filter((a) => a.id !== EAuthTypes.Inherit);

  const initialState = {
    activeAuth: _authTypeList.find((type) => type.id === activeAuthType),
    authTypes: _authTypeList,
  };
  const [state, setState] = useState(initialState);
  // const [inheritedAuth, setInheritedAuth] = useState({ parentName: '' });

  useEffect(() => {
    setState((s) => ({
      ...s,
      activeAuth: _authTypeList.find((type) => type.id === activeAuthType),
    }));
  }, [activeAuthType]);

  const _renderTabBody = () => {
    switch (activeAuthType) {
      case EAuthTypes.None:
        return (
          <NoAuth
            onChangeAuthType={onChangeAuthType}
            authTypeList={_authTypeList}
          />
        );
      case EAuthTypes.Bearer:
        return (
          <Bearer auth={value as IAuthBearer} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.Basic:
        return (
          <Basic auth={value as IAuthBasic} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.Digest:
        return (
          <Digest auth={value as IAuthDigest} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.OAuth1:
        return <OAuth1 auth={value as IOAuth1} onChange={onChangeAuthValue} />;
      case EAuthTypes.OAuth2:
        if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
          return (
            <OAuth2
              auth={value}
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
      // <Hawk auth={value} onChange={onChangeAuth} />;
      case EAuthTypes.AwsV4:
        return <Aws auth={value as IAuthAwsV4} onChange={onChangeAuthValue} />;
      case EAuthTypes.Ntlm:
        return (
          <div className="p-3">
            <Notes
              type="info"
              title="Coming soon!!"
              description={`Firecamp team is building this feature and it’ll be releasing very soon. Keep us watching on <span>  <a href="https://github.com/firecamp-dev/firecamp/releases" target="_blank">
GitHub </a>, <a href="https://twitter.com/firecampdev" target="_blank">Twitter</a>, <a href="https://discord.com/invite/8hRaqhK" target="_blank"> Discord</a> </span>.`}
            />
          </div>
        );
      /* case EAuthTypes.Atlassian:
        return (
          <Atlassian
            auth={value}
            onChange={onChangeAuth}
          />
        );*/
      case EAuthTypes.Nertc:
        return <Netrc />;
        break;
      case EAuthTypes.Inherit:
        return <Inherit />;
      default:
        return allowInherit ? (
          <Inherit />
        ) : (
          <NoAuth
            onChangeAuthType={onChangeAuthType}
            authTypeList={_authTypeList}
          />
        );
    }
  };

  return (
    <Container>
      <Container.Header>
        <AuthTypesDD
          types={state.authTypes}
          name={state.activeAuth?.name}
          onSelect={(element: {
            id: EAuthTypes;
            name: string;
            enable: boolean;
          }) => onChangeAuthType(element.id)}
        />
      </Container.Header>
      <Container.Body>
        <div className="p-4 max-w-xl">{_renderTabBody()}</div>
      </Container.Body>
    </Container>
  );
};

export default AuthPanel;

const AuthTypesDD: FC<any> = ({ types, name, onSelect }) => {
  const [isOpen, toggleOpen] = useState(false);
  return (
    <div className="tab-pane-body-header flex items-center px-3 py-1 relative z-10">
      <DropdownMenu
        onOpenChange={(v) => toggleOpen(v)}
        handler={() => (
          <Button
            text={name || ''}
            classNames={{ root: "font-bold" }}
            rightIcon={
              <VscTriangleDown
                size={12}
                className={cx({ 'transform rotate-180': isOpen })}
              />
            }
            primary
            ghost
            compact
            xs
          />
        )}
        options={types}
        onSelect={onSelect}
        selected={name || ''}
        width={80}
        sm
      />
    </div>
  );
};

export interface IProps {
  /**
   * auth value
   */
  value: IAuth['value'];

  /**
   * active auth among all auth
   */
  activeAuthType: string;

  /**
   * a boolean value to state whether you want to allow to inherit auth from parent or not
   */
  allowInherit?: boolean;

  /**
   * passes updated auth value in to parent component
   */
  onChangeAuthValue: (
    authType: EAuthTypes,
    updates: { key: string; value: any } | any
  ) => void;

  /**
   * update active auth value
   */
  onChangeAuthType: (authType: EAuthTypes) => Promise<any> | any;

  /**
   * update auth value for auth type OAuth2
   */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /**
   * fetch OAuth2 token
   */
  fetchTokenOnChangeOAuth2?: (options: any) => void;

  /**
   * fetch inherited auth from parent
   */
  fetchInheritedAuth?: () => Promise<any> | any;

  oauth2LastToken?: string;
}
