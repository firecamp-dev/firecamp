import { useState, FC } from 'react';
import { AvailableOnElectron, Modal, Tabs } from '@firecamp/ui-kit';

import SSLManager from './ssl-manager/SSLManager';
import ProxyManager from './proxy-manager/ProxyManager';

import './SSLnProxyManager.sass';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';

const SSLnProxyManager: FC<ISSLnProxyManager> = ({
  //custom props
  isOpen = true,
  onClose = () => {},
}) => {
  let [state, setState] = useState({
    tabs: [
      {
        id: 'ssl_manager',
        name: 'SSL manager',
      },
      {
        id: 'proxy_manager',
        name: 'Proxy manager',
      },
    ],
    activeTab: 'ssl_manager',
  });

  let { tabs, activeTab } = state;
  let _setActiveTab = (tab) => {
    setState({
      ...state,
      activeTab: tab,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="fc-modal">
      <Modal.Header className="fc-modal-head" key="head">
        SSL/Proxy Manager
      </Modal.Header>
      <Modal.Body className="fc-modal-body ssl-proxy" key="body">
        <div className="flex flex-col w-full">
          <div className="z-20 relative">
            {' '}
            <Tabs
              key="tabs"
              className="tabs-with-bottom-border nav nav-tabs primary-bg-color"
              list={state.tabs || []}
              activeTab={state.activeTab || ''}
              onSelect={_setActiveTab}
              tabsClassName="tabs-with-bottom-border-left-section"
            />
          </div>
          {_misc.firecampAgent() === EFirecampAgent.Desktop ? (
            activeTab === 'ssl_manager' ? (
              <SSLManager key="ssl_manager" />
            ) : (
              <ProxyManager key="proxy_manager" />
            )
          ) : (
            <div className="absolute top-8 left-0 right-0 bottom-0">
              <AvailableOnElectron />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="fc-notes bg-focus3">
          <div className="fc-input-note font-base">
            <span className="iconv2-info-icon" />
            {activeTab === 'ssl_manager'
              ? `The custom SSL is supported in Rest, GraphQL, WS, and Socket.IO requests.`
              : ` The Proxy settings are available for Rest and GraphQL requests only.`}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default SSLnProxyManager;

interface ISSLnProxyManager {
  isOpen: boolean;
  onClose: Function;
}
