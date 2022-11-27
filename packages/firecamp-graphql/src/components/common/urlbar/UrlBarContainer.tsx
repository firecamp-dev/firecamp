import {
  Button,
  Url,
  UrlBar,
  HttpMethodDropDown,
} from '@firecamp/ui-kit';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { FaFile } from '@react-icons/all-files/fa/FaFile';
import { EHttpMethod, TId } from '@firecamp/types';

import shallow from 'zustand/shallow';
import _url from '@firecamp/url';

import { IGraphQLStore, IPushPayload, useGraphQLStore } from '../../../store';
const methods = Object.values(EHttpMethod);

const UrlBarContainer = ({
  tab,
  collectionId = '',
  postComponents,
  onSaveRequest = (pushAction: IPushPayload, tabId: string) => {},
}) => {
  let { EnvironmentWidget } = postComponents;

  let {
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
    prepareRequestInsertPushPayload,
    prepareRequestUpdatePushPayload,
    setPushActionEmpty,
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
      prepareRequestInsertPushPayload: s.prepareRequestInsertPushPayload,
      prepareRequestUpdatePushPayload: s.prepareRequestUpdatePushPayload,

      setPushActionEmpty: s.setPushActionEmpty,
    }),
    shallow
  );
  // console.log({ url, request });

  let schema = {};

  let _handleUrlChange = (e) => {
    e.preventDefault();
    let value = e.target.value;

    let urlObject = _url.updateByRaw({ ...url, raw: value });

    changeUrl(urlObject);
  };

  let _toggleGraphqlDoc = () => {
    if (url?.raw?.length && (!schema || !Object.keys(schema).length)) {
      fetchIntrospectionSchema();
    }
    toggleDoc(true);
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
      onEditClick={()=> {
        context.appService.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id
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
          sm
          iconCenter
          secondary
          onClick={_toggleGraphqlDoc}
          icon={<FaFile fontSize={16} />}
          id={`open-schema-doc-${tab.id}`}
          tooltip={'open schema doc'}
        />

        <Button
          sm
          iconLeft
          primary
          icon={<VscRefresh fontSize={18} strokeWidth={0.5} />}
          onClick={fetchIntrospectionSchema}
          id={`refresh-schema-${tab.id}`}
          tooltip={'refresh schema'}
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
