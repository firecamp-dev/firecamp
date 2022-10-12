// @ts-nocheck
import { FC, useEffect, useState } from 'react';

import { Modal, Row, Container, Tabs } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import equal from 'deep-equal';

import SettingBody from './body/SettingBody';
import './CollectionSetting.sass';
import { ECollectionSettingTabs } from '../../../constants';
import Header from './Header';

import { collectionSettingTabs } from './constants';

const CollectionSetting: FC<ICollectionSetting> = ({
  isOpen = false,
  collectionId = '',
  settingMenu = '',
  onClose = () => {},
}) => {
  let [selectedBody, setBody] = useState(
    settingMenu || ECollectionSettingTabs.SETTING
  );
  let projectsList = []; //projectStore(state => state[_Project.LIST], shallow) || [];
  let zustandProject = projectsList.find(
    (p) => p._meta && p._meta.id === collectionId
  );

  let [project, setProject] = useState(zustandProject || {});

  /**
   * Fetch project details from indexedDB and set to state
   */
  let _fetchAndSetProject = async () => {
    try {
      // let fetchedProject = await F.db.project.populate(collectionId);
      // // console.log({ fetchedProject });
      // if (!equal(project, fetchedProject)) {
      //   setProject(fetchedProject);
      // }
    } catch (error) {
      console.error({
        error,
      });
    }
  };

  useEffect(() => {
    _fetchAndSetProject();
  }, [zustandProject]);

  let _updateProject = async (payload = {}) => {
    try {
      if (project) {
        // await F.appStore.project.update(payload, collectionId);
      }
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <>
      <Modal.Header>
        <Header name={project.name || ''} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Container.Header className="z-20">
            <Tabs
              list={collectionSettingTabs}
              activeTab={selectedBody}
              onSelect={setBody}
            />
          </Container.Header>
          <Container.Body>
            <SettingBody
              project={project}
              collectionId={collectionId}
              selectedBody={selectedBody}
              setBody={setBody}
              updateProject={_updateProject}
            />
          </Container.Body>
        </Container>
      </Modal.Body>
    </>
  );
};
export default CollectionSetting;

interface ICollectionSetting {
  isOpen: boolean;
  collectionId: string;
  settingMenu: string;
  onClose: Function;
}
