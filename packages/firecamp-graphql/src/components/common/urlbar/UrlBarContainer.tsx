import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { FaFile } from '@react-icons/all-files/fa/FaFile';
import shallow from 'zustand/shallow';
import { EHttpMethod } from '@firecamp/types';
import _url from '@firecamp/url';
import { Button, Url, HttpMethodDropDown } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const methods = Object.values(EHttpMethod);

const UrlBarContainer = () => {
  const {
    tabId,
    url,
    method,
    __meta,
    __ref,
    requestPath,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    fetchIntrospectionSchema,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      requestPath: s.runtime.requestPath,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
    }),
    shallow
  );

  const _handleUrlChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const urlObject = _url.updateByRaw({ ...url, raw: value });
    changeUrl(urlObject);
  };

  return (
    <Url
      id={`url-${tabId}`}
      path={requestPath?.path || 'Untitled Request'}
      placeholder={'http://'}
      isRequestSaved={isRequestSaved}
      url={url.raw}
      onChange={_handleUrlChange}
      // onPaste={_onPaste}
      onEnter={fetchIntrospectionSchema}
      promptRenameRequest={() => {
        context.app.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
          requestType: __meta.type,
        });
      }}
      prefixComponent={
        <HttpMethodDropDown
          id={tabId}
          className={'select-box'} //TODO: check this class is needed or not
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      }
      suffixComponent={<PrefixButtons />}
    />
  );
};

export default UrlBarContainer;

const PrefixButtons = () => {
  const {
    tabId,
    isUpdatingRequest,
    fetchIntrospectionSchema,
    // toggleDoc,
    save,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      isUpdatingRequest: s.ui.isUpdatingRequest,
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
      // toggleDoc: s.toggleDoc,
      save: s.save,
    }),
    shallow
  );

  const schema = {};
  const _toggleGraphqlDoc = () => {
    // if (url?.raw?.length && (!schema || !Object.keys(schema).length)) {
    //   fetchIntrospectionSchema();
    // }
    // toggleDoc(true);
  };

  const _onSave = async () => {
    try {
      save(tabId);
    } catch (e) {
      console.error(e);
    }
  };

  // const isSaveBtnDisabled = isRequestSaved ? !requestHasChanges : false;
  return (
    <>
      <Button
        onClick={_toggleGraphqlDoc}
        icon={<FaFile fontSize={16} />}
        id={`open-schema-doc-${tabId}`}
        tooltip={'open schema doc'}
        secondary
        sm
      />
      <Button
        icon={<VscRefresh fontSize={18} strokeWidth={0.5} />}
        onClick={fetchIntrospectionSchema}
        id={`refresh-schema-${tabId}`}
        tooltip={'refresh schema'}
        iconLeft
        primary
        sm
      />
      <Button
        id={`save-request-${tabId}`}
        text={isUpdatingRequest ? 'Saving...' : 'Save'}
        onClick={_onSave}
        disabled={false} //isSaveBtnDisabled
        secondary
        sm
      />
    </>
  );
};
