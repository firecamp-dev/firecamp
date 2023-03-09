import { Button, Url, UrlBar } from '@firecamp/ui';
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
    <UrlBar environmentCard={<></>} nodePath={``}>
      <UrlBar.Prefix>
        <Button text={'WebSocket'} secondary sm />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={displayUrl}
          placeholder={'ws://'}
          onChangeURL={_onUpdateUrl}
          // onEnter={_onExecute}
          // onPaste={_onPaste}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <ConnectButton sm={true} />
        <Button
          id={`save-request-${tab.id}`}
          text="Save"
          disabled={false}
          onClick={_onSave}
          secondary
          sm
        />
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
