import {
  Editor,
  Input,
  FileInput,
  Container,
  QuickSelection,
  Checkbox
} from '@firecamp/ui-kit';
import { EMITTER_PAYLOAD_TYPES } from '../../../../../../constants';

const Body = ({
  emitterName = '',

  activeArgType = {},
  emitterBody = '',
  playgroundBody = '',
  quickSelectionMenus = [],
  setEmitterBody = () => {},
  setEditorDOM = () => {},
  updateEmitterBody = () => {},
  shortcutFns = {},
  onSelectFile = () => {}
}) => {
  let _renderActiveBody = (type = {}) => {
    if (!type || !type.id) return <span />;

    if (
      type.id === EMITTER_PAYLOAD_TYPES.boolean &&
      typeof playgroundBody !== 'boolean'
    ) {
      playgroundBody = true;
    }

    switch (type.id) {
      case EMITTER_PAYLOAD_TYPES.text:
      case EMITTER_PAYLOAD_TYPES.json:
      case EMITTER_PAYLOAD_TYPES.arraybuffer:
      case EMITTER_PAYLOAD_TYPES.arraybufferview:
        let value = !isNaN(playgroundBody)
          ? playgroundBody.toString()
          : playgroundBody;
        if (typeof value === 'string') {
          return (
            <Editor
              autoFocus={!!emitterName}
              /* key={`${tabId}-${
                type.id
              }-${activeArgIndex}-${playgroundBody.length || 0}`}*/
              language={
                type.id === EMITTER_PAYLOAD_TYPES.json ? 'json' : 'ife-text'
              }
              value={value || ''}
              onChange={({ target: { value } }) => {
                if (playgroundBody !== value) {
                  setEmitterBody(value);
                  updateEmitterBody(value);
                }
              }}
              // controlsConfig={{
              //   show:
              //     activeArgType.id !== EMITTER_PAYLOAD_TYPES.no_body &&
              //     typeof playgroundBody === 'string' &&
              //     activeArgType.id !== EMITTER_PAYLOAD_TYPES.file,
              //   position: 'vertical'
              // }}
              monacoOptions={{
                name: 'Emitter',
                width: '100%',
                fontSize: 13,
                highlightActiveLine: false,
                showLineNumbers: false,
                tabSize: 2,
                cursorStart: 1
              }}
              {...shortcutFns}
            />
          );
        } else {
          return <QuickSelection menus={quickSelectionMenus} />;
        }

        break;
      case EMITTER_PAYLOAD_TYPES.file:
        let file_name = '';
        // console.log(`emitterBody`, emitterBody);
        if (emitterBody && typeof emitterBody !== 'string') {
          file_name = emitterBody.name || '';
        }
        return (
          <div className="fc-center-aligned">
            <FileInput
              ButtonText="Select file"
              path={''}
              name={file_name}
              onSelectFile={onSelectFile}
            />
          </div>
        );
        break;
      case EMITTER_PAYLOAD_TYPES.boolean:
        return (
          <div className="flex p-2">
            <Checkbox
              isChecked={playgroundBody === true}
              label="True"
              onToggleCheck={_ => updateEmitterBody(true)}
            />
            <Checkbox
              isChecked={playgroundBody === false}
              label="False"
              onToggleCheck={_ => updateEmitterBody(false)}
            />
          </div>
        );
        break;
      case EMITTER_PAYLOAD_TYPES.number:
        return (
          <Input
            autoFocus={true}
            type={'number'}
            value={playgroundBody}
            name={'number'}
            min={0}
            onChange={e => {
              if (e) {
                e.preventDefault();
                let { value } = e.target;
                setEmitterBody(value);
                updateEmitterBody(value);
              }
            }}
            isEditor={true}
          />
        );
        break;
      default:
        return <QuickSelection menus={quickSelectionMenus} />;
        break;
    }
  };

  return (
    <Container.Body className="with-divider">
      {activeArgType.id === EMITTER_PAYLOAD_TYPES.no_body ? (
        <Container.Empty>
          <QuickSelection menus={quickSelectionMenus} />
        </Container.Empty>
      ) : (
        _renderActiveBody(activeArgType)
      )}
    </Container.Body>
  );
};

export default Body;
