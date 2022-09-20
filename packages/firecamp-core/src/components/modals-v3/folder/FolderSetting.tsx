import { FC, useEffect, useState } from 'react';
import {
  Container,
  Modal,
  IModal,
  SecondaryTab,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _auth, _misc, _object } from '@firecamp/utils';
import _cloneDeep from 'lodash/cloneDeep';
import { EAuthTypes, TId } from '@firecamp/types';
import { Rest } from '@firecamp/cloud-apis';

import Auth from '../settings/shared/Auth';
import Scripts from '../settings/shared/Scripts';
import EditInfo from '../settings/shared/EditInfo';
import { IFolderSettingUi } from '../settings/types';
import { useModalStore } from '../../../store/modal';
import { EPlatformModalTypes } from '../../../types';

const defaultFolder: IFolderSettingUi = {
  name: '',
  description: '',
  scripts: {
    pre: '',
    post: '',
    test: '',
  },
  auth: {},
  meta: { active_auth_type: EAuthTypes.NoAuth },
  _meta: { id: '', workspace_id: '' },
};

enum ETabTypes {
  Edit = 'edit',
  Auth = 'auth',
  Script = 'script',
}

type TModalMeta = {
  folderId: TId;
};

const FolderSetting: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { folderId } = useModalStore.getState().meta as TModalMeta;

  const [folder, setFolder] = useState(defaultFolder);
  const [initialPayload, setInitialFolder] = useState(defaultFolder);
  const [isRequesting, setIsRequesting] = useState(false);

  const tabs = [
    { name: 'Edit', id: ETabTypes.Edit },
    { name: 'Auth', id: ETabTypes.Auth },
    { name: 'Script', id: ETabTypes.Script },
  ];

  let [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  useEffect(() => {
    let _fetchFolder = async () => {
      setIsRequesting(true);

      try {
        // Fetch folder
        let fetchedFolder = await Rest.folder
          .fetch(folderId)
          .then((d) => d?.data || {})
          .catch((e) => {});
        // console.log({ fetchedFolder });

        fetchedFolder.auth = _auth.normalizeToUi(fetchedFolder?.auth || {});

        let folderToSet = _object.mergeDeep(
          _cloneDeep(defaultFolder),
          fetchedFolder
        ) as IFolderSettingUi;

        setFolder(folderToSet);
        setInitialFolder(folderToSet);
      } catch (error) {
        console.log({ error });
      }
      setIsRequesting(false);
    };

    _fetchFolder();
  }, [folderId]);

  const onChange = (key: string, value: any) => {
    if (['auth', 'meta', 'scripts'].includes(key)) {
      setFolder((c) => {
        return {
          ...c,
          [key]: {
            ...(c?.[key] || {}),
            ...value,
          },
        };
      });
    } else {
      setFolder((c) => ({ ...c, [key]: value }));
    }
  };

  const onUpdate = async (updates: { [key: string]: string }) => {
    if (isRequesting) return;

    // console.log({ updates });
    setIsRequesting(true);
    try {
      await Rest.folder.update(folderId, updates);

      let updatedFolder = _object.mergeDeep(
        folder,
        updates
      ) as IFolderSettingUi;

      setInitialFolder(updatedFolder);
    } catch (error) {
      console.log({ error });
    }

    setIsRequesting(false);
  };

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case 'edit':
        return (
          <EditInfo
            type={EPlatformModalTypes.FolderSetting}
            initialPayload={initialPayload}
            name={folder.name || ''}
            description={folder.description || ''}
            isRequesting={isRequesting}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      case 'auth':
        return (
          <Auth
            type={EPlatformModalTypes.FolderSetting}
            initialPayload={initialPayload}
            auth={folder.auth}
            activeAuthType={folder.meta.active_auth_type}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      case 'script':
        return (
          <Scripts
            type={EPlatformModalTypes.FolderSetting}
            initialPayload={initialPayload}
            scripts={folder.scripts}
            isRequesting={isRequesting}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      default:
        return <></>;
    }
  };

  // console.log({ folder });

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Folder Management
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <Container className="with-divider">
          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center p-4 w-full pb-0"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
            {renderTab(activeTab)}
          </Container.Body>
        </Container>
      </Modal.Body>
    </>
  );
};

export default FolderSetting;
