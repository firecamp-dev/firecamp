import { FC, useMemo } from 'react';
import {
  AuthSetting,
  Button,
  Container,
 
  
  TabHeader,
} from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';
import { EAuthTypes, IUiAuth, TId } from '@firecamp/types';
import { _env, _object, _auth, _array } from '@firecamp/utils';
import equal from 'deep-equal';
import { IExplorerSettingsUi } from '../types';
import { EPlatformModalTypes } from '../../../../types';

const Auth: FC<IAuthSettingUi> = ({
  type = EPlatformModalTypes.CollectionSetting,
  initialPayload,
  auth: propAuth = {},
  activeAuthType = EAuthTypes.NoAuth,
  isRequesting = false,
  onUpdate = () => {},
  onChange = (key: string, value: any) => {},
  close = () => {},
}) => {
  let itemId: TId = useMemo(() => initialPayload?.__ref.id, [initialPayload]);

  let _onChangeAuth = (type, payload) => {
    if (!type || !payload || !payload.key) return;

    onChange('auth', {
      ...propAuth,
      [type]: {
        ...propAuth[type],
        [payload.key]: payload.value || '',
      },
    });
  };

  let _onChangeOAuth2Value = (updated = '', payload) => {
    // console.log({ updated, payload });
    if (updated === 'activeGrantTypeValue') {
      const { key, value } = payload;

      let type = propAuth[EAuthTypes.OAuth2].active_grant_type;

      onChange('auth', {
        ...propAuth,
        [EAuthTypes.OAuth2]: Object.assign(propAuth[EAuthTypes.OAuth2], {
          grant_types: {
            ...propAuth[EAuthTypes.OAuth2].grant_types,
            [type]: Object.assign(
              propAuth[EAuthTypes.OAuth2].grant_types[type],
              {
                [key]: value,
              }
            ),
          },
        }),
      });
    }

    if (updated === 'activeGrantType') {
      onChange('auth', {
        ...propAuth,
        [EAuthTypes.OAuth2]: Object.assign(propAuth[EAuthTypes.OAuth2], {
          active_grant_type: payload,
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
          .getOAuth2Token(_env.applyVariables(oauth2Options, mergedVars))
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
      updatedAuth = _object.difference(propAuth, initialPayload.auth) || {};
    let updatedKeys = Object.keys(updatedAuth) || [];
    // console.log({ updatedKeys });
    if (!_array.isEmpty(updatedKeys))
      updates['auth'] = _object.pick(propAuth, updatedKeys);

    try {
      if (activeAuthType !== initialPayload.__meta.activeAuthType) {
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
        <Container className="p-2">
          <AuthSetting
            key={itemId}
            auth={propAuth || {}}
            activeAuth={activeAuthType || EAuthTypes.NoAuth || ''}
            allowInherit={type === EPlatformModalTypes.FolderSetting}
            onChangeAuth={_onChangeAuth}
            onChangeActiveAuth={(activeAuth = EAuthTypes.NoAuth) => {
              onChange('meta', { activeAuthType: activeAuth });
            }}
            onChangeOAuth2Value={_onChangeOAuth2Value}
            fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
          />
        </Container>
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Cancel"
              secondary
              transparent={true}
              sm
              onClick={(e) => close()}
              ghost={true}
            />

            <Button
              text={isRequesting ? 'Updating Auth...' : 'Update Auth'}
              primary
              sm
              disabled={
                equal(
                  _cloneDeep({
                    auth: propAuth,
                    activeAuthType: activeAuthType,
                  }),
                  {
                    auth: initialPayload.auth,
                    activeAuthType: initialPayload.__meta.activeAuthType,
                  }
                ) || isRequesting
              }
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default Auth;

interface IAuthSettingUi {
  type:
    | EPlatformModalTypes.CollectionSetting
    | EPlatformModalTypes.FolderSetting;

  auth: IUiAuth; //todo: define a proper type here
  initialPayload: IExplorerSettingsUi;
  activeAuthType: EAuthTypes;
  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
  close: () => void;
}
