import { FC, useState } from 'react';
import {
  Input,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

import { useWorkspaceStore } from '../../../store/workspace';
import AppService from '../../../services/app';
import { RE } from '../../../types'

const CreateCollection: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const createCollection = useWorkspaceStore.getState().createCollection;

  const [collection, setCollection] = useState({ name: '', description: '' });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setCollection((c) => ({ ...c, [name]: value }));
  };

  const onCreate = () => {
    if (isRequesting) return;
    const name = collection.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The collection name must have minimum 3 characters' });
      return;
    }

    if (!RE.NoSpecialCharacters.test(name)) {
      setError({
        name: 'The collection name must not contain any special characters.',
      });
      return;
    }
    const _col = { name, description: collection?.description?.trim() };

    setIsRequesting(true);
    createCollection(_col)
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
          Create Collection
        </div>
      </Modal.Header> */}
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            ENTER A NEW COLLECTION NAME
          </label>
          <div className="mt-4">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Collection name"
              name={'name'}
              value={collection.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>

          <TabHeader className="px-4">
            <TabHeader.Right>
              <Button
                text="Cancel"
                secondary
                transparent={true}
                sm
                onClick={(e) => onClose()}
                ghost={true}
              />
              <Button
                text={isRequesting ? 'Creating...' : 'Create'}
                primary
                sm
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

export default CreateCollection;
