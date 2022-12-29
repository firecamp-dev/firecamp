import { Input, Container, Notes, CheckboxInGrid } from '@firecamp/ui-kit';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

enum EInputTypes {
  Text='text',
  Boolean= 'boolean',
  Number= 'number',
};

const configInputs = [
  {
    name: 'ping',
    type: EInputTypes.Boolean,
    labelFor: 'Ping',
    label: 'Ping',
  },
  {
    name: 'ping_interval',
    type: EInputTypes.Number,
    labelFor: 'Ping interval',
    label: 'Ping interval',
  },
];

const Config = ({ config = {}, onUpdate }) => {
  const isElectron = _misc.firecampAgent() === EFirecampAgent.Desktop;

  if (!config) return <></>;

  const _onChange = (name, value) => {
    if (!name) return;
    onUpdate(name, value);
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
      case EInputTypes.Text:
      case EInputTypes.Number:
        // console.log(`config["ping"] `, config["ping"]);
        return (
          <Input
            key={`${name}-${index}`}
            autoFocus={false}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder || ''}
            disabled={!isElectron || config['ping'] === false}
            value={config[name]}
            onChange={(e) => {
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
      case EInputTypes.Boolean:
        // console.log(`config[name]`, config[name]);
        return (
          <CheckboxInGrid
            key={`${name}-${index}`}
            isChecked={config[name] || false}
            label={label}
            className="fc-input-wrapper"
            onToggleCheck={() => _onChange(name, !config[name])}
            disabled={!isElectron}
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
      </form>
      {!isElectron ? (
        <Notes
          type="info"
          title="Desktop only feature"
          description="Please download desktop app to access this feature"
          withpadding={true}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Config;
