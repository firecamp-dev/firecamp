import shallow from 'zustand/shallow';
import _url from '@firecamp/url';
import { Button, Url } from '@firecamp/ui';
import ConnectButton from '../connection/ConnectButton';
import { IStore, useStore } from '../../../store';

const UrlBarContainer = () => {
  const { tabId, context, url, __meta, __ref, requestPath, changeUrl } =
    useStore(
      (s: IStore) => ({
        tabId: s.runtime.tabId,
        context: s.context,
        url: s.request.url,
        __meta: s.request.__meta,
        __ref: s.request.__ref,
        requestPath: s.runtime.requestPath,
        changeUrl: s.changeUrl,
      }),
      shallow
    );

  const _onUpdateUrl = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const proxyUrl = { ...url, queryParams: [], pathParams: [] };
    const urlObject = _url.updateByRaw({ ...proxyUrl, raw: value });
    changeUrl(urlObject);
  };

  return (
    <Url
      id={tabId}
      path={requestPath?.path || 'Untitled Request'}
      placeholder={'ws://'}
      // isRequestSaved={isRequestSaved}
      url={url.raw}
      onChange={_onUpdateUrl}
      // onPaste={_onPaste}
      // onEnter={_onExecute}
      promptRenameRequest={() => {
        context.app.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
          requestType: __meta.type,
        });
      }}
      prefixComponent={<Button text={'WebSocket'} secondary sm />}
      suffixComponent={<PrefixButtons />}
    />
  );
};
export default UrlBarContainer;

const PrefixButtons = () => {
  const { tabId, isUpdatingRequest, save } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      isRequestSaved: s.runtime.isRequestSaved,
      isUpdatingRequest: s.ui.isUpdatingRequest,
      requestHasChanges: s.requestHasChanges,
      save: s.save,
    }),
    shallow
  );

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
      <ConnectButton sm={true} />
      <Button
        id={`save-request-${tabId}`}
        text={isUpdatingRequest ? 'Saving...' : 'Save'}
        disabled={false} //isSaveBtnDisabled
        onClick={_onSave}
        secondary
        sm
      />
    </>
  );
};
