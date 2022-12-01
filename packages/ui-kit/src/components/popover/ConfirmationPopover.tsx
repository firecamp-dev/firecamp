import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button, Popover } from '@firecamp/ui-kit';
import classnames from 'classnames';

import { IConfirmationPopover } from './interfaces/ConfirmationPopover.interfaces';

const ConfirmationPopover: FC<IConfirmationPopover> = ({
  id = '',
  className = '',
  handler = {},
  title = '',
  message = '',
  position = 'bottom',
  _meta: {
    showDefaultHandler = false,
    showDeleteIcon = true,
    defaultHandlerText = 'Delete',
    tooltip = '',
    confirmButtonText = '',
    cancelButtonText = '',
  },
  onConfirm = () => {},
  isOpen: propIsOpen = false,
  detach = true,
  onToggle = (isOpen: boolean) => {},
}) => {
  if (!title.length && !message.length) {
    return <span />;
  }

  let [isOpen, toggleOpen] = useState(false);

  useEffect(() => {
    if (detach === false) {
      toggleOpen(propIsOpen);
    }
  }, [propIsOpen]);

  let _toggleOpen = (value: boolean) => {
    // console.log(`value`, value);
    if (onToggle && detach === false) {
      onToggle(value);
    }
    if (detach === true) {
      toggleOpen(value);
    }
  };

  let popover_id = `confirm-popover-${id}`;

  return (
    <Popover
      id={popover_id}
      className={classnames(className, 'delete-confirmation-wrapper')}
      detach={false}
      isOpen={isOpen}
      positions={[position]}
      onToggleOpen={() => {
        _toggleOpen(!isOpen);
      }}
      content={
        <div className="p-2">
          <div className="mb-2 w-40">
            {title && title.length ? <p>{title}</p> : ''}
            {message && message.length ? <p>{message}</p> : ''}
          </div>
          <div className="flex justify-end">
            <div className="ml-auto flex">
              <Button
                text={cancelButtonText || 'Cancel'}
                secondary
                sm
                // className="small fc-button"
                onClick={() => {
                  _toggleOpen(!isOpen);
                }}
                className="mr-2"
              />

              <Button
                text={confirmButtonText || 'Delete'}
                // color="primary-alt"
                // className="small fc-button"
                primary
                sm
                onClick={() => {
                  onConfirm();
                  _toggleOpen(!isOpen);
                }}
              />
            </div>
          </div>
        </div>
      }
    >
      <Popover.Handler tooltip={tooltip}>
        {handler ? (
          handler
        ) : showDeleteIcon === true ? (
          <Button
            id={`confirm-popover-handler-${id}`}
            text=""
            className="small square"
            secondary
          />
        ) : showDefaultHandler === true ? (
          <DefaultHandler text={defaultHandlerText} />
        ) : (
          ''
        )}
      </Popover.Handler>
    </Popover>
  );
};

export default ConfirmationPopover;

const DefaultHandler = ({ text = '' }) => {
  return (
    <Button
      // color="secondary"
      // className="btn-secondary btn btn-small"
      secondary
      sm
      text={text || 'Delete'}
    />
  );
};
