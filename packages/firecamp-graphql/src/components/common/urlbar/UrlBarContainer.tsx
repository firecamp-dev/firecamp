import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { FaFile } from '@react-icons/all-files/fa/FaFile';
import shallow from 'zustand/shallow';
import { EHttpMethod, TId } from '@firecamp/types';
import _url from '@firecamp/url';
import { Button, Url, UrlBar, HttpMethodDropDown } from '@firecamp/ui-kit';
import { IGraphQLStore, useGraphQLStore } from '../../../store';

const methods = Object.values(EHttpMethod);

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onSaveRequest = (pushAction: any, tabId: string) => {},
}) => {
  const { EnvironmentWidget } = postComponents;

  const {
    url,
    method,
    __meta,
    __ref,
    activeEnvironments,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    fetchIntrospectionSchema,
    toggleDoc,
    changeActiveEnvironment,
    preparePayloadForSaveRequest,
    preparePayloadForUpdateRequest,
  } = useGraphQLStore(
    (s: IGraphQLStore) => ({
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      activeEnvironments: s.runtime.activeEnvironments,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,

      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
      toggleDoc: s.toggleDoc,
      changeActiveEnvironment: s.changeActiveEnvironment,
      preparePayloadForSaveRequest: s.preparePayloadForSaveRequest,
      preparePayloadForUpdateRequest: s.preparePayloadForUpdateRequest,
    }),
    shallow
  );
  // console.log({ url, request });

  const schema = {};

  const _handleUrlChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const urlObject = _url.updateByRaw({ ...url, raw: value });
    changeUrl(urlObject);
  };

  const _toggleGraphqlDoc = () => {
    if (url?.raw?.length && (!schema || !Object.keys(schema).length)) {
      fetchIntrospectionSchema();
    }
    toggleDoc(true);
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

  return (
    <UrlBar
      environmentCard={
        <EnvironmentWidget
          key={tab.id}
          previewId={`graphql-env-variables-${tab.id}`}
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
      <UrlBar.Prefix className="">
        <HttpMethodDropDown
          id={tab.id}
          className={'urlbar-input-type select-box'}
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={url.raw || ''}
          onChangeURL={_handleUrlChange}
          onEnter={fetchIntrospectionSchema}
          placeholder={'http://'}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <Button
          onClick={_toggleGraphqlDoc}
          icon={<FaFile fontSize={16} />}
          id={`open-schema-doc-${tab.id}`}
          tooltip={'open schema doc'}
          sm
          iconCenter
          secondary
        />

        <Button
          icon={<VscRefresh fontSize={18} strokeWidth={0.5} />}
          onClick={fetchIntrospectionSchema}
          id={`refresh-schema-${tab.id}`}
          tooltip={'refresh schema'}
          sm
          iconLeft
          primary
        />
        <Button
          id={`save-request-${tab.id}`}
          text="Save"
          onClick={_onSave}
          disabled={false}
          secondary
          sm
        />
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
