import { Button, Url } from '@firecamp/ui-kit';
import _url from '@firecamp/url';
import shallow from 'zustand/shallow';
import ConnectButton from '../connection/ConnectButton';
import { IStore, useStore } from '../../../store';

const UrlBarContainer = ({ tab }) => {
  const { url, displayUrl, changeUrl, save } = useStore(
    (s: IStore) => ({
      url: s.request.url,
      displayUrl: s.runtime.displayUrl,
      changeUrl: s.changeUrl,
      save: s.save,
    }),
    shallow
  );

  const _onSave = async () => {
    try {
      save(tab.id);
    } catch (e) {
      console.error(e);
    }
  };

  const _onUpdateUrl = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const proxyUrl = { ...url, queryParams: [], pathParams: [] };
    const urlObject = _url.updateByRaw({ ...proxyUrl, raw: value });
    changeUrl(urlObject);
  };

  return (
    <Url
      id={tab.id}
      // path={__meta.name}
      placeholder={'ws://'}
      // isRequestSaved={isRequestSaved}
      url={displayUrl}
      onChange={_onUpdateUrl}
      // onPaste={_onPaste}
      // onEnter={_onExecute}
      promptRenameRequest={() => {
        // context.app.modals.openEditRequest({
        //   name: __meta.name,
        //   description: __meta.description,
        //   collectionId: __ref.collectionId,
        //   requestId: __ref.id,
        // });
      }}
      prefixComponent={<Button text={'WebSocket'} secondary sm />}
      suffixComponent={<>
        <ConnectButton sm={true} />
        <Button
          id={`save-request-${tab.id}`}
          text="Save"
          disabled={false}
          onClick={_onSave}
          secondary
          sm
        />
      </>}
    />
  )
};

export default UrlBarContainer;
