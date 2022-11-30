import { useContext } from 'react';
import _compact from 'lodash/compact';
import { AuthSetting } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { EAuthTypes } from '@firecamp/types';

import { RestContext } from '../../Rest.context';
import { IRestStore, useRestStore } from '../../../store';

const AuthTab = () => {
  let { ctx_resetAuthHeaders, ctx_updateAuthValue, ctx_updateActiveAuth } =
    useContext(RestContext);

  let { auth, activeAuthType, oauth2LastFetchedToken } = useRestStore(
    (s: IRestStore) => ({
      auth: s.request.auth,
      activeAuthType: s.request.__meta.activeAuthType,
      oauth2LastFetchedToken: s.runtime.oauth2LastFetchedToken,

      changeAuth: s.changeAuth,
    }),
    shallow
  );

  //  console.log({ auth });

  let _updateOAuth2 = (updated = '', payload: { key: any; value: any }) => {
    if (!payload) return;

    let updates = auth[EAuthTypes.OAuth2];

    // console.log({ updated, payload, updates });

    if (updated === 'activeGrantType') {
      updates = Object.assign(updates, { active_grant_type: payload });
    }
    if (updated === 'activeGrantTypeValue' && 'grant_types' in updates) {
      const { key, value } = payload;

      updates['grant_types'] = Object.assign(updates['grant_types'], {
        [updates.active_grant_type]: Object.assign(
          updates['grant_types'][updates.active_grant_type],
          { [key]: value }
        ),
      });
    }

    ctx_updateAuthValue(EAuthTypes.OAuth2, updates);
    // console.log({ updates });
  };

  let _onSelectInheritAuth = () => {};
  let _openParentAuthModal = () => {};

  let _fetchTokenOnChangeOAuth2 = () => {
    ctx_resetAuthHeaders(EAuthTypes.OAuth2);
  };

  return (
    <AuthSetting
      auth={auth}
      activeAuth={activeAuthType}
      onChangeAuth={ctx_updateAuthValue}
      onChangeActiveAuth={ctx_updateActiveAuth}
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
