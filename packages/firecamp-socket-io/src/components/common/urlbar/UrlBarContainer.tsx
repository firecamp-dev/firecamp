import shallow from 'zustand/shallow';
import _url from '@firecamp/url';
import { Url, UrlBar, Button, Dropdown } from '@firecamp/ui';
import ConnectionButton from '../connection/ConnectButton';
import { SIOVersionOptions } from '../../../constants';
import { IStore, useStore } from '../../../store';
import { FC, useState } from 'react';

const UrlBarContainer = ({ tab }) => {
  const { url, displayUrl, version, changeUrl, changeConfig, save } = useStore(
    (s: IStore) => ({
      url: s.request.url,
      displayUrl: s.runtime.displayUrl,
      version: s.request.config.version,
      changeUrl: s.changeUrl,
      changeConfig: s.changeConfig,
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

  const _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    const value = e.target.value;
    const proxyUrl = { ...url, queryParams: [], pathParams: [] };
    const urlObject = _url.updateByRaw({ ...proxyUrl, raw: value });
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
    <UrlBar nodePath={''}>
      <UrlBar.Prefix>
        <SIOVersionDropDown
          id={tab.id}
          options={SIOVersionOptions}
          selectedOption={SIOVersionOptions.find((v) => v.version == version)}
          onSelectItem={(v) => changeConfig('version', v.version)}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={displayUrl || ''}
          placeholder={'http://'}
          onChangeURL={_handleUrlChange}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <ConnectionButton />
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

const SIOVersionDropDown: FC<any> = ({
  id = '',
  className = '',
  options = [{ name: '', version: '' }],
  selectedOption = { name: '', version: '' },
  onSelectItem = (option) => {},
}) => {
  const [isDropDownOpen, toggleDropDown] = useState(false);
  return (
    <Dropdown
      id={id}
      className={className}
      isOpen={isDropDownOpen}
      selected={selectedOption}
      onToggle={toggleDropDown}
    >
      <Dropdown.Handler>
        <Button text={selectedOption.name} secondary withCaret sm />
      </Dropdown.Handler>
      <Dropdown.Options options={options} onSelect={(o) => onSelectItem(o)} />
    </Dropdown>
  );
};
