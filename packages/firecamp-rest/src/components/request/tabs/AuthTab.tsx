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

  let { auth, active_auth_type, oauth2_last_fetched_token } = useRestStore(
    (s: IRestStore) => ({
      auth: s.request.auth,
      active_auth_type: s.request.meta.active_auth_type,
      oauth2_last_fetched_token: s.runtime.oauth2_last_fetched_token,

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
      activeAuth={active_auth_type}
      onChangeAuth={ctx_updateAuthValue}
      onChangeActiveAuth={ctx_updateActiveAuth}
      onChangeOAuth2Value={_updateOAuth2}
      fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
      fetchInheritedAuth={_onSelectInheritAuth}
      openParentAuthModal={_openParentAuthModal}
      // inheritAuthMessage={
      //   ctx_tabData?.meta?.isSaved ? '' : 'Please save request first'
      // }
      oauth2LastToken={oauth2_last_fetched_token || ''}
    />
  );
};

export default AuthTab;
