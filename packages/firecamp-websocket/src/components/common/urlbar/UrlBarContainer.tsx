import { Button, Url, UrlBar } from '@firecamp/ui-kit';
import _url from '@firecamp/url';
import shallow from 'zustand/shallow';
import { TId } from '@firecamp/types';
import ConnectButton from '../connection/ConnectButton';
import { IWebsocketStore, useWebsocketStore } from '../../../store/index';

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onPasteCurl = (curl: string) => {},
}) => {
  const { EnvironmentWidget } = postComponents;

  const {
    url,
    displayUrl,
    activeEnvironments,
    changeUrl,
    changeActiveEnvironment,
    save,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      url: s.request.url,
      displayUrl: s.runtime.displayUrl,
      activeEnvironments: s.runtime.activeEnvironments,
      changeUrl: s.changeUrl,
      changeActiveEnvironment: s.changeActiveEnvironment,
      save: s.save,
    }),
    shallow
  );

  const _onSave = async () => {
    try {
      save(tab.id);
    } catch (e) {
      console.error(e);
    }
  };

  const _onUpdateUrl = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const proxyUrl = { ...url, queryParams: [], pathParams: [] };
    const urlObject = _url.updateByRaw({ ...proxyUrl, raw: value });
    changeUrl(urlObject);
  };

  return (
    <UrlBar
      environmentCard={
        <EnvironmentWidget
          key={tab.id}
          previewId={`websocket-env-variables-${tab.id}`}
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
      nodePath={``}
    >
      <UrlBar.Prefix>
        <Button text={'WebSocket'} secondary sm />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={displayUrl}
          placeholder={'ws://'}
          onChangeURL={_onUpdateUrl}
          // onEnter={_onExecute}
          // onPaste={_onPaste}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <ConnectButton sm={true} />
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
