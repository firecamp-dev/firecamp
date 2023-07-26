import { FC, useState } from 'react';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import _url from '@firecamp/url';
import { Url, Button, DropdownMenu } from '@firecamp/ui';
import ConnectionButton from '../connection/ConnectButton';
import { SIOVersionOptions } from '../../../constants';
import { IStore, useStore } from '../../../store';

const UrlBarContainer = () => {
  const {
    tabId,
    url,
    version,
    __meta,
    __ref,
    requestPath,
    isRequestSaved,
    context,
    connect,
    changeUrl,
    changeConfig,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      url: s.request.url,
      version: s.request.config.version,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      requestPath: s.runtime.requestPath,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeConfig: s.changeConfig,
      connect: s.connect,
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
    changeUrl(urlObject);
  };

  let versionToolTip = 'npm-socket.io-client@2.4.0';
  if (version === 'v2') {
    versionToolTip = 'npm-socket.io-client@2.4.0';
  } else if (version === 'v3') {
    versionToolTip = 'npm-socket.io-client@3.1.0';
  } else {
    versionToolTip = 'npm-socket.io-client@4.1.3';
  }

  return (
    <Url
      id={`url-${tabId}`}
      path={requestPath?.path || 'Untitled Request'}
      placeholder={'http://'}
      isRequestSaved={isRequestSaved}
      url={url.raw}
      onChange={_handleUrlChange}
      // onPaste={_onPaste}
      onEnter={connect}
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
        <SIOVersionDropDown
          id={tabId}
          options={SIOVersionOptions}
          selectedOption={SIOVersionOptions.find((v) => v.version == version)}
          onSelectItem={(v) => changeConfig('version', v.version)}
        />
      }
      suffixComponent={<SuffixButtons />}
    />
  );
};

export default UrlBarContainer;

const SIOVersionDropDown: FC<any> = ({
  id = '',
  options = [{ name: '', version: '' }],
  selectedOption = { name: '', version: '' },
  onSelectItem = (option) => {},
}) => {
  const [isDropDownOpen, toggleDropDown] = useState(false);
  return (
    <div className="flex">
      <DropdownMenu
        id={id}
        onOpenChange={(v) => toggleDropDown(v)}
        handler={() => (
          <Button
            text={selectedOption.name}
            rightIcon={
              <VscTriangleDown
                size={12}
                className={cx({ 'transform rotate-180': isDropDownOpen })}
              />
            }
            secondary
            xs
          />
        )}
        selected={selectedOption}
        options={options}
        onSelect={(o) => onSelectItem(o)}
        classNames={{
          dropdown: '-mt-2',
        }}
        width={140}
        sm
      />
    </div>
  );
};

const SuffixButtons = () => {
  const { tabId, isUpdatingRequest, save } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      isUpdatingRequest: s.ui.isUpdatingRequest,
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
      <ConnectionButton />
      <Button
        id={`save-request-${tabId}`}
        text={isUpdatingRequest ? 'Saving...' : 'Save'}
        disabled={false} // isSaveBtnDisabled
        onClick={_onSave}
        secondary
        xs
      />
    </>
  );
};
