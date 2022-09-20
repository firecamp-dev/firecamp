import { FC, useRef, useState } from 'react';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

import { useWorkspaceStore } from '../../../../store/workspace';
import { useRequestStore } from '../../../../store/request';
import { useModalStore } from '../../../../store/modal';
import { TId } from '@firecamp/types';

type TModalMeta = { name: string, description: string, request_id: TId, collection_id: TId };

const EditRequest: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
  height = '732px',
  width = '500px',
}) => {

  const { name, description, request_id, collection_id  } = useModalStore.getState().meta as TModalMeta;
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

  const onCreate = () => {
    if (isRequesting) return;
    const name = request.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The request name must have minimun 3 characters' });
      return;
    }
    const _request = {
      ...request,
      name,
      description: request?.description?.trim(),
    };

    setIsRequesting(true);
    // console.log({ _request });

    useRequestStore.getState().onEditRequest(_request);

    // createRequest(_request)
    //   .then((r)=> {

    //     console.log(r, "r......")
    //     AppService.modals.close();
    //   })
    //   .catch((e)=> {
    //     console.log(e.response, e.response?.data)
    //     AppService.notify.alert(e?.response?.data?.message || e.message )
    //   })
    //   .finally(()=> {
    //     setIsRequesting(false);
    //   });
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
              color={EButtonColor.Secondary}
              transparent={true}
              size={EButtonSize.Small}
              onClick={(e) => onClose()}
              ghost={true}
            />
            <Button
              text={isRequesting ? 'Updating...' : 'Update'}
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              onClick={onCreate}
              disabled={isRequesting}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default EditRequest;