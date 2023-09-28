import { FC, useState } from 'react';
import { Info } from 'lucide-react';
import {
  Input,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
  TextArea,
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

const EditRequest: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
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
    <Modal
      opened={opened}
      onClose={onClose}
      size={450}
      title={
        <div className="text-lg leading-5 px-6 flex items-center font-medium display-block">
          <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mt-2">
            Update Request Info
          </label>
        </div>
      }
      classNames={{
        body: '!p-0',
      }}
    >
      <>
        <ProgressBar active={isRequesting} />
        <div className="p-6 !pb-0 mx-4 ">
          <div className="">
            <Input
              label="Name"
              placeholder="Request name"
              name={'name'}
              value={request.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              data-autofocus
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>
          <TextArea
            minRows={8}
            label="Description (optional)"
            placeholder="Description"
            name={'description'}
            value={request.description}
            onChange={onChange}
          />
          <div className="mb-3 text-xs flex items-center justify-start text-app-foreground">
            <Info size={14} className="pr-1" />
            Markdown supported in description
          </div>
        </div>
      </>

      <div className="!py-3 border-t border-app-border">
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
      </div>
    </Modal>
  );
};

export default EditRequest;
