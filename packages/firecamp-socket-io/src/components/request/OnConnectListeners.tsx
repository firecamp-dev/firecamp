import { useContext, useState } from 'react';
import { Container, Button, Input } from '@firecamp/ui-kit';
import deepEqual from 'deep-equal';

import { SocketContext } from '../Socket.context';
import { _array } from '@firecamp/utils';
const OnConnectListeners = ({ listeners = [], onConnectListeners = [] }) => {
  let { ctx_requestFns } = useContext(SocketContext);

  let { addListener, setOnConnectListeners } = ctx_requestFns;

  let [listenersNames, setListenersNames] = useState('');

  let _handleChangeName = (e) => {
    e.preventDefault();

    let { value } = e.target;
    setListenersNames(value);
  };

  let _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      _onAddListeners();
    }
  };

  /**
   * Add multiple listeners onEnter or press Add button
   * Add listeners and set listen on
   * Update on connect listeners list
   * @param {} e
   */
  let _onAddListeners = (e) => {
    if (e) e.preventDefault();

    let listenersAry = [];

    listenersNames.split(',')?.forEach((l) => {
      let listener = l.trim();

      if (listener) {
        // add listener into the on connect listener list
        listenersAry.push(listener);

        /**
         * Prevent add listener into the common listeners list
         * if already exist
         */
        if (!listeners.includes(listener)) addListener(listener);
      }
    });

    // Uniq array from existing and updated on connect listeners list
    let updatedOnConnListeners = _array.uniq([
      ...onConnectListeners,
      ...listenersAry,
    ]);

    // on add listeners, update on connect listeners if newly added and existing listeners are not same
    if (!deepEqual(updatedOnConnListeners, onConnectListeners)) {
      // Update on connect listener list
      setOnConnectListeners(updatedOnConnListeners);
    }
    // Set listeners name empty
    setListenersNames('');
  };

  let _onDelete = (listener = '') => {
    setOnConnectListeners(_array.without(onConnectListeners, listener));
  };

  return (
    <Container>
      <Container.Header className="fc-listner-popover-header">
        <div className="fc-active-listners-list">
          <div className="fc-active-listner-title">On Connect Listeners</div>
          <div className="flex first-expanded form-group m-8">
            <Input
              className="fc-input border small with-button bg-light form-control"
              autoFocus={true}
              type="text"
              name="status"
              id="status"
              placeholder="Add multiple listeners separated by comma (,)"
              value={listenersNames}
              onChange={_handleChangeName}
              onKeyDown={_onKeyDown}
              postComponents={[
                <Button
                  key={'listener-add-button'}
                  text="Add"
                  onClick={_onAddListeners}
                  disabled={!listenersNames}
                  secondary
                  sm
                />,
              ]}
            />
          </div>
          <div className="fc-active-listner-wrapper">
            {onConnectListeners && onConnectListeners.length ? (
              (onConnectListeners || []).map((listener, index) => {
                return (
                  <div key={index} className="fc-active-listner">
                    {listener || ''}
                    <span
                      className="remove iconv2-close-icon"
                      onClick={(_) => _onDelete(listener)}
                    ></span>
                  </div>
                );
              })
            ) : (
              <div className="fc-active-listner-empty">
                you've no event listeners to listen on connect
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="iconv2-info-icon note-icon mr-2"></span>
          Events start listening on connection open
        </div>
      </Container.Header>
      <Container.Footer></Container.Footer>
    </Container>
  );
};

export default OnConnectListeners;
