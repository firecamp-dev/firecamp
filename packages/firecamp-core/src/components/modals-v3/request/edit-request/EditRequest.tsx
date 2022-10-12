import { FC, useRef, useState } from 'react';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { TId } from '@firecamp/types';

import { useModalStore } from '../../../../store/modal';
import { useWorkspaceStore } from '../../../../store/workspace'
import AppService from '../../../../services/app'

type TModalMeta = { name: string, description: string, request_id: TId, collection_id: TId, folder_id?: TId };

const EditRequest: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
  height = '732px',
  width = '500px',
}) => {

  const { name, description, request_id, collection_id, folder_id  } = useModalStore.getState().meta as TModalMeta;
  const [request, setRequest] = useState({
    name,
    description
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setRequest((r) => ({ ...r, [name]: value }));
  };

  const onUpdate = () => {
    if (isRequesting) return;
    const name = request.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The request name must have minimum 3 characters' });
      return;
    }
    const _request = {
      meta: {
        name,
        description: request?.description?.trim(),
      },
      _meta: {
        id: request_id,
        collection_id,
        folder_id
      }
    };

    setIsRequesting(true);
    const {  updateRequest } = useWorkspaceStore.getState()
    updateRequest(request_id, _request)
      .then((res)=> {
        AppService.modals.close();
      })
      .finally(()=> {
        setIsRequesting(false);
      });
  };

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium display-block">
          {/* Update Request Info */}
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mt-2">
              Update Request Info
            </label>
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-6 !pb-0">
          <div className="">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Request name"
              name={'name'}
              value={request.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>

          <TextArea
            type="text"
            minHeight="200px"
            label="Description (optional)"
            labelClassname="fc-input-label"
            placeholder="Description"
            note="Markdown supported in description"
            name={'description'}
            value={request.description}
            onChange={onChange}
            // disabled={true}
            // iconPosition="right"
            // icon={<VscEdit />}
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="!py-3 border-t border-appBorder">
        <TabHeader className="px-6">
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
              text={isRequesting ? 'Updating...' : 'Update'}
              primary
              sm
              onClick={onUpdate}
              disabled={isRequesting}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default EditRequest;