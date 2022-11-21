import { useState } from 'react';
import { Button, Input, Popover } from '@firecamp/ui-kit';

const CloseConnection = ({
  buttonId = 'close',
  activePlayground = '',
  closeManually = true,
  onClose,
}) => {
  const [state, setState] = useState({
    status: '',
    reason: '',
    isStatusDirty: false,
    hasValidStatus: false,
  });

  const [isOpen, toggleOpen] = useState(false);

  const { status, reason, isStatusDirty, hasValidStatus } = state;

  const _handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;

    const checkStatus = (value) => {
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
        name === 'status' ? checkStatus(value) : state.hasValidStatus,
      isStatusDirty: true,
    });
  };

  const _onClose = (e) => {
    e.preventDefault();
    const _status = status.trim();
    if (status.length && !hasValidStatus) return;

    onClose(activePlayground, Number(_status), reason);
    // this._toggleCloseDD()
    setState({
      status: '',
      reason: '',
      isStatusDirty: false,
      hasValidStatus: false,
    });

    toggleOpen(!isOpen);
  };

  const _onSubmit = (e) => {
    if (e) e.preventDefault();
  };

  const popoverId = `close-${activePlayground}`;
  // console.log(`hasValidStatus`, hasValidStatus, isStatusDirty);
  return (
    <Popover
      isOpen={isOpen}
      detach={false}
      onToggleOpen={() => toggleOpen(!isOpen)}
      key="closeConnection"
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
                      isStatusDirty && hasValidStatus !== true ? (
                        <>
                          <span>Reserved or Invalid status code.</span>
                          <a
                            key={'link'}
                            href={
                              'https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes'
                            }
                            target={'_blank'}
                          >
                            Reference
                          </a>
                        </>
                      ) : (
                        <></>
                      )
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
                  <Button text="Close WS" primary sm onClick={_onClose} />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )
      }
    >
      <Popover.Handler
        id={closeManually === false ? popoverId : `${popoverId}-${buttonId}`}
      >
        <Button
          text={'Connected'}
          onClick={closeManually === false ? onClose : () => {}}
          primary
          xs
          iconLeft
        />
      </Popover.Handler>
    </Popover>
  );
};

export default CloseConnection;
