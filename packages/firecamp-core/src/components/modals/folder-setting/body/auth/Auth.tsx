import { FC, useState, useEffect, useRef } from 'react';
import {
  AuthSetting,
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
} from '@firecamp/ui-kit';
import { EAuthTypes } from '@firecamp/types';
import equal from 'deep-equal';
import { Auth as AuthService } from '@firecamp/rest/src/services';

import { cloneDeep } from 'lodash';

import { _env, _object } from '@firecamp/utils';

const Auth: FC<IAuth> = ({ module = {}, folderId = '' }) => {
  const _getAuthHeaders = new AuthService();

  let [initialAuthDetails, setInitialAuthDetails] = useState(
    cloneDeep({
      auth: module?.auth || {},
      active_auth_type:
        module?.meta?.active_auth_type || EAuthTypes.NoAuth || '',
      oauth2_last_fetched_token: module?._dnp?.oauth2_last_fetched_token || '',
    })
  );
  let [authDetails, setAuthDetails] = useState(
    cloneDeep({
      auth: module?.auth || {},
      active_auth_type:
        module?.meta?.active_auth_type || EAuthTypes.NoAuth || '',
      oauth2_last_fetched_token: module?._dnp?.oauth2_last_fetched_token || '',
    })
  );

  // let { current: EvnProvider_Instance } = useRef(new EnvVarProvider());

  let inheritedAuth_Ref = useRef(null);

  // Get auth details on select auth setting
  useEffect(() => {
    // Ge auth detials (auth and active_auth_type) from DB and set to state.
    const _getAuth = async () => {
      try {
        let updatedAuthDetails = {};

        if (module.auth && !equal(module.auth, authDetails.auth)) {
          updatedAuthDetails.auth = module.auth;
        }
        if (
          module?.meta?.active_auth_type &&
          !equal(module?.meta?.active_auth_type, authDetails.active_auth_type)
        ) {
          updatedAuthDetails.active_auth_type = module.meta.active_auth_type;
        }
        if (
          module?._dnp?.oauth2_last_fetched_token &&
          !equal(
            module?._dnp?.oauth2_last_fetched_token,
            authDetails.oauth2_last_fetched_token
          )
        ) {
          updatedAuthDetails.oauth2_last_fetched_token =
            module._dnp.oauth2_last_fetched_token;
        }

        if (_object.size(updatedAuthDetails)) {
          setInitialAuthDetails((ps) => {
            return {
              ...ps,
              ...(cloneDeep(updatedAuthDetails) || {}),
            };
          });
          setAuthDetails((ps) => {
            return {
              ...ps,
              ...(cloneDeep(updatedAuthDetails) || {}),
            };
          });
        }
      } catch (error) {}
    };

    _getAuth();
  }, [folderId, module]);

  let _onchangeActiveAuth = async (activeAuth = '') => {
    if (activeAuth !== authDetails.active_auth_type) {
      setAuthDetails((ps) => {
        return {
          ...ps,
          active_auth_type: activeAuth,
        };
      });

      if (activeAuth === EAuthTypes.Inherit) {
        try {
          let inheitedAuth = await _onSelectInherit();
          return Promise.resolve(inheitedAuth);
        } catch (error) {
          console.error({ error });
          return Promise.reject({});
        }
      }
    }
  };

  let _onSelectInherit = async () => {
    let inheitedAuth = {};
    try {
      let parentId =
          module?._meta?.parent_id || module?._meta?.collection_id || '',
        parentType = module?._meta?.parent_id ? 'M' : 'P';

      // inheitedAuth = await F.db.request.fetchAuth(parentId, parentType);
      // console.log({ inheitedAuth });
      inheritedAuth_Ref.current = inheitedAuth;
    } catch (error) {
      console.error({ error });
    }
    return Promise.resolve(inheitedAuth);
  };

  let _onChangeAuth = (type, payload) => {
    if (!type || !payload || !payload.key) return;
    setAuthDetails((ps) => {
      return {
        ...ps,
        auth: {
          ...ps.auth,
          [type]: {
            ...ps.auth[type],
            [payload.key]: payload.value || '',
          },
        },
      };
    });
  };

  let _onUpdate = async (e) => {
    if (e) e.preventDefault;
    let updates = {},
      updatedAuth =
        _object.difference(initialAuthDetails.auth, authDetails.auth) || {};
    let updatedKeys = Object.keys(updatedAuth) || [];
    updates['auth'] = _object.pick(authDetails.auth, updatedKeys);
    let stateUpdates = {};

    try {
      if (
        initialAuthDetails.active_auth_type !== authDetails.active_auth_type
      ) {
        updates = {
          ...updates,
          meta: { active_auth_type: authDetails.active_auth_type },
        };
      }

      if (_object.size(updates.auth) || _object.size(updates.meta)) {
        // await F.appStore.project.updateModule(cloneDeep(updates), {
        //   id: folderId,
        // });

        stateUpdates = updates;
      }

      if (
        authDetails.oauth2_last_fetched_token !==
        initialAuthDetails.oauth2_last_fetched_token
      ) {
        // Set auth token in to db. (_dnp)
        // await F.appStore.project.updateModule(
        //   {
        //     _dnp: {
        //       oauth2_last_fetched_token: authDetails.oauth2_last_fetched_token,
        //     },
        //   },
        //   {
        //     id: module?._meta?.id || '',
        //     collection_id: module?._meta?.collection_id || '',
        //   }
        // );
        stateUpdates = {
          ...stateUpdates,
          oauth2_last_fetched_token: authDetails.oauth2_last_fetched_token,
        };
      }

      if (object.size(stateUpdates)) {
        let updatedState = cloneDeep(
          _object.mergeDeep(authDetails, stateUpdates)
        );
        setInitialAuthDetails(updatedState);
      }

      // F.notification.success('Auth updated successfully!!', {
      //   labels: { success: 'Auth' },
      // });
    } catch (error) {}
  };

  let _openParentAuthModal = () => {
    // F.ModalService.close(EModals.MODULE_SETTING);
    // if (inheritedAuth_Ref?.current?.parent_type === 'M') {
    //   F.ModalService.open(EModals.MODULE_SETTING, EFolderSettingTabs.AUTH, {
    //     id: inheritedAuth_Ref?.current?.parent_id || '',
    //   });
    // } else {
    //   F.ModalService.open(
    //     EModals.PROJECT_SETTING,
    //     ECollectionSettingTabs.AUTH,
    //     {
    //       id: inheritedAuth_Ref?.current?.parent_id || '',
    //     }
    //   );
    // }
  };

  /**
   * Fetch oauth2 token and set in to DB
   * @param {*} oauth2Options
   */
  let _fetchTokenOnChangeOAuth2 = async (oauth2Options = {}) => {
    /*     try {
      const defaultGlobalEnv = EvnProvider_Instance.getDefaultEnvironment(
        'global'
      );
      let defaultProjectEnv = EvnProvider_Instance.getDefaultEnvironment(
        module?._meta?.collection_id || ''
      );

      let mergedVars = EvnProvider_Instance.getVariablesByTabId({
        globalEnvID: defaultGlobalEnv || '',
        collectionId: module?._meta?.collection_id || '',
        collectionEnvID: defaultProjectEnv || ''
      });

      if (Object.keys(oauth2Options).length) {
        // Get auth token
        await _getAuthHeaders
          .getOAuth2Token(_env.applyVariables(oauth2Options, mergedVars))
          .then(async token => {
            setAuthDetails(ps => {
              return {
                ...ps,
                oauth2_last_fetched_token: token
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

  let _onChangeOAuth2Value = (updated = '', payload) => {
    if (updated === 'activeGrantTypeValue') {
      const { key, value } = payload;

      setAuthDetails((state) => {
        let type = state.auth[EAuthTypes.OAuth2].active_grant_type;
        return {
          ...state,
          auth: {
            ...state.auth,
            [EAuthTypes.OAuth2]: Object.assign(state.auth[EAuthTypes.OAuth2], {
              grant_types: {
                ...state.auth[EAuthTypes.OAuth2].grant_types,
                [type]: Object.assign(
                  state.auth[EAuthTypes.OAuth2].grant_types[type],
                  {
                    [key]: value,
                  }
                ),
              },
            }),
          },
        };
      });
    }
    if (updated === 'activeGrantType') {
      setAuthDetails((state) => {
        return {
          ...state,
          auth: {
            ...state.auth,
            [EAuthTypes.OAuth2]: Object.assign(state.auth[EAuthTypes.OAuth2], {
              active_grant_type: payload,
            }),
          },
        };
      });
    }
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <AuthSetting
            auth={authDetails.auth || {}}
            activeAuth={
              authDetails.active_auth_type || EAuthTypes.Inherit || ''
            }
            onChangeAuth={_onChangeAuth}
            onChangeActiveAuth={_onchangeActiveAuth}
            onChangeOAuth2Value={_onChangeOAuth2Value}
            openParentAuthModal={_openParentAuthModal}
            fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
            fetchInheritedAuth={_onSelectInherit}
            oauth2LastToken={authDetails.oauth2_last_fetched_token || ''}
          />
        </Container>
      </Container.Body>
      <Container.Footer>
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Update"
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              disabled={equal(initialAuthDetails, authDetails)}
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default Auth;

interface IAuth {
  module: object;
  folderId: string;
}
