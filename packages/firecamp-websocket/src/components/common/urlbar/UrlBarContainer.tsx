import { Button, Url, UrlBar } from '@firecamp/ui-kit';
import _url from '@firecamp/url';
import shallow from 'zustand/shallow';
import { TId } from '@firecamp/types';

import {
  IPushPayload,
  IWebsocketStore,
  useWebsocketStore,
} from '../../../store/index';

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
    activeEnvironments,
    isRequestSaved,

    changeUrl,
    changeActiveEnvironment,
    prepareRequestInsertPushPayload,
    prepareRequestUpdatePushPayload,
    setPushActionEmpty,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      url: s.request.url,
      activeEnvironments: s.runtime.activeEnvironments,
      isRequestSaved: s.runtime.isRequestSaved,

      changeUrl: s.changeUrl,
      changeActiveEnvironment: s.changeActiveEnvironment,
      prepareRequestInsertPushPayload: s.prepareRequestInsertPushPayload,
      prepareRequestUpdatePushPayload: s.prepareRequestUpdatePushPayload,
      setPushActionEmpty: s.setPushActionEmpty,
    }),
    shallow
  );

  // console.log({ pushAction });

  // const { SaveButton, EnvironmentVariCard } = ctx_additionalComponents;

  /*   const _onSave = async (savedRequestData: {
    name: string;
    description: string;
    collection_id: TId;
    folder_id: TId;
  }) => {
    try {
      // console.log({ savedRequestData });

      const pushPayload: IPushPayload = await prepareRequestInsertPushPayload({
        name: savedRequestData.name,
        description: savedRequestData.description,
        collection_id: savedRequestData.collection_id,
        folder_id: savedRequestData.folder_id,
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
      const pushPayload: IPushPayload = await prepareRequestUpdatePushPayload();
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

  const _onUpdateURL = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const urlObject = _url.updateByRaw({ ...url, raw: value });
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
          url={url.raw || _url.toString(url)}
          placeholder={'ws://'}
          onChangeURL={_onUpdateURL}
          // onEnter={_onExecute}
          // onPaste={_onPaste}
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
        {/*   <SavePopover
          onFirstTimeSave={_onSave}
          onSaveCallback={_onUpdate}
          tabMeta={tab.meta}
          tabId={tab.id}
          meta={{
            formTitle: 'Websocket Request',
            namePlaceholder: 'Title',
            descPlaceholder: 'Description',
          }}
        /> */}
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
