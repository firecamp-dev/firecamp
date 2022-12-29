import { useState } from 'react';
import { Container, Button, Input } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { _array } from '@firecamp/utils';
import { IStore, useStore } from '../../store';

const OnConnectListeners = ({ listeners = [], onConnectListeners = [] }) => {
  const {
    changeListeners,
    addListenersToAllPlaygrounds,
    deleteListenerFromAllPlaygrounds,
  } = useStore(
    (s: IStore) => ({
      changeListeners: s.changeListeners,
      addListenersToAllPlaygrounds: s.addListenersToAllPlaygrounds,
      deleteListenerFromAllPlaygrounds: s.deleteListenerFromAllPlaygrounds,
    }),
    shallow
  );

  const [listenersNames, setListenersNames] = useState('');

  const _handleChangeName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setListenersNames(value);
  };

  const _onKeyDown = (e) => {
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
   const _onAddListeners = (e?:any) => {
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
        if (!listeners.includes(listener))
          addListenersToAllPlaygrounds(listener);
      }
    });

    // update request slice
    changeListeners([...listeners, listener]);

    // Set listeners name empty
    setListenersNames('');
  };

  const _onDelete = (listener = '') => {
    changeListeners(_array.without(onConnectListeners, listener));
    deleteListenerFromAllPlaygrounds(listener);
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
                      onClick={() => _onDelete(listener)}
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
