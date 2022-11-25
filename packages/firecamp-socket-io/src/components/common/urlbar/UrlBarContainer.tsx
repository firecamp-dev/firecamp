import shallow from 'zustand/shallow';
import _url from '@firecamp/url';

import { Url, UrlBar, HttpMethodDropDown, Button } from '@firecamp/ui-kit';
import { VERSIONS } from '../../../constants/index';

import { IPushPayload, ISocketStore, useSocketStore } from '../../../store';
import { TId } from '@firecamp/types';

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onSaveRequest = (pushAction, tabId: string) => {},
  platformContext,
}) => {
  const { EnvironmentWidget } = postComponents;

  const {
    url,
    version,
    activeEnvironments,
    isRequestSaved,

    changeUrl,
    changeConfig /* pushAction */,
    changeActiveEnvironment,
    prepareRequestInsertPushPayload,
    prepareRequestUpdatePushPayload,
    setPushActionEmpty,
  } = useSocketStore(
    (s: ISocketStore) => ({
      url: s.request.url,
      version: s.request.config.version,
      activeEnvironments: s.runtime.activeEnvironments,
      isRequestSaved: s.runtime.isRequestSaved,

      changeUrl: s.changeUrl,
      changeConfig: s.changeConfig,
      changeActiveEnvironment: s.changeActiveEnvironment,
      prepareRequestInsertPushPayload: s.prepareRequestInsertPushPayload,
      prepareRequestUpdatePushPayload: s.prepareRequestUpdatePushPayload,
      setPushActionEmpty: s.setPushActionEmpty,

      // pushAction: s.pushAction,
    }),
    shallow
  );
  // console.log({pushAction});

  const _onSave = async () => {
    try {
      let pushPayload: IPushPayload;
      if (!isRequestSaved) {
        pushPayload = await prepareRequestInsertPushPayload();
      } else {
        pushPayload = await prepareRequestUpdatePushPayload();
      }

      // console.log({ pushPayload });
      setPushActionEmpty();

      onSaveRequest(pushPayload, tab.id);
    } catch (error) {
      console.error({
        API: 'insert.rest',
        error,
      });
    }
  };

  const _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    let value = e.target.value;

    let urlObject = _url.updateByRaw({ ...url, raw: value });

    changeUrl(urlObject);
  };

  let versionToolTip = 'npm-socket.io-client@2.4.0';
  if (version === 'v2') {
    versionToolTip = 'npm-socket.io-client@2.4.0';
  } else if (version === 'v3') {
    versionToolTip = 'npm-socket.io-client@3.1.0';
  } else {
    versionToolTip = 'npm-socket.io-client@4.1.3';
  }

  return (
    <UrlBar
      environmentCard={
        <EnvironmentWidget
          key={tab.id}
          previewId={`socket-io-env-variables-${tab.id}`}
          collectionId={collectionId}
          collectionActiveEnv={activeEnvironments.collection}
          workspaceActiveEnv={activeEnvironments.workspace}
          onCollectionActiveEnvChange={(collectionId: TId, envId: TId) => {
            changeActiveEnvironment('collection', envId);
          }}
          onWorkspaceActiveEnvChange={(envId: TId) => {
            changeActiveEnvironment('workspace', envId);
          }}
        />
      }
      nodePath={''}
    >
      <UrlBar.Prefix>
        <HttpMethodDropDown
          id={tab.id}
          dropdownOptions={VERSIONS}
          selectedOption={version}
          toolTip={versionToolTip}
          onSelectItem={(version) => changeConfig('version', version)}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={url?.raw || ''}
          placeholder={'http://'}
          onChangeURL={_handleUrlChange}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <Button
          id={`save-request-${tab.id}`}
          text="Save"
          disabled={false}
          onClick={_onSave}
          secondary
          sm
        />
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
