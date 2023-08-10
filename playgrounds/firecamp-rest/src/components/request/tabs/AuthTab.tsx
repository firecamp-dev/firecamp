import _compact from 'lodash/compact';
import { EAuthTypes } from '@firecamp/types';
import { AuthPanel } from '@firecamp/ui';
import { useRequestAuthFacade } from '../useFacade';

const AuthTab = () => {
  const {
    auth = { value: '', type: '' },
    runtimeAuths,
    oauth2LastFetchedToken,
    resetAuthHeaders,
    changeAuth,
    changeAuthType,
  } = useRequestAuthFacade()

  console.log({ auth });
  const { value, type } = auth;

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
    changeAuth(EAuthTypes.OAuth2, updates);
    // console.log({ updates });
  };

  const _onSelectInheritAuth = () => { };
  const _fetchTokenOnChangeOAuth2 = () => {
    resetAuthHeaders(EAuthTypes.OAuth2);
  };

  return (
    <AuthPanel
      value={runtimeAuths[type]}
      activeAuthType={type}
      onChangeAuthType={changeAuthType}
      onChangeAuthValue={changeAuth}
      onChangeOAuth2Value={_updateOAuth2}
      fetchTokenOnChangeOAuth2={_fetchTokenOnChangeOAuth2}
      fetchInheritedAuth={_onSelectInheritAuth}
      oauth2LastToken={oauth2LastFetchedToken || ''}
    />
  );
};

export default AuthTab;
