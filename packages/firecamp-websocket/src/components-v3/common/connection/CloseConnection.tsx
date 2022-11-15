//@ts-nocheck
import { useState, useEffect } from 'react';
import {
  Button,
  EButtonColor,
  EButtonSize,
  EButtonIconPosition,
  Input,
  Popover,
} from '@firecamp/ui-kit';

import { IoWifi } from '@react-icons/all-files/io5/IoWifi';

const CloseConnection = ({
  buttonId = 'close',
  activePlayground = '',
  closeManually = true,
  onClose = () => {},
}) => {
  let [state, setState] = useState({
    status: '',
    reason: '',
    isStatusDirty: false,
    hasValidStatus: false,
  });

  let [isOpen, toggleOpen] = useState(false);

  let { status, reason, isStatusDirty, hasValidStatus } = state;

  let _handleInputChange = (e) => {
    e.stopPropagation();
    let { name, value } = e.target;

    let checkStaus = (value) => {
      value = value.trim();

      value = Number(value);

      let isValid;
      if (name === 'status') {
        if (
          value === 0 ||
          (((value >= 1000 && value <= 1014) ||
            (value >= 4000 && value <= 4999)) &&
            value !== 1004 &&
            value !== 1005 &&
            value !== 1006)
        ) {
          isValid = true;
        } else {
          isValid = false;
        }
      }
      return isValid;
    };

    setState({
      ...state,
      [name]: value,
      hasValidStatus:
        name === 'status' ? checkStaus(value) : state.hasValidStatus,
      isStatusDirty: true,
    });
  };

  let _onClose = (e) => {
    e.preventDefault();
    status = status.trim();
    if (status.length && !hasValidStatus) return;

    onClose(activePlayground, Number(status), reason);
    // this._toggleCloseDD()
    setState({
      status: '',
      reason: '',
      isStatusDirty: false,
      hasValidStatus: false,
    });

    toggleOpen(!isOpen);
  };

  let _onSubmit = (e) => {
    if (e) e.preventDefault();
  };

  let popover_id = `close-${activePlayground}`;
  // console.log(`hasValidStatus`, hasValidStatus, isStatusDirty);
  return (
    <Popover
      isOpen={isOpen}
      detach={false}
      onToggleOpen={() => toggleOpen(!isOpen)}
      key="close_connection"
      content={
        closeManually === true ? (
          <div className="p-2 w-60">
            <div>
              <form onSubmit={_onSubmit}>
                <div className="mb-2">
                  <Input
                    autoFocus={true}
                    type="number"
                    name="status"
                    id="status"
                    placeholder="Close Status"
                    value={status}
                    onChange={_handleInputChange}
                    error={
                      isStatusDirty && hasValidStatus !== true
                        ? [
                            'Reserved or Invalid status code.',
                            <a
                              key={'link'}
                              href={
                                'https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes'
                              }
                              target={'_blank'}
                            >
                              {' '}
                              Reference
                            </a>,
                          ]
                        : ''
                    }
                  />
                </div>
                <div className="mb-2">
                  <Input
                    type="textarea"
                    name="reason"
                    id="reason"
                    placeholder="Reason"
                    value={reason || ''}
                    onChange={_handleInputChange}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    text="Close WS"
                    // TODO: add color primary-alt
                    color={EButtonColor.Primary}
                    size={EButtonSize.Small}
                    onClick={_onClose}
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          ''
        )
      }
    >
      <Popover.Handler
        id={closeManually === false ? popover_id : `${popover_id}-${buttonId}`}
      >
        <Button
          color={EButtonColor.Primary}
          size={EButtonSize.Small}
          iconPosition={EButtonIconPosition.Left}
          // TODO: add class font-ligh
          text={'Connected'}
          // TODO: Add iconPathHover
          // iconPathHover={'/packages-platform/core/public/assets/icon/png/broken-connection.png'}
          icon={<IoWifi className="ml-2 toggle-arrow" size={12} />}
          onClick={closeManually === false ? onClose : () => {}}
        />
      </Popover.Handler>
    </Popover>
  );
};

export default CloseConnection;
