import { useMemo, useState } from 'react';
import {
  Editor,
  Input,
  FileInput,
  Container,
  QuickSelection,
  Checkbox,
  Dropdown,
  Button,
} from '@firecamp/ui-kit';
import { ISocketIOEmitter } from '@firecamp/types';
import { EEmitterPayloadTypes } from '../../../../types';
import {
  ArgTypes,
  InitArg,
  EditorCommands,
  TypedArrayViews,
  InitPlayground,
} from '../../../../constants';

interface IBody {
  autoFocus?: boolean;
  activeArgIndex: number;
  activeArgType?: {
    id: string;
    name: string;
  };
  emitter?: ISocketIOEmitter;
}
const Body = ({
  autoFocus = false,
  activeArgIndex,
  emitter: plgEmitter,
}: IBody) => {
  const [isBodyTypeDDOpen, toggleBodyTypeDD] = useState(false);
  const { payload, name } = plgEmitter;
  let value = payload[activeArgIndex];

  const activeArgType = useMemo(() => {
    return (
      ArgTypes.find((t) => t.id === payload[activeArgIndex].__meta.type) || {
        id: EEmitterPayloadTypes.Text,
        name: 'Text',
      }
    );
  }, [activeArgIndex]);

  const shortcutFns = {
    onCtrlS: () => {
      // _onSaveMessageFromPlygnd();
    },
    onCtrlEnter: async () => {
      // _onEmit();
    },
    onCtrlO: () => {
      // _setToOriginal();
    },
    onCtrlK: () => {
      // _addNewEmitter();
    },
    onCtrlShiftEnter: async () => {
      // await _onEmit();
      // _onSaveMessageFromPlygnd();
    },
  };

  const _renderActiveBody = (bodyType) => {
    if (!bodyType) return <span />;
    if (
      bodyType === EEmitterPayloadTypes.Boolean &&
      typeof value !== 'boolean'
    ) {
      value = true;
    }

    switch (bodyType) {
      case EEmitterPayloadTypes.Text:
      case EEmitterPayloadTypes.Json:
      case EEmitterPayloadTypes.ArrayBuffer:
      case EEmitterPayloadTypes.ArrayBufferView:
        value = !isNaN(value) ? value.toString() : value;
        if (typeof value === 'string') {
          return (
            <Editor
              autoFocus={autoFocus}
              /* key={`${tabId}-${
                type.id
              }-${activeArgIndex}-${playgroundBody.length || 0}`}*/
              language={
                bodyType === EEmitterPayloadTypes.Json ? 'json' : 'ife-text'
              }
              value={value || ''}
              onChange={({ target: { _value } }) => {
                if (value !== _value) {
                  // setEmitterBody(value);
                  // updateEmitterBody(value);
                }
              }}
              // controlsConfig={{
              //   show:
              //     bodyType !== EEmitterPayloadTypes.noBody &&
              //     typeof playgroundBody === 'string' &&
              //     bodyType !== EEmitterPayloadTypes.file,
              //   position: 'vertical'
              // }}
              monacoOptions={{
                name: 'Emitter',
                width: '100%',
                fontSize: 13,
                highlightActiveLine: false,
                showLineNumbers: false,
                tabSize: 2,
                cursorStart: 1,
              }}
              {...shortcutFns}
            />
          );
        } else {
          return <QuickSelection menus={[]} />;
        }
      // case EEmitterPayloadTypes.File:
      //   let fileName = '';
      //   return (
      //     <div className="fc-center-aligned">
      //       <FileInput
      //         ButtonText="Select file"
      //         path={''}
      //         name={fileName}
      //         onSelectFile={()=> {}}
      //       />
      //     </div>
      //   );
      case EEmitterPayloadTypes.Boolean:
        return (
          <div className="flex p-2">
            <Checkbox
              isChecked={value === true}
              label="True"
              onToggleCheck={(_) => {
                // updateEmitterBody(true);
              }}
            />
            <Checkbox
              isChecked={value === false}
              label="False"
              onToggleCheck={(_) => {
                // updateEmitterBody(false);
              }}
            />
          </div>
        );
      case EEmitterPayloadTypes.Number:
        return (
          <Input
            autoFocus={true}
            type={'number'}
            value={value.toString()}
            name={'number'}
            min={0}
            onChange={(e) => {
              if (e) {
                e.preventDefault();
                let { value } = e.target;
                // setEmitterBody(value);
                // updateEmitterBody(value);
              }
            }}
            isEditor={true}
          />
        );
        break;
      default:
        return <QuickSelection menus={[]} />;
        break;
    }
  };

  return (
    <Container.Body>
      {activeArgType.id === EEmitterPayloadTypes.NoBody ? (
        <Container.Empty>
          <QuickSelection menus={[]} />
        </Container.Empty>
      ) : (
        <div>
          <Dropdown
            selected={activeArgType}
            isOpen={isBodyTypeDDOpen}
            onToggle={() => toggleBodyTypeDD(!isBodyTypeDDOpen)}
          >
            <Dropdown.Handler>
              <Button
                text={activeArgType.name}
                transparent={true}
                ghost={true}
                withCaret={true}
                primary
                sm
              />
            </Dropdown.Handler>
            <Dropdown.Options options={ArgTypes} onSelect={() => {}} />
          </Dropdown>
          {_renderActiveBody(activeArgType.id)}
        </div>
      )}
    </Container.Body>
  );
};

export default Body;
