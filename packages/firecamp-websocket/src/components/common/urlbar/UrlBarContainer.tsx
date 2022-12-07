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
  onSaveRequest = (pushAction /* : IPushPayload */, tabId: string) => {},
  platformContext,
  onPasteCurl = (curl: string) => {},
}) => {
  const { EnvironmentWidget } = postComponents;

  const {
    url,
    displayUrl,
    activeEnvironments,
    isRequestSaved,

    changeUrl,
    changeActiveEnvironment,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      url: s.request.url,
      displayUrl: s.runtime.displayUrl,
      activeEnvironments: s.runtime.activeEnvironments,
      isRequestSaved: s.runtime.isRequestSaved,
      changeUrl: s.changeUrl,
      changeActiveEnvironment: s.changeActiveEnvironment,
    }),
    shallow
  );

  // console.log({ pushAction });

  // const { SaveButton, EnvironmentVariCard } = ctx_additionalComponents;

  /*   const _onSave = async (savedRequestData: {
    name: string;
    description: string;
    collectionId: TId;
    folderId: TId;
  }) => {
    try {
      // console.log({ savedRequestData });

      const pushPayload: IPushPayload = await prepareRequestInsertPushPayload({
        name: savedRequestData.name,
        description: savedRequestData.description,
        collectionId: savedRequestData.collectionId,
        folderId: savedRequestData.folder_id,
      });
      console.log({ pushPayload });

      onSaveRequest(pushPayload, tab.id);
    } catch (error) {
      console.error({
        API: 'insert.websocket',
        error,
      });
    }
  };

  const _onUpdate = async () => {
    try {
      // const pushPayload: IPushPayload = await prepareRequestUpdatePushPayload();
      // console.log({ pushPayload });

      await onSaveRequest(pushPayload, tab.id);
    } catch (error) {
      console.error({
        API: 'update.websocket',
        error,
      });
    }
  }; */

  const _onSave = async () => {
    try {
      let pushPayload: any; //IPushPayload;
      if (!isRequestSaved) {
        // pushPayload = await prepareRequestInsertPushPayload();
      } else {
        // pushPayload = await prepareRequestUpdatePushPayload();
      }

      // console.log({ pushPayload });
      // setPushActionEmpty();

      onSaveRequest(pushPayload, tab.id);
    } catch (error) {
      console.error({
        API: 'insert.rest',
        error,
      });
    }
  };

  const _onUpdateURL = (e) => {
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
        <Button text={'Websocket'} secondary sm />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={displayUrl}
          placeholder={'ws://'}
          onChangeURL={_onUpdateURL}
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
