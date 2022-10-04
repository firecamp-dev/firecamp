import { useState } from 'react';
import { Dropdown } from '@firecamp/ui-kit';
import cx from 'classnames';

import { VscNewFile } from '@react-icons/all-files/vsc/VscNewFile';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import { VscSettingsGear } from '@react-icons/all-files/vsc/VscSettingsGear';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import AppService from '../../../../services/app';
import { useWorkspaceStore } from '../../../../store/workspace'

enum EMenuType {
  Collection = 'collection',
  Folder = 'folder',
  Request = 'request'
}

const CollectionMenu = ({
  collectionId,
  folderId,
  requestId,
  startRenaming,
  menuType,
}) => {

  const { deleteCollection, deleteFolder, deleteRequest } = useWorkspaceStore.getState();
  let [isMenuOpened, toggleMenu] = useState(false);

  const renameMenu = {
    prefix: () => (
      <div className={cx('mr-1 text-lg')}>
        <VscEdit size={14} />
      </div>
    ),
    name: 'Rename',
    onClick: (e) => {
      startRenaming();
    },
  }

  const addFolderMenu = {
    prefix: () => (
      <div className={cx('mr-1 text-lg')}>
        <VscNewFolder size={14} />
      </div>
    ),
    name: 'Add Folder',
    onClick: () => {
      console.log(collectionId, folderId);
      AppService.modals.openCreateFolder({ collectionId, folderId });
    },
  }

  const addRequestMenu = {
    prefix: () => (
      <div className={cx('mr-1 text-lg')}>
        <VscNewFile size={14} />
      </div>
    ),
    name: 'Add Request',
    onClick: () => {},
  }

  const settingMenu = {
    prefix: () => (
      <div className={cx('mr-1 text-lg')}>
        <VscSettingsGear size={14} />
      </div>
    ),
    name: 'Setting',
    onClick: () => {
      if (menuType == EMenuType.Collection) {
        AppService.modals.openCollectionSetting({ collectionId });
      } else if (menuType == EMenuType.Folder) {
        AppService.modals.openFolderSetting({ collectionId, folderId });
      }
    },
  }

  const deleteMenu = {
    prefix: () => (
      <div className={cx('mr-1 text-lg')}>
        <VscTrash size={14} />
      </div>
    ),
    name: 'Delete',
    onClick: () => {
      AppService.notify.confirm(
        `Are you sure to delete the ${menuType}?`,
        (s) => {
          if (menuType == EMenuType.Collection) {
            deleteCollection(collectionId);
          } else if (menuType == EMenuType.Folder) {
            deleteFolder(folderId);
          }
          else if (menuType == EMenuType.Request) {
            deleteRequest(requestId);
          }
        },
        console.log,
        {
          labels: {
            confirm: 'Need your confirmation.',
            confirmOk: 'Yes, delete it.',
          },
        }
      );
    },
  }

  const commonMenu = [ renameMenu, addFolderMenu, 
    // addRequestMenu, 
    settingMenu, deleteMenu ];
  const requestMenu = [ renameMenu, deleteMenu ];
  return (
    <>
      <Dropdown
        isOpen={isMenuOpened}
        detach={false}
        onToggle={(value) => toggleMenu(value)}
      >
        <Dropdown.Handler className="transparent icon-more without-border without-padding fc-button" />
        <Dropdown.Options className="bg-main" options={menuType == EMenuType.Request? requestMenu: commonMenu} />
      </Dropdown>
      {/* {
          isAddRequestPoOpen ?
            <Suspense fallback={<>...</>}>
              <AddRequest
                id={`add-folder-${123}`}
                isOpen={isAddRequestPoOpen}
                meta={{
                  collectionId,
                  folderId
                }}
                onClose={() => toggleAddRequestPo(false)}
              />
            </Suspense>
           :<></>
        } */}
    </>
  );
};

export default CollectionMenu;
