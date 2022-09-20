import { FC, useEffect, useRef, useState } from 'react';
import { Modal, Tabs, Container } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { BiGroup } from '@react-icons/all-files/bi/BiGroup';

import Body from './body/Body';
import Header from './Header';
import './WorkspaceSetting.sass';

import { EWorkspaceSettingTabs } from '../../../constants';
import { useWorkspaceStore } from '../../../store/workspace';
import { workspaceSettingTabs } from './constants';

const WorkspaceSetting: FC<ISettingsModal> = ({
  isOpen = false,
  activeTab: propActiveMenu = '',
  meta = {},
  onClose = () => {},
}) => {
  let zustandWorkspace = useWorkspaceStore((s) => s.workspace, shallow);

  let [activeTab, setActiveTab] = useState(
    propActiveMenu || EWorkspaceSettingTabs.SETTING
  );
  let [workspace, setWorkspace] = useState({ name: '' });
  let originalWRS = useRef(null);
  let [tabs, setTabs] = useState(workspaceSettingTabs);

  useEffect(() => {
    if (true) {
      //F.userMeta.isLoggedIn

      let udpatedTabs = [
        ...workspaceSettingTabs.slice(0, 1),
        {
          id: EWorkspaceSettingTabs.MEMBERS,
          name: 'Members',
          preComp: () => <BiGroup />,
        },
        ...workspaceSettingTabs.slice(1),
      ];
      setTabs(udpatedTabs);
    }
  }, []);

  useEffect(() => {
    let _setWrs = async () => {
      try {
        let wrs = zustandWorkspace;

        if (wrs) {
          originalWRS.current = wrs;
          setWorkspace(wrs);
        } else {
          setWorkspace({ name: '' });
        }
      } catch (error) {
        console.log(`error`, error);
      }
    };
    _setWrs();
  }, [zustandWorkspace]);

  let _updateWorkspaceData = (updatedWRS = {}) => {
    setWorkspace(Object.assign({}, workspace, updatedWRS));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <Header name={workspace.name || ''} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Container.Header className="z-20">
            <Tabs list={tabs} activeTab={activeTab} onSelect={setActiveTab} />
          </Container.Header>
          <Container.Body>
            <Body
              workspace={workspace}
              originalWRS={originalWRS.current || {}}
              activeTab={activeTab}
              meta={meta}
              onClose={onClose}
              updateWorkspaceData={_updateWorkspaceData}
            />
          </Container.Body>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default WorkspaceSetting;

interface ISettingsModal {
  isOpen: boolean;
  activeTab: string;
  meta: any; // {} //todo: define a proper type here
  onClose: () => any;
}
