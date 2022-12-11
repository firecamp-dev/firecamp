import _compact from 'lodash/compact';
import shallow from 'zustand/shallow';
import { EAuthTypes } from '@firecamp/types';
import { AuthSetting } from '@firecamp/ui-kit';

import { IRestStore, useRestStore } from '../../../store';

const AuthTab = () => {

  const {
    auth= { value: '', type: ''},
    runtimeAuths,
    oauth2LastFetchedToken,
    resetAuthHeaders,
    updateAuthValue,
    changeAuthType
  } = useRestStore(
    (s: IRestStore) => ({
      auth: s.request.auth,
      runtimeAuths: s.runtime.auths,
      oauth2LastFetchedToken: s.runtime.oauth2LastFetchedToken,
      resetAuthHeaders: s.resetAuthHeaders,
      changeAuth: s.changeAuth,
      changeAuthType: s.changeAuthType,
      updateAuthValue: s.updateAuthValue,
    }),
    shallow
  );

   console.log({ auth });
   const { value, type } = auth

  const _updateOAuth2 = (updated = '', payload: { key: any; value: any }) => {
    if (!payload) return;

    let updates = auth[EAuthTypes.OAuth2];

    // console.log({ updated, payload, updates });

    if (updated === 'activeGrantType') {
      updates = Object.assign(updates, { activeGrantType: payload });
    }
    if (updated === 'activeGrantTypeValue' && 'grantTypes' in updates) {
      const { key, value } = payload;

      updates['grantTypes'] = Object.assign(updates['grantTypes'], {
        [updates.activeGrantType]: Object.assign(
          updates['grantTypes'][updates.activeGrantType],
          { [key]: value }
        ),
      });
    }

    updateAuthValue(EAuthTypes.OAuth2, updates);
    // console.log({ updates });
  };

  const _onSelectInheritAuth = () => {};
  const _openParentAuthModal = () => {};

  const _fetchTokenOnChangeOAuth2 = () => {
    resetAuthHeaders(EAuthTypes.OAuth2);
  };

  return (
    <AuthSetting
      auth={runtimeAuths}
      activeAuth={type}
      onChangeAuth={updateAuthValue}
      onChangeActiveAuth={changeAuthType}
      onChangeOAuth2Value={_updateOAuth2}
      fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
      fetchInheritedAuth={_onSelectInheritAuth}
      openParentAuthModal={_openParentAuthModal}
      // inheritAuthMessage={
      //   ctx_tabData?request.__meta?.isSaved ? '' : 'Please save request first'
      // }
      oauth2LastToken={oauth2LastFetchedToken || ''}
    />
  );
};

export default AuthTab;
