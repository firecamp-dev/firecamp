import { Container, CheckboxGroup, CheckboxInGrid, Input } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';
import { shallow } from 'zustand/shallow';

enum EInputTypes {
  Text = 'text',
  Boolean = 'boolean',
  Number = 'number',
  Dropdown = 'dropdown',
}

/**
 * "forceNew": false,
 "namespace": "",
 "path": "",
 "ping": false,
 "pingInterval": 3000,
 "transports": {
          "websocket": false,
          "polling": true
        },
 * @type {*[]}
 */

const connectionInputs = [
  {
    name: 'forceNew',
    type: EInputTypes.Boolean,
    labelFor: 'Force new',
    label: 'Force new',
  },
  {
    name: 'namespace',
    type: EInputTypes.Text,
    labelFor: 'Namespace',
    label: 'Namespace',
  },
  {
    name: 'path',
    type: EInputTypes.Text,
    labelFor: 'Path',
    label: 'Path',
    placeholder: '',
  },
  {
    name: 'ping',
    type: EInputTypes.Boolean,
    labelFor: 'Ping',
    label: 'Ping',
    placeholder: '',
  },
  {
    name: 'pingInterval',
    type: EInputTypes.Number,
    labelFor: 'Ping interval',
    label: 'Ping interval',
    placeholder: '',
  },
];

const ConfigTab = ({ id = '' }) => {
  const { connection, updateConnection } = useStore(
    (s: IStore) => ({
      connection: s.request.connection,
      updateConnection: s.updateConnection,
    }),
    shallow
  );
  const _onChange = (name, value) => {
    if (!name) return;
    updateConnection(name, value);
  };
  const transportCheckBoxes = [
    {
      id: 'websocket',
      isChecked: connection['transports']
        ? connection['transports'].websocket
        : false,
      label: 'WebSocket',
      showLabel: true,
      disabled: false,
    },
    {
      id: 'polling',
      isChecked: connection['transports']
        ? connection['transports'].polling
        : false,
      label: 'Polling',
      showLabel: true,
      disabled: false,
    },
  ];
  const _renderElement = (element, index = 1) => {
    let {
      name,
      type,
      // labelFor,
      label,
      placeholder,
    } = element;

    if (!type) return <span />;

    switch (type) {
      case EInputTypes.Text:
      case EInputTypes.Number:
        let isDisabled = false;
        if (name === 'pingInterval') {
          isDisabled = !connection['ping'];
        }
        // console.log(`name`, name, type);
        return (
          <Input
            key={`${name}-${index}`}
            autoFocus={false}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder || ''}
            disabled={isDisabled}
            value={connection[name] || ''}
            onChange={(e) => {
              if (e) {
                e.preventDefault();
                let { name, value } = e.target;
                _onChange(name, value);
              }
            }}
            // min={type === EInputTypes.number ? 0 : ''}
            isEditor={true}
          />
        );
        break;

      case EInputTypes.Boolean:
        return (
          <CheckboxInGrid
            key={`${name}-${index}`}
            isChecked={connection[name] || false}
            label={label}
            className="fc-input-wrapper"
            onToggleCheck={(_) => _onChange(name, !connection[name])}
            disabled={name === 'pingInterval' && connection['ping'] !== true}
          />
        );
        break;

      default:
        return <span />;
    }
  };
  const _handleSubmit = (e) => {
    e && e.preventDefault();
  };
  const _handleTransportsCheckBox = (value = {}) => {
    let transports = Object.assign({}, connection['transports'] || {}, value);
    _onChange('transports', transports);
  };

  return (
    <Container>
      <form className="fc-form grid p-2" onSubmit={_handleSubmit}>
        {connectionInputs
          ? connectionInputs.map((ele, index) => _renderElement(ele, index))
          : ''}
        <CheckboxGroup
          onToggleCheck={_handleTransportsCheckBox}
          checkboxLabel={'Transports'}
          showLabel={true}
          list={transportCheckBoxes}
        />
      </form>
    </Container>
  );
};

export default ConfigTab;
