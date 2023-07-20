import { FC, useState } from 'react';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { ERequestTypes, TId } from '@firecamp/types';
import { useModalStore } from '../../../../store/modal';
import platformContext from '../../../../services/platform-context';
import { useExplorerStore } from '../../../../store/explorer';

type TModalMeta = {
  name: string;
  description: string;
  requestType: ERequestTypes;
  requestId: TId;
  collectionId: TId;
  folderId?: TId;
};

const EditRequest: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
  height = '732px',
  width = '500px',
}) => {
  const { name, description, requestId, requestType, collectionId, folderId } =
    useModalStore.getState().__meta as TModalMeta;
  const [request, setRequest] = useState({
    name,
    description,
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
      __meta: {
        name,
        description: request?.description?.trim(),
        type: requestType,
      },
      __ref: {
        id: requestId,
        collectionId,
        folderId,
      },
      __changes: { __meta: ['name', 'description'] },
    };

    setIsRequesting(true);
    platformContext.request
      .save(_request)
      .then((res) => {
        platformContext.app.modals.close();
        const { onUpdateRequest } = useExplorerStore.getState();
        onUpdateRequest({
          __meta: { name, description },
          __ref: { id: requestId },
        });
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  return (
    <>
      {/* <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium display-block">
          <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mt-2">
            Update Request Info
          </label>
        </div>
      </Modal.Header> */}
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
            labelClassName="fc-input-label"
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

      <Modal.Footer className="!py-3 border-t border-app-border">
        <TabHeader className="px-6">
          <TabHeader.Right>
            <Button text="Cancel" onClick={(e) => onClose()} ghost xs />
            <Button
              text={isRequesting ? 'Updating...' : 'Update'}
              onClick={onUpdate}
              disabled={isRequesting}
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default EditRequest;
