import { FC, useState, useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import {
  AuthSetting,
  Container,
  TabHeader,
  Button,
} from '@firecamp/ui-kit';
import { EAuthTypes } from '@firecamp/types';
import { Auth as AuthService } from '@firecamp/rest/src/services';

import { cloneDeep } from 'lodash';

import { _env, _object } from '@firecamp/utils';

const Auth: FC<IAuth> = ({ module = {}, folderId = '' }) => {
  // const _getAuthHeaders = new AuthService();

  let [initialAuthDetails, setInitialAuthDetails] = useState(
    cloneDeep({
      auth: module?.auth || {},
      activeAuthType:
        module?.__meta?.activeAuthType || EAuthTypes.None || '',
      oauth2LastFetchedToken: module?._dnp?.oauth2LastFetchedToken || '',
    })
  );
  let [authDetails, setAuthDetails] = useState(
    cloneDeep({
      auth: module?.auth || {},
      activeAuthType:
        module?.__meta?.activeAuthType || EAuthTypes.None || '',
      oauth2LastFetchedToken: module?._dnp?.oauth2LastFetchedToken || '',
    })
  );

  // let { current: EvnProvider_Instance } = useRef(new EnvVarProvider());

  let inheritedAuth_Ref = useRef(null);

  // Get auth details on select auth setting
  useEffect(() => {
    // Ge auth detials (auth and activeAuthType) from DB and set to state.
    const _getAuth = async () => {
      try {
        let updatedAuthDetails = {};

        if (module.auth && !isEqual(module.auth, authDetails.auth)) {
          updatedAuthDetails.auth = module.auth;
        }
        if (
          module?.__meta?.activeAuthType &&
          !isEqual(module?.__meta?.activeAuthType, authDetails.activeAuthType)
        ) {
          updatedAuthDetails.activeAuthType = module.__meta.activeAuthType;
        }
        if (
          module?._dnp?.oauth2LastFetchedToken &&
          !isEqual(
            module?._dnp?.oauth2LastFetchedToken,
            authDetails.oauth2LastFetchedToken
          )
        ) {
          updatedAuthDetails.oauth2LastFetchedToken =
            module._dnp.oauth2LastFetchedToken;
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
    if (activeAuth !== authDetails.activeAuthType) {
      setAuthDetails((ps) => {
        return {
          ...ps,
          activeAuthType: activeAuth,
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
          module?.__ref?.parentId || module?.__ref?.collectionId || '',
        parentType = module?.__ref?.parentId ? 'M' : 'P';

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
        initialAuthDetails.activeAuthType !== authDetails.activeAuthType
      ) {
        updates = {
          ...updates,
          meta: { activeAuthType: authDetails.activeAuthType },
        };
      }

      if (_object.size(updates.auth) || _object.size(updates.__meta)) {
        // await F.appStore.project.updateModule(cloneDeep(updates), {
        //   id: folderId,
        // });

        stateUpdates = updates;
      }

      if (
        authDetails.oauth2LastFetchedToken !==
        initialAuthDetails.oauth2LastFetchedToken
      ) {
        // Set auth token in to db. (_dnp)
        // await F.appStore.project.updateModule(
        //   {
        //     _dnp: {
        //       oauth2LastFetchedToken: authDetails.oauth2LastFetchedToken,
        //     },
        //   },
        //   {
        //     id: module?.__ref?.id || '',
        //     collectionId: module?.__ref?.collectionId || '',
        //   }
        // );
        stateUpdates = {
          ...stateUpdates,
          oauth2LastFetchedToken: authDetails.oauth2LastFetchedToken,
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
    //     id: inheritedAuth_Ref?.current?.parentId || '',
    //   });
    // } else {
    //   F.ModalService.open(
    //     EModals.PROJECT_SETTING,
    //     ECollectionSettingTabs.AUTH,
    //     {
    //       id: inheritedAuth_Ref?.current?.parentId || '',
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
        module?.__ref?.collectionId || ''
      );

      let mergedVars = EvnProvider_Instance.getVariablesByTabId({
        globalEnvID: defaultGlobalEnv || '',
        collectionId: module?.__ref?.collectionId || '',
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

  let _onChangeOAuth2Value = (updated = '', payload) => {
    if (updated === 'activeGrantTypeValue') {
      const { key, value } = payload;

      setAuthDetails((state) => {
        let type = state.auth[EAuthTypes.OAuth2].activeGrantType;
        return {
          ...state,
          auth: {
            ...state.auth,
            [EAuthTypes.OAuth2]: Object.assign(state.auth[EAuthTypes.OAuth2], {
              grantTypes: {
                ...state.auth[EAuthTypes.OAuth2].grantTypes,
                [type]: Object.assign(
                  state.auth[EAuthTypes.OAuth2].grantTypes[type],
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
              activeGrantType: payload,
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
              authDetails.activeAuthType || EAuthTypes.Inherit || ''
            }
            onChangeAuth={_onChangeAuth}
            onChangeActiveAuth={_onchangeActiveAuth}
            onChangeOAuth2Value={_onChangeOAuth2Value}
            openParentAuthModal={_openParentAuthModal}
            fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
            fetchInheritedAuth={_onSelectInherit}
            oauth2LastToken={authDetails.oauth2LastFetchedToken || ''}
          />
        </Container>
      </Container.Body>
      <Container.Footer>
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Update"
              primary
              sm
              disabled={isEqual(initialAuthDetails, authDetails)}
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
