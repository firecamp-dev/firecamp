import _compact from 'lodash/compact';
import { AuthSetting, Button, Container, TabHeader } from '@firecamp/ui-kit';

const AuthTab = ({
  type,
  auth,
  authUiState,
  isRequesting,
  isAuthChanged,
  onChangeAuth,
  onChangeAuthType,
  onUpdate,
}) => {
  // const _updateOAuth2 = (updated = '', payload: { key: any; value: any }) => {
  //   if (!payload) return;

  //   let updates = auth[EAuthTypes.OAuth2];
  //   // console.log({ updated, payload, updates });
  //   if (updated === 'activeGrantType') {
  //     updates = Object.assign(updates, { activeGrantType: payload });
  //   }
  //   if (updated === 'activeGrantTypeValue' && 'grantTypes' in updates) {
  //     const { key, value } = payload;
  //     updates['grantTypes'] = Object.assign(updates['grantTypes'], {
  //       [updates.activeGrantType]: Object.assign(
  //         updates['grantTypes'][updates.activeGrantType],
  //         { [key]: value }
  //       ),
  //     });
  //   }
  //   changeAuth(EAuthTypes.OAuth2, updates);
  //   // console.log({ updates });
  // };

  const _onSelectInheritAuth = () => {};
  const _openParentAuthModal = () => {};
  const _fetchTokenOnChangeOAuth2 = () => {
    // resetAuthHeaders(EAuthTypes.OAuth2);
  };
  const _noop = () => {};
  console.log(authUiState)
  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <AuthSetting
          allowInherit={false}
          authUiState={authUiState} //{runtimeAuths}
          activeAuth={type}
          onChangeActiveAuth={onChangeAuthType} //{changeAuthType}
          onChangeAuth={onChangeAuth} //{changeAuth}
          onChangeOAuth2Value={_noop} //{_updateOAuth2}
          fetchTokenOnChangeOAuth2={_noop} //{_fetchTokenOnChangeOAuth2}
          fetchInheritedAuth={_noop} //{_onSelectInheritAuth}
          openParentAuthModal={_noop} //{_openParentAuthModal}
          oauth2LastToken={''} //{oauth2LastFetchedToken || ''}
        />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text={isRequesting ? 'Saving Auth...' : 'Save Auth Changes'}
              onClick={() => onUpdate(auth)}
              disabled={!isAuthChanged || isRequesting}
              primary
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default AuthTab;
