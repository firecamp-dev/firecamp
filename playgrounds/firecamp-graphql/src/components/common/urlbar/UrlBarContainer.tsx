import { File, RotateCw } from 'lucide-react';
import { EHttpMethod } from '@firecamp/types';
import _url from '@firecamp/url';
import { Button, Url, HttpMethodDropDown } from '@firecamp/ui';
import useUrlBarFacade, { useUrlBarSuffixButtonsFacade } from './useUrlBarFacade';

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
  } = useUrlBarFacade();

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
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      }
      suffixComponent={<SuffixButtons />}
    />
  );
};

export default UrlBarContainer;

const SuffixButtons = () => {
  const {
    tabId,
    isUpdatingRequest,
    fetchIntrospectionSchema,
    toggleDoc,
    save,
  } = useUrlBarSuffixButtonsFacade();

  // const isSaveBtnDisabled = isRequestSaved ? !requestHasChanges : false;
  return (
    <>
      <Button
        id={`open-schema-doc-${tabId}`}
        title={'open schema doc'}
        data-testid="open-graphql-schema-doc"
        onClick={() => toggleDoc(true)}
        leftSection={<File size={18} />}
        secondary
        xs
      />
      <Button
        id={`refresh-schema-${tabId}`}
        title={'refresh schema'}
        data-testid="refresh-graphql-schema"
        leftSection={<RotateCw size={18} />}
        onClick={fetchIntrospectionSchema}
        primary
        xs
      />
      <Button
        id={`save-request-${tabId}`}
        data-testid="save-request"
        title={'Save Request'}
        text={isUpdatingRequest ? 'Saving...' : 'Save'}
        onClick={() => save(tabId)}
        disabled={false} //isSaveBtnDisabled
        secondary
        xs
      />
    </>
  );
};
