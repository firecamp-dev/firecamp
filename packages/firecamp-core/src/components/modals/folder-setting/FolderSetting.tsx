// @ts-nocheck
import { FC, useState, useEffect } from 'react';

import { Modal, Row, Tabs, Container } from '@firecamp/ui-kit';
import equal from 'deep-equal';

import SettingBody from './body/SettingBody';
import './FolderSetting.sass';
import { EFolderSettingTabs } from '../../../constants';

import Header from './Header';

import { folderSettingTabs } from './constants';

const FolderSetting: FC<IFolderSetting> = ({
  isOpen = false,
  folderId = '',
  settingMenu = '',
  onClose = () => {},
  fetchAndReset = () => {},
}) => {
  let [selectedBody, setBody] = useState(
    settingMenu || EFolderSettingTabs.SETTING
  );

  let [module, setModule] = useState({});

  /**
   * Fetch module detils from indexedDB and set to state
   */
  let _fetchAndSetModule = async () => {
    try {
      // let fetchedModule = await F.db.module.populate(folderId);
      // console.log({ fetchedModule });
      // if (!equal(module, fetchedModule)) {
      //   setModule(fetchedModule);
      // }
    } catch (error) {
      console.error({
        error,
      });
    }
  };

  useEffect(() => {
    fetchAndReset(_fetchAndSetModule);

    _fetchAndSetModule();
  }, []);

  let _updateModule = (payload = {}) => {
    if (module) {
      // F.appStore.project.updateModule(payload, {
      //   id: module?.__ref?.id || '',
      //   collectionId: module?.__ref?.collectionId || ''
      // });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="setting-modal">
      <Modal.Header>
        <Header name={module.name} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Container.Header className="z-20">
            <Tabs
              list={folderSettingTabs}
              activeTab={selectedBody}
              onSelect={setBody}
            />
          </Container.Header>
          <Container.Body>
            <SettingBody
              module={module}
              folderId={folderId}
              selectedBody={selectedBody}
              setBody={setBody}
              updateModule={_updateModule}
            />
          </Container.Body>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default FolderSetting;

interface IFolderSetting {
  isOpen: boolean;
  folderId: string;
  settingMenu: string;
  onClose: Function;
  fetchAndReset: Function;
}
