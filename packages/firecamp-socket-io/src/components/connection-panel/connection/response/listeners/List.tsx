import shallow from 'zustand/shallow';

import { useSocketStore } from '../../../../../store';
import './listners.scss';

const List = ({ listeners = {}, activePlayground = '' }) => {
  let { deletePlaygroundListener } = useSocketStore(
    (s) => ({
      deletePlaygroundListener,
    }),
    shallow
  );
  let removeListener = (name) => {
    if (!name) return;
    deletePlaygroundListener(activePlayground, name);
  };

  return (
    <div className="fc-listners-list">
      {Object.keys(listeners).map((listener, index) => {
        return (
          <Listener
            id={index}
            key={index}
            activePlayground={activePlayground}
            name={listener || ''}
            value={listeners[listener] || false}
            removeListener={(name) => removeListener(name)}
          />
        );
      })}
    </div>
  );
};

export default List;

const Listener = ({
  id = '',
  activePlayground = '',
  name = 'Listener',
  value = false,
}) => {
  let { updatePlaygroundListener, deletePlaygroundListener } = useSocketStore(
    (s) => ({
      updatePlaygroundListener: s.updatePlaygroundListener,
      deletePlaygroundListener: s.deletePlaygroundListener,
    })
  );

  let uniqueId = `${activePlayground}-${id}-listen`;

  let _onToggleListen = (event) => {
    updatePlaygroundListener(
      activePlayground,
      name,
      event?.target?.checked || false
    );
  };

  let _onRemove = (event) => {
    if (event) event.preventDefault();
    deletePlaygroundListener(activePlayground, name);
  };

  return (
    <div className="fc-listners-list-item flex text-sm justify-center items-center relative px-2 py-0.5">
      <div
        className="flex-1 overflow-hidden overflow-ellipsis "
        data-tip={name}
        id={`${uniqueId}-name`}
      >
        {name}
      </div>
      <div>
        <div className="toggleWrapper small">
          <input
            className="switch"
            type="checkbox"
            name={uniqueId}
            id={uniqueId}
            checked={value}
            onChange={_onToggleListen}
          />
          <label htmlFor={uniqueId} className="toggle">
            <span className="toggle__handler" />
          </label>
        </div>
      </div>
      <div className="fc-listners-list-item-action" onClick={_onRemove}>
        <span className="icon-close"></span>
      </div>
    </div>
  );
};
