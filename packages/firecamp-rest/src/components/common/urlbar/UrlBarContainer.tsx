import _cloneDeep from 'lodash/cloneDeep';
import shallow from 'zustand/shallow';
import { Url, UrlBar, HttpMethodDropDown, Button } from '@firecamp/ui-kit';
import { EHttpMethod, TId, EFirecampAgent } from '@firecamp/types';
import _url from '@firecamp/url';
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
  const { EnvironmentWidget } = postComponents;

  const {
    url,
    method,
    __meta,
    __ref,
    activeEnvironments,
    isRequestRunning,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    execute,
    changeActiveEnvironment,
    preparePayloadForSaveRequest,
    preparePayloadForUpdateRequest,
  } = useRestStore(
    (s: IRestStore) => ({
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
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
      preparePayloadForSaveRequest: s.preparePayloadForSaveRequest,
      preparePayloadForUpdateRequest: s.preparePayloadForUpdateRequest,
    }),
    shallow
  );

  const _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    const value = e.target.value;

    const urlObject = _url.updateByRaw({ ...url, raw: value });
    // console.log(urlObject, "urlObject... in url bar")
    changeUrl(urlObject);
  };

  const _onPaste = (edt: any) => {
    if (!edt) return;
    const curl = edt.getValue();
    if (curl) {
      onPasteCurl(curl);
    }
  };

  const _onSave = async () => {
    try {
      const _request =
        isRequestSaved === true
          ? preparePayloadForUpdateRequest()
          : preparePayloadForSaveRequest();

      console.log({ _request });
      // setPushActionEmpty();
      // onSaveRequest(_request, tab.id);
    } catch (e) {
      console.error(e);
    }
  };

  const _onChangeVariables = (variables: { workspace: {}; collection: {} }) => {
    // console.log({ variables });

    const workspaceUpdates = {
      environmentId: activeEnvironments.workspace,
      variables: variables.workspace,
    };

    const collectionUpdates = {
      id: collectionId || '',
      environmentId: activeEnvironments.collection,
      variables: variables.collection,
    };

    platformContext.environment.setVariables(
      workspaceUpdates,
      collectionUpdates
    );
  };

  const _onExecute = async () => {
    try {
      // Do not execute if url is empty
      if (!url.raw) return;

      const envVariables =
        await platformContext.environment.getVariablesByTabId(tab.id);
      // console.log({ envVariables });

      const agent: EFirecampAgent = platformContext.getFirecampAgent();

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
      nodePath={__meta.name}
      showEditIcon={isRequestSaved}
      onEditClick={() => {
        context.appService.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
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
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
