import { FC, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import { AuthSetting, Button, Container, TabHeader, Notes } from '@firecamp/ui';
import { EAuthTypes, IAuth, ICollection, IFolder, TId } from '@firecamp/types';
import { _env, _object, _auth, _array } from '@firecamp/utils';

const Auth: FC<IAuthSettingUi> = ({
  entityType = 'collection',
  entity,
  isRequesting = false,
  onUpdate = () => {},
  onChange = (key: string, value: any) => {},
}) => {
  const itemId: TId = useMemo(() => entity?.__ref.id, [entity]);
  const { auth } = entity;
  const _onChangeAuth = (type, payload) => {
    if (!type || !payload || !payload.key) return;

    onChange('auth', {
      ...auth,
      [type]: {
        ...auth[type],
        [payload.key]: payload.value || '',
      },
    });
  };

  const _onChangeOAuth2Value = (updated = '', payload) => {
    // console.log({ updated, payload });
    if (updated === 'activeGrantTypeValue') {
      const { key, value } = payload;
      const type = auth[EAuthTypes.OAuth2].activeGrantType;

      onChange('auth', {
        ...auth,
        [EAuthTypes.OAuth2]: Object.assign(auth[EAuthTypes.OAuth2], {
          grantTypes: {
            ...auth[EAuthTypes.OAuth2].grantTypes,
            [type]: Object.assign(auth[EAuthTypes.OAuth2].grantTypes[type], {
              [key]: value,
            }),
          },
        }),
      });
    }

    if (updated === 'activeGrantType') {
      onChange('auth', {
        ...auth,
        [EAuthTypes.OAuth2]: Object.assign(auth[EAuthTypes.OAuth2], {
          activeGrantType: payload,
        }),
      });
    }
  };

  let _fetchTokenOnChangeOAuth2 = async (oauth2Options = {}) => {
    console.log({ oauth2Options });
    /*  try {
      const defaultGlobalEnv = EvnProvider_Instance.getDefaultEnvironment(
        'global'
      );
      let defaultProjectEnv = EvnProvider_Instance.getDefaultEnvironment(
        itemId
      );

      let mergedVars = EvnProvider_Instance.getVariables({
        globalEnvID: defaultGlobalEnv || '',
        itemId: itemId || '',
        collectionEnvID: defaultProjectEnv || ''
      });

      if (Object.keys(oauth2Options).length) {
        await _getAuthHeaders
          .getOAuth2Token(_env.applyVariablesInSource<any>(mergedVars, oauth2Options))
          .then(async token => {
            console.log({ token });

            setAuthDetails(ps => {
              return {
                ...ps,
                oauth2LastFetchedToken: token
              };
            });
            F.notification.success(
              'OAuth2 authorization token fetched successfully!!',
              {
                labels: { success: 'OAuth2 token' }
              }
            );
          });
      }
    } catch (e) {
      console.log('oAuth2 error: ', e);
    } */
  };

  let _onUpdate = async (e) => {
    if (e) e.preventDefault;
    let updates: any = {},
      updatedAuth = _object.difference(auth, entity.auth) || {};
    let updatedKeys = Object.keys(updatedAuth) || [];
    // console.log({ updatedKeys });
    if (!_array.isEmpty(updatedKeys))
      updates['auth'] = _object.pick(auth, updatedKeys);

    try {
      if (activeAuthType !== entity.__meta.activeAuthType) {
        updates = {
          ...updates,
          meta: { activeAuthType: activeAuthType },
        };
      }

      if (
        _object.size(updates) &&
        (_object.size(updates.auth) || _object.size(updates.__meta))
      ) {
        onUpdate(updates);
      }
    } catch (error) {
      console.error({
        error,
        API: 'update collection/ folder',
        updates,
      });
    }
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Notes className="m-6" description=" Coming Soon..." />
      </Container.Body>
    </Container>
  );
  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="p-2">
          <AuthSetting
            key={itemId}
            auth={auth || {}}
            activeAuth={auth.type || EAuthTypes.None || ''}
            onChangeAuth={_onChangeAuth}
            onChangeActiveAuth={(activeAuth = EAuthTypes.None) => {
              onChange('meta', { activeAuthType: activeAuth });
            }}
            onChangeOAuth2Value={_onChangeOAuth2Value}
            fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
          />
        </Container>
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader>
          <TabHeader.Right>
            {/* <Button
              text="Cancel"
              onClick={(e) => close()}
              transparent
              secondary
              ghost
              sm
            /> */}

            <Button
              text={isRequesting ? 'Updating Auth...' : 'Update Auth'}
              disabled={
                isEqual(
                  _cloneDeep({
                    auth,
                    activeAuthType: 'none',
                  }),
                  {
                    auth: entity.auth,
                    activeAuthType: entity.__meta.activeAuthType,
                  }
                ) || isRequesting
              }
              onClick={_onUpdate}
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default Auth;

interface IAuthSettingUi {
  entityType: 'collection' | 'folder';
  entity: ICollection | IFolder;
  auth: IAuth;
  activeAuthType: EAuthTypes;
  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
}
