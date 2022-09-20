import { FC, useState } from 'react';
import {
  Input,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

import { useWorkspaceStore } from '../../../store/workspace';
import AppService from '../../../services/app';
import { RE } from '../../../constants';
import { useModalStore } from '../../../store/modal';

type TModalMeta = {
  collectionId: string;
  folderId?: string;
};

const CreateFolder: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const createFolder = useWorkspaceStore.getState().createFolder;
  const { collectionId, folderId } = useModalStore.getState()
    .meta as TModalMeta;

  const [folder, setFolder] = useState({ name: '', description: '' });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setFolder((c) => ({ ...c, [name]: value }));
  };

  const onCreate = () => {
    if (isRequesting) return;
    const name = folder.name.trim();

    if (!collectionId) throw new Error('The collection is not selected');

    if (!name || name.length < 3) {
      setError({ name: 'The folder name must have minimun 3 characters' });
      return;
    }

    if (!RE.NoSpecialCharacters.test(name)) {
      setError({
        name: 'The folder name must not contain any special characters.',
      });
      return;
    }
    const _folder = {
      name,
      description: folder?.description?.trim(),
      _meta: { collection_id: collectionId, folder_id: folderId },
    };

    setIsRequesting(true);
    createFolder(_folder)
      .then((r) => {
        AppService.modals.close();
      })
      .catch((e) => {
        // console.log(e.response, e.response?.data)
        AppService.notify.alert(e?.response?.data?.message || e.message);
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  return (
    <>
      {/* <Modal.Header className='with-divider'>
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Create Folder
        </div>
      </Modal.Header> */}
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            ENTER A NEW FOLDER NAME
          </label>
          <div className="mt-4">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Folder name"
              name={'name'}
              value={folder.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
            />
          </div>

          <TabHeader className="px-4">
            <TabHeader.Right>
              <Button
                text="Cancel"
                color={EButtonColor.Secondary}
                transparent={true}
                size={EButtonSize.Small}
                onClick={(e) => onClose()}
                ghost={true}
              />
              <Button
                text={isRequesting ? 'Creating...' : 'Create'}
                color={EButtonColor.Primary}
                size={EButtonSize.Small}
                onClick={onCreate}
                disabled={isRequesting}
              />
            </TabHeader.Right>
          </TabHeader>
        </div>
      </Modal.Body>
    </>
  );
};

export default CreateFolder;
