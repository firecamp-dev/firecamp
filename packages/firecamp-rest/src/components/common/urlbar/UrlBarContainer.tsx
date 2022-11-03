import { Url, UrlBar, HttpMethodDropDown, Button } from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';

import { EHttpMethod, TId, EFirecampAgent } from '@firecamp/types';
import _url from '@firecamp/url';
import shallow from 'zustand/shallow';

import { IPushPayload, IRestStore, useRestStore } from '../../../store';

const methods = Object.values(EHttpMethod);

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onSaveRequest = (pushAction: IPushPayload, tabId: string) => {},
  platformContext,
  onPasteCurl = (curl: string) => {},
}) => {
  let { EnvironmentWidget } = postComponents;

  let {
    url,
    method,
    meta,
    _meta,
    activeEnvironments,
    isRequestRunning,
    isRequestSaved,
    context,

    changeUrl,
    changeMethod,

    execute,
    changeActiveEnvironment,
    prepareRequestInsertPushPayload,
    prepareRequestUpdatePushPayload,
    setPushActionEmpty,

    // pushAction,
  } = useRestStore(
    (s: IRestStore) => ({
      url: s.request.url,
      method: s.request.method,
      meta: s.request.meta,
      _meta: s.request._meta,
      activeEnvironments: s.runtime.activeEnvironments,
      isRequestRunning: s.runtime.isRequestRunning,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,

      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      execute: s.execute,

      changeActiveEnvironment: s.changeActiveEnvironment,
      prepareRequestInsertPushPayload: s.prepareRequestInsertPushPayload,
      prepareRequestUpdatePushPayload: s.prepareRequestUpdatePushPayload,
      setPushActionEmpty: s.setPushActionEmpty,
      // pushAction: s.pushAction,
    }),
    shallow
  );
  /* useEffect(()=>{console.log({url});
},[url]) */
  // console.log({ pushAction })

  let _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    let value = e.target.value;

    let urlObject = _url.updateByRaw({ ...url, raw: value });

    console.log(urlObject, "urlObject...")

    changeUrl(urlObject);
  };

  let _onPaste = (edt: any) => {
    if (!edt) return;
    let curl = edt.getValue();
    if (curl) {
      onPasteCurl(curl);
    }
  };

  let _onSave = async () => {
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

  let _onChangeVariables = (variables: { workspace: {}; collection: {} }) => {
    // console.log({ variables });

    let workspaceUpdates = {
      environmentId: activeEnvironments.workspace,
      variables: variables.workspace,
    };

    let collectionUpdates = {
      id: collectionId || '',
      environmentId: activeEnvironments.collection,
      variables: variables.collection,
    };

    platformContext.environment.setVariables(
      workspaceUpdates,
      collectionUpdates
    );
  };

  let _onExecute = async () => {
    try {
      // Do not execute if url is empty
      if (!url.raw) return;

      let envVariables = await platformContext.environment.getVariablesByTabId(
        tab.id
      );
      // console.log({ envVariables });

      let agent: EFirecampAgent = platformContext.getFirecampAgent();

      execute(_cloneDeep(envVariables), agent, _onChangeVariables);
    } catch (error) {
      console.error({ API: 'rest._onExecute' });
    }
  };

  // console.log({ activeEnvironments, collectionId });
  // console.log({ isRequestSaved });

  return (
    <UrlBar
      environmentCard={
        <EnvironmentWidget
          key={tab.id}
          previewId={`http-env-variables-${tab.id}`}
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
      nodePath={meta.name}
      showEditIcon={isRequestSaved}
      onEditClick={() => {
        context.appService.modals.openEditRequest({
          name: meta.name,
          description: meta.description,
          collection_id: _meta.collection_id,
          request_id: _meta.id,
        });
      }}
    >
      <UrlBar.Prefix>
        <HttpMethodDropDown
          id={tab.id}
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={url?.raw || ''}
          placeholder={'http://'}
          onChangeURL={_handleUrlChange}
          onEnter={_onExecute}
          onPaste={_onPaste}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <Button
          primary
          sm
          onClick={_onExecute}
          text={isRequestRunning === true ? `Stop` : `Send`}
        />
        <Button
          id={`save-request-${tab.id}`}
          secondary
          sm
          text="Save"
          disabled={false}
          onClick={_onSave}
        />

        {/* <SavePopover                               
          onFirstTimeSave={_onSave}
          onSaveCallback={_onUpdate}
          tabMeta={tab.meta}
          tabId={tab.id}
          meta={{
            formTitle: 'Rest Request',
            namePlaceholder: 'Title',
            descPlaceholder: 'Description',
          }}
        /> */}
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
