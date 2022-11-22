import { Container, TabHeader, CheckboxInGrid, Input } from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';
import OnConnectListeners from './OnConnectListeners';
import { useSocketStore } from '../../store';

const INPUT_TYPES = {
  text: 'text',
  boolean: 'boolean',
  number: 'number',
  dropdown: 'dropdown',
};

let config_inputs = [
  /* {
    name: "defaultConnection",
    type: INPUT_TYPES.dropdown,
    labelFor: "Default connection",
    label: "Default connection"
  }, */
  {
    name: 'rejectUnauthorized',
    type: INPUT_TYPES.boolean,
    labelFor: 'Reject unauthorized',
    label: 'Reject unauthorized',
    isDisabled: _misc.firecampAgent() !== EFirecampAgent.desktop,
  },
  {
    name: 'timeout',
    type: INPUT_TYPES.number,
    labelFor: 'Timeout',
    label: 'Timeout',
  },
  {
    name: 'reconnection',
    type: INPUT_TYPES.boolean,
    labelFor: 'Reconnection',
    label: 'Reconnection',
    placeholder: '',
  },
  {
    name: 'reconnectionAttempts',
    type: INPUT_TYPES.number,
    labelFor: 'Reconnection attempts',
    label: 'Reconnection attempts',
    placeholder: '',
  },
  {
    name: 'reconnectionDelay',
    type: INPUT_TYPES.number,
    labelFor: 'Reconnection delay',
    label: 'Reconnection delay',
    placeholder: '',
  },
  {
    name: 'reconnectionDelayMax',
    type: INPUT_TYPES.number,
    labelFor: 'Reconnection delay max',
    label: 'Reconnection delay max',
    placeholder: '',
  },
];

const Config = ({ config = {}, listeners = [] }) => {
  let { config, changeConfig } = useSocketStore((s) => ({
    config: s.request.config,
    changeConfig: s.changeConfig,
  }));

  if (!config) {
    return <span />;
  }

  let _onChange = (name, value) => {
    if (!name) return;

    if (name === 'protocols') {
      let protocolsAry = [];
      if (value.length) {
        protocolsAry = value.split(',');
        protocolsAry = protocolsAry.map((ele, i) => {
          let e = ele.trim();
          if (e) {
            return e;
          } else {
            return '';
          }
        });
      }
      changeConfig('protocols', protocolsAry);
    } else {
      changeConfig(name, value);
    }
  };

  let _renderElement = (element, index = 1) => {
    let { name, type, labelFor, label, placeholder, isDisabled } = element;

    if (!type) return <span />;

    switch (type) {
      case INPUT_TYPES.text:
      case INPUT_TYPES.number:
        if (
          (name === `reconnectionAttempts` ||
            name === `reconnectionDelay` ||
            name === `reconnectionDelayMax`) &&
          config['reconnection'] === false
        ) {
          isDisabled = true;
        }
        return (
          <Input
            key={`${name}-${index}`}
            autoFocus={false}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder || ''}
            disabled={isDisabled}
            value={
              name === 'protocols'
                ? (config.protocols || []).join(',') || ''
                : config[name] || ''
            }
            onChange={(e) => {
              if (e) {
                e.preventDefault();
                let { name, value } = e.target;
                _onChange(name, value);
              }
            }}
            min={type === INPUT_TYPES.number ? 0 : ''}
            isEditor={true}
          />
        );
        break;
      case INPUT_TYPES.boolean:
        return (
          <CheckboxInGrid
            key={`${name}-${index}`}
            label={label}
            isChecked={config[name] || false}
            className="fc-input-wrapper"
            disabled={isDisabled}
            onToggleCheck={() => _onChange(name, !config[name])}
            note={
              _misc.firecampAgent() !== EFirecampAgent.desktop &&
              name === 'rejectUnauthorized'
                ? 'Desktop only feature'
                : ''
            }
          />
        );
        break;
      default:
        return <span />;
    }
  };

  let _handleSubmit = (e) => {
    e && e.preventDefault();
  };

  return (
    <Container>
      <Container.Header>
        <Container>
          <OnConnectListeners
            listeners={listeners}
            onConnectListeners={config.onConnectListeners || []}
          />
        </Container>
      </Container.Header>
      <Container.Footer>
        <form className="fc-form grid p-3" onSubmit={_handleSubmit}>
          {config_inputs
            ? config_inputs.map((config, index) =>
                _renderElement(config, index)
              )
            : ''}
        </form>
        <TabHeader className="height-small">
          <TabHeader.Right>
            <a
              className="transparent border btn text-secondaryBG px-3 py-1"
              href={
                'https://firecamp.io/docs/clients/socketio/configuring-socket-setting'
              }
              target={'_blank'}
            >
              Help
            </a>
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Config;
