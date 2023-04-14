import _cloneDeep from 'lodash/cloneDeep';
import shallow from 'zustand/shallow';
import { Url, HttpMethodDropDown, Button } from '@firecamp/ui';
import { EHttpMethod } from '@firecamp/types';
import _url from '@firecamp/url';
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
    isRequestRunning,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    execute,
    setRequestFromCurl,
    save,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      requestPath: s.runtime.requestPath,
      isRequestRunning: s.runtime.isRequestRunning,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      execute: s.execute,
      setRequestFromCurl: s.setRequestFromCurl,
      save: s.save,
    }),
    shallow
  );

  const _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    const value = e.target.value;
    if (value.startsWith('curl')) return;

    const urlObject = _url.updateByRaw({ ...url, raw: value });
    // console.log(urlObject, 'urlObject... in url bar');
    changeUrl(urlObject);
  };

  const _onPaste = (snippet: string, edt: any) => {
    if (!snippet) return;
    if (snippet?.trim().startsWith('curl')) {
      setRequestFromCurl(snippet);
    }
  };

  const _onSave = async () => {
    try {
      save(tabId);
    } catch (e) {
      console.error(e);
    }
  };

  const _onExecute = async () => {
    try {
      execute();
    } catch (error) {}
  };

  return (
    <Url
      id={tabId}
      path={requestPath?.path || 'Untitled Request'}
      placeholder={'http://'}
      isRequestSaved={isRequestSaved}
      url={url.raw}
      onChange={_handleUrlChange}
      onPaste={_onPaste}
      onEnter={_onExecute}
      promptRenameRequest={() => {
        context.app.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
          requestType: __meta.type
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
      suffixComponent={
        <>
          <Button
            text={isRequestRunning === true ? `Cancel` : `Send`}
            onClick={_onExecute}
            primary
            sm
          />
          <Button
            id={`save-request-${tabId}`}
            text="Save"
            onClick={_onSave}
            disabled={false}
            secondary
            sm
          />
        </>
      }
    />
  );
};

export default UrlBarContainer;
