import { FC, useState, useEffect, useRef } from 'react';
import {
  AuthSetting,
  Container,
  TabHeader,
  Button,
 
  
} from '@firecamp/ui-kit';
import equal from 'deep-equal';

import { Auth as AuthService } from '@firecamp/rest/src/services';
import { cloneDeep } from 'lodash';
import { EAuthTypes } from '@firecamp/types';

import { _env, _object } from '@firecamp/utils';

const Auth: FC<IAuth> = ({ project = {}, collectionId = '' }) => {
  const _getAuthHeaders = new AuthService();

  let [initialAuthDetails, setInitialAuthDetails] = useState({
    auth: project?.auth || {},
    active_auth_type:
      project?.meta?.active_auth_type || EAuthTypes.NoAuth || '',
    oauth2_last_fetched_token: project?._dnp?.oauth2_last_fetched_token || '',
  });
  let [authDetails, setAuthDetails] = useState(
    cloneDeep({
      auth: project?.auth || {},
      active_auth_type:
        project?.meta?.active_auth_type || EAuthTypes.NoAuth || '',
      oauth2_last_fetched_token: project?._dnp?.oauth2_last_fetched_token || '',
    })
  );

  // Get auth details on select auth setting
  useEffect(() => {
    // Get auth detials (auth and active_auth_type) from DB and set to state.
    const _getAuth = async () => {
      try {
        let updatedAuthDetails = {};
        // console.log({ project, authDetails });
        if (project?.auth && !equal(project.auth, authDetails.auth)) {
          updatedAuthDetails.auth = project.auth;
        }
        if (
          project?.meta?.active_auth_type &&
          !equal(project?.meta?.active_auth_type, authDetails.active_auth_type)
        ) {
          updatedAuthDetails.active_auth_type = project.meta.active_auth_type;
        }
        if (
          project?._dnp?.oauth2_last_fetched_token &&
          !equal(
            project?._dnp?.oauth2_last_fetched_token,
            authDetails.oauth2_last_fetched_token
          )
        ) {
          updatedAuthDetails.oauth2_last_fetched_token =
            project._dnp.oauth2_last_fetched_token;
        }

        updatedAuthDetails = cloneDeep(updatedAuthDetails);
        // console.log({ updatedAuthDetails });

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
  }, [collectionId, project]);

  let _onchangeActiveAuth = (activeAuth = '') => {
    if (activeAuth !== authDetails.active_auth_type) {
      setAuthDetails((ps) => {
        return {
          ...ps,
          active_auth_type: activeAuth,
        };
      });
    }
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
        // await F.appStore.project.update(cloneDeep(updates), collectionId);

        stateUpdates = updates;
      }

      if (
        authDetails.oauth2_last_fetched_token !==
        initialAuthDetails.oauth2_last_fetched_token
      ) {
        // Set auth token in to db. (_dnp)
        // await F.appStore.project.update(
        //   {
        //     _dnp: {
        //       oauth2_last_fetched_token: authDetails.oauth2_last_fetched_token
        //     }
        //   },
        //   collectionId
        // );
        stateUpdates = {
          ...stateUpdates,
          oauth2_last_fetched_token: authDetails.oauth2_last_fetched_token,
        };
      }

      if (_object.size(stateUpdates)) {
        let updatedState = cloneDeep(
          _object.mergeDeep(authDetails, stateUpdates)
        );
        setInitialAuthDetails(updatedState);
      }
      // F.notification.success('Auth updated successfully!!', {
      //   labels: { success: 'Auth' }
      // });
    } catch (error) {
      console.error({
        error,
        API: 'F.appStore.project.updateModule',
        updates,
        collectionId,
      });
    }
  };

  let _onChangeOAuth2Value = (updated = '', payload) => {
    // console.log({ updated, payload });
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
    // console.log({ initialAuthDetails });
  };

  let _fetchTokenOnChangeOAuth2 = async (oauth2Options = {}) => {
    console.log({ oauth2Options });
    /*  try {
      const defaultGlobalEnv = EvnProvider_Instance.getDefaultEnvironment(
        'global'
      );
      let defaultProjectEnv = EvnProvider_Instance.getDefaultEnvironment(
        collectionId
      );

      let mergedVars = EvnProvider_Instance.getVariablesByTabId({
        globalEnvID: defaultGlobalEnv || '',
        collectionId: collectionId || '',
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

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <AuthSetting
            auth={authDetails.auth || {}}
            activeAuth={authDetails.active_auth_type || EAuthTypes.NoAuth || ''}
            allowInherit={false}
            onChangeAuth={_onChangeAuth}
            onChangeActiveAuth={_onchangeActiveAuth}
            onChangeOAuth2Value={_onChangeOAuth2Value}
            fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
            oauth2LastToken={authDetails.oauth2_last_fetched_token || ''}
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
              disabled={equal(cloneDeep(initialAuthDetails), authDetails)}
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
  project: any; //{}  //todo: define a proper type here
  collectionId: string;
}
