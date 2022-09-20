import { FC, useState } from 'react';
import {
  Dropdown,
  Popover,
  Button,
  EButtonColor,
  EButtonSize,
} from '@firecamp/ui-kit';
import { useForm } from 'react-hook-form';
import { ERequestTypes } from '@firecamp/types';
import { nanoid } from 'nanoid';

import { RE } from '../../../../constants';
import { useWorkspaceStore } from '../../../../store/workspace';

const requestTypeOptions = [
  {
    name: 'Rest',
    type: ERequestTypes.Rest,
  },
  {
    name: 'GraphQL',
    type: ERequestTypes.GraphQL,
  },
  {
    name: 'WebSocket',
    type: ERequestTypes.WebSocket,
  },
  {
    name: 'SocketIO',
    type: ERequestTypes.SocketIO,
  },
];

const AddRequest: FC<IAddRequest> = ({
  id = '',
  isOpen = false,
  meta,
  onClose = () => {},
}) => {
  let [isReqDDOpen, toggleDDOpen] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const { create } = useWorkspaceStore((s) => ({ create: s.createRequest }));

  const [requestType, setType] = useState(requestTypeOptions[0]);

  const _submitName = async ({ requestName = '' }) => {
    if (errors.requestName) return;
    try {
      const name = requestName.trim();
      const type = requestType.type;
      const model: any = {
        meta: {
          name,
          type,
        },
        _meta: {
          id: nanoid(),
          collection_id: meta.collectionId,
          folder_id: meta.folderId,
        },
      };
      if (type == ERequestTypes.Rest) model.method = 'GET';
      if (type == ERequestTypes.GraphQL) model.method = 'POST';
      create(model);
    } catch (e) {
      console.log(e);
    } finally {
      onClose(false);
    }
  };

  const _onSelectType = (option) => {
    setType(option.type);
  };

  return (
    <Popover
      isOpen={isOpen}
      detach={false}
      onToggleOpen={onClose}
      content={
        <div className="p-2">
          <form onSubmit={handleSubmit(_submitName)}>
            <div className="mb-1">
              <div className="text-sm font-bold mb-1 text-appForeground opacity-70">
                Request Type
              </div>

              <Dropdown
                className={'sm'}
                isOpen={isReqDDOpen}
                onToggle={() => toggleDDOpen(!isReqDDOpen)}
                detach={false}
              >
                <Dropdown.Handler>
                  <Button
                    text={requestType.name}
                    size={EButtonSize.ExSmall}
                    withCaret={true}
                    color={EButtonColor.Secondary}
                  />
                </Dropdown.Handler>
                <Dropdown.Options
                  options={requestTypeOptions}
                  onSelect={_onSelectType}
                />
              </Dropdown>
            </div>
            <div className="mb-1 relative">
              <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
                Request name
              </div>
              <input
                autoFocus={true}
                type="text"
                placeholder="Enter request name"
                name="requestName"
                ref={register({
                  required: true,
                  maxLength: 50,
                  minLength: 1,
                  pattern: RE.CollectionName,
                })}
                className="mb-1"
              />
            </div>
            {errors.requestName ? (
              <div className="text-xs font-light text-error">
                {'Invalid name'}
              </div>
            ) : (
              <div className="text-xs text-appForeground ">{`> hit enter to add request`}</div>
            )}
          </form>
        </div>
      }
    >
      <Popover.Handler
        id={`add-request-${id}`}
        // className="transparent icon-more without-border without-padding fc-button"
      />
    </Popover>
  );
};

export default AddRequest;

/**
 * Popover to add request
 */
interface IAddRequest {
  /**
   * Unique identity to popover
   */
  id: string;

  /**
   * Boolean value whether popover is open or not
   */
  isOpen: boolean;

  /**
   * Popover meta, {collectionId, folderID}
   */
  meta: {
    collectionId: string;
    folderId: string;
  };

  /**
   * A function to close popover
   */
  onClose: (close: boolean) => void;
}
