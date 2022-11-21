import shallow from 'zustand/shallow';
import _url from '@firecamp/url';

import { Url, UrlBar, HttpMethodDropDown, Button, EButtonColor, EButtonSize } from '@firecamp/ui-kit';
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
  let { EnvironmentWidget } = postComponents;

  let {
    url,
    version,
    active_environments,
    is_request_saved,

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
      active_environments: s.runtime.active_environments,
      is_request_saved:s.runtime.is_request_saved,

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

  let _onSave = async () => {
    try {
      let pushPayload: IPushPayload;
      if (!is_request_saved) {
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

  let _handleUrlChange = (e: {
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
          collectionActiveEnv={active_environments.collection}
          workspaceActiveEnv={active_environments.workspace}
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
