import {
  Editor,
  Input,
  FileInput,
  Container,
  QuickSelection,
  Checkbox
} from '@firecamp/ui-kit';
import { EEmitterPayloadTypes } from '../../../../types';

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
  const _renderActiveBody = (type = {}) => {
    if (!type || !type.id) return <span />;

    if (
      type.id === EEmitterPayloadTypes.boolean &&
      typeof playgroundBody !== 'boolean'
    ) {
      playgroundBody = true;
    }

    switch (type.id) {
      case EEmitterPayloadTypes.text:
      case EEmitterPayloadTypes.json:
      case EEmitterPayloadTypes.arraybuffer:
      case EEmitterPayloadTypes.arraybufferview:
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
                type.id === EEmitterPayloadTypes.json ? 'json' : 'ife-text'
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
              //     activeArgType.id !== EEmitterPayloadTypes.noBody &&
              //     typeof playgroundBody === 'string' &&
              //     activeArgType.id !== EEmitterPayloadTypes.file,
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
      case EEmitterPayloadTypes.file:
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
      case EEmitterPayloadTypes.boolean:
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
      case EEmitterPayloadTypes.number:
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
    <Container.Body>
      {activeArgType.id === EEmitterPayloadTypes.noBody ? (
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
