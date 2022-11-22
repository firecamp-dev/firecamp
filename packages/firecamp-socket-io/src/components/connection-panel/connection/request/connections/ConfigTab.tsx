import {
  Container,
  CheckboxGroup,
  CheckboxInGrid,
  Input,
} from '@firecamp/ui-kit';

const INPUT_TYPES = {
  text: 'text',
  boolean: 'boolean',
  number: 'number',
  dropdown: 'dropdown',
};

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
    type: INPUT_TYPES.boolean,
    labelFor: 'Force new',
    label: 'Force new',
  },
  {
    name: 'namespace',
    type: INPUT_TYPES.text,
    labelFor: 'Namespace',
    label: 'Namespace',
  },
  {
    name: 'path',
    type: INPUT_TYPES.text,
    labelFor: 'Path',
    label: 'Path',
    placeholder: '',
  },
  {
    name: 'ping',
    type: INPUT_TYPES.boolean,
    labelFor: 'Ping',
    label: 'Ping',
    placeholder: '',
  },
  {
    name: 'pingInterval',
    type: INPUT_TYPES.number,
    labelFor: 'Ping interval',
    label: 'Ping interval',
    placeholder: '',
  },
];

const ConfigTab = ({
  connection = {},
  requestConfig = {},
  onUpdate = (key, value) => {},
}) => {
  const transportCheckBoxes = [
    {
      id: 'websocket',
      isChecked: connection['transports']
        ? connection['transports'].websocket
        : false,
      label: 'Websocket',
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

  const _onChange = (name, value) => {
    if (!name) return;
    // console.log(`name`, name, value);

    onUpdate(name, value);
  };

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
      case INPUT_TYPES.text:
      case INPUT_TYPES.number:
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
            // min={type === INPUT_TYPES.number ? 0 : ''}
            isEditor={true}
          />
        );
        break;

      case INPUT_TYPES.boolean:
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
