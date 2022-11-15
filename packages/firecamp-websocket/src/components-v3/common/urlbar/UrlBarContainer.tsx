import shallow from 'zustand/shallow';
import _url from '@firecamp/url';

import {
  Button,
  EButtonColor,
  EButtonSize,
  Url,
  UrlBar,
} from '@firecamp/ui-kit';

import {
  IPushPayload,
  IWebsocketStore,
  useWebsocketStore,
} from '../../../store/index';
import { TId } from '@firecamp/types';

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onSaveRequest = (pushAction /* : IPushPayload */, tabId: string) => {},
}) => {
  let { SavePopover, EnvironmentWidget } = postComponents;

  let {
    url,
    active_environments,
    is_request_saved,

    changeUrl,
    changeActiveEnvironment,
    prepareRequestInsertPushPayload,
    prepareRequestUpdatePushPayload,
    setPushActionEmpty,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      url: s.request.url,
      active_environments: s.runtime.active_environments,
      is_request_saved: s.runtime.is_request_saved,

      changeUrl: s.changeUrl,
      changeActiveEnvironment: s.changeActiveEnvironment,
      prepareRequestInsertPushPayload: s.prepareRequestInsertPushPayload,
      prepareRequestUpdatePushPayload: s.prepareRequestUpdatePushPayload,
      setPushActionEmpty: s.setPushActionEmpty,
    }),
    shallow
  );

  // console.log({ pushAction });

  // let { SaveButton, EnvironmentVariCard } = ctx_additionalComponents;

  /*   let _onSave = async (savedRequestData: {
    name: string;
    description: string;
    collection_id: TId;
    folder_id: TId;
  }) => {
    try {
      // console.log({ savedRequestData });

      let pushPayload: IPushPayload = await prepareRequestInsertPushPayload({
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

  let _onUpdate = async () => {
    try {
      let pushPayload: IPushPayload = await prepareRequestUpdatePushPayload();
      // console.log({ pushPayload });

      await onSaveRequest(pushPayload, tab.id);
    } catch (error) {
      console.error({
        API: 'update.websocket',
        error,
      });
    }
  }; */

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

  let _onUpdateURL = (e) => {
    e.preventDefault();
    let value = e.target.value;

    let urlObject = _url.updateByRaw({ ...url, raw: value });

    changeUrl(urlObject);
  };

  return (
    <UrlBar
      environmentCard={
        <EnvironmentWidget
          key={tab.id}
          previewId={`websocket-env-variables-${tab.id}`}
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
      nodePath={``}
    >
      <UrlBar.Prefix>
        <Button
          color={EButtonColor.Secondary}
          size={EButtonSize.Small}
          text={'Websocket'}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={url.raw || _url.toString(url)}
          placeholder={'ws://'}
          onChangeURL={_onUpdateURL}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <Button
          id={`save-request-${tab.id}`}
          color={EButtonColor.Secondary}
          size={EButtonSize.Small}
          text="Save"
          disabled={false}
          onClick={_onSave}
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
