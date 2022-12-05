import { Input, Container, TabHeader, CheckboxInGrid } from '@firecamp/ui-kit';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import { EWebsocketConfigKeys } from '../../../types';

const INPUT_TYPES = {
  text: 'text',
  boolean: 'boolean',
  number: 'number',
  dropdown: 'dropdown',
};

const configInputs = [
  /* {
    name: "default_connection",
    type: INPUT_TYPES.dropdown,
    labelFor: "Default connection",
    label: "Default connection"
  }, */
  {
    name: EWebsocketConfigKeys.Reconnect,
    type: INPUT_TYPES.boolean,
    labelFor: 'Reconnect',
    label: 'Reconnect',
  },
  {
    name: EWebsocketConfigKeys.ReconnectAttempts,
    type: INPUT_TYPES.number,
    labelFor: 'Reconnect attempt',
    label: 'Reconnect attempt',
    placeholder: '',
  },
  {
    name: EWebsocketConfigKeys.ReconnectTimeout,
    type: INPUT_TYPES.number,
    labelFor: 'Reconnect timeout',
    label: 'Reconnect timeout',
    placeholder: 'Default 3000 ms, Timeout in milliseconds.',
  },
  {
    name: EWebsocketConfigKeys.Protocols,
    type: INPUT_TYPES.text,
    labelFor: 'Protocols',
    label: 'Protocols',
    placeholder: `Separate by "," for multiple protocols`,
  },
];

const electronSideConfig = [
  {
    name: EWebsocketConfigKeys.RejectUnauthorized,
    type: INPUT_TYPES.boolean,
    labelFor: 'Reject Unauthorized',
    label: 'Reject Unauthorized',
    placeholder: '',
  },
  {
    name: EWebsocketConfigKeys.HandshakeTimeout,
    type: INPUT_TYPES.number,
    labelFor: 'Handshake timeout',
    label: 'Handshake timeout',
    placeholder: 'Timeout in milliseconds for the handshake request',
  },
  {
    name: EWebsocketConfigKeys.FollowRedirects,
    type: INPUT_TYPES.boolean,
    labelFor: 'Follow redirects',
    label: 'Follow redirects',
  },
  {
    name: EWebsocketConfigKeys.MaxRedirects,
    type: INPUT_TYPES.number,
    labelFor: 'Max redirects',
    label: 'Max redirects',
    placeholder: 'Default 10,The maximum number of redirects allowed',
  },
  {
    name: EWebsocketConfigKeys.ProtocolVersion,
    type: INPUT_TYPES.number,
    labelFor: 'Protocol version',
    label: 'Protocol version',
    placeholder: 'Value of the Sec-WebSocket-Version header',
  },
  {
    name: EWebsocketConfigKeys.Origin,
    type: INPUT_TYPES.text,
    labelFor: 'Origin',
    label: 'Origin',
    placeholder: 'Value of Sec-WebSocket-Origin header',
  },
  {
    name: EWebsocketConfigKeys.MaxPayload,
    type: INPUT_TYPES.number,
    labelFor: 'Max payload',
    label: 'Max payload',
    placeholder: 'The maximum allowed message size in bytes.',
  },
];

const Config = ({ connections = [], config = {} }) => {
  const onChangeConfig = (a, b) => {}; //todo: use zustand store here

  if (!config) {
    return <span />;
  }

  /*  const connection_menu = [],
     default_connection_name = "";
 
   if (connections) {
     connections.map(con => {
       connection_menu = [
         ...connection_menu,
         {
           id: con.id,
           name: con.name
         }
       ];
     });
 
     default_connection_name = connections.find(
       conn => conn.id === config["default_connection"]
     )
       ? connections.find(conn => conn.id === config["default_connection"])
         .name
       : "Default";
   } */

   const _onChange = (name, value) => {
    if (!name) return;

    if (name === EWebsocketConfigKeys.Protocols) {
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
      onChangeConfig(EWebsocketConfigKeys.Protocols, protocolsAry);
    } else {
      onChangeConfig(name, value);
    }
  };

  const _renderElement = (element, index = 1) => {
    const {
      name,
      type,
      // labelFor,
      label,
      placeholder,
    } = element;

    if (!type) return <span />;

    // console.log(`config[name]`, name, config[name])
    switch (type) {
      case INPUT_TYPES.text:
      case INPUT_TYPES.number:
        let isDisabled = false;
        if (
          name === EWebsocketConfigKeys.MaxRedirects &&
          config[EWebsocketConfigKeys.FollowRedirects] === false
        ) {
          isDisabled = true;
        }

        if (
          (name === EWebsocketConfigKeys.ReconnectTimeout ||
            name === EWebsocketConfigKeys.ReconnectAttempts) &&
          config[EWebsocketConfigKeys.Reconnect] === false
        ) {
          isDisabled = true;
        }

        let value;
        if (name === EWebsocketConfigKeys.Protocols) {
          value =
            (config[EWebsocketConfigKeys.Protocols] || []).join(',') || '';
        } else {
          value = config[name];
          value = value.toString(); //if value is numeric then MonacoEditor fires an error
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
            value={value}
            onChange={(e: any) => {
              if (e) {
                e.preventDefault();
                let { name, value } = e.target;
                _onChange(name, value);
              }
            }}
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
            onToggleCheck={() => _onChange(name, !config[name])}
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

  return (
    <Container>
      <form className="fc-form grid p-2" onSubmit={_handleSubmit}>
        {configInputs
          ? configInputs.map((config, index) => _renderElement(config, index))
          : ''}
        {_misc.firecampAgent() === EFirecampAgent.Desktop && electronSideConfig
          ? electronSideConfig.map((config, index) =>
              _renderElement(config, index)
            )
          : ''}
      </form>
      <Container.Footer>
        <TabHeader className="height-small">
          <TabHeader.Right>
            <a
              className="fc-button small font-light transparent bordered btn btn-primary-alt btn btn-secondary"
              href={
                'https://firecamp.io/docs/clients/websocket/configure-request-setting'
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
