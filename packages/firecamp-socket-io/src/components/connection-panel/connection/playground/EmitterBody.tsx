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
import { EArgumentBodyType, ISocketIOEmitter } from '@firecamp/types';
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
  emitter?: ISocketIOEmitter;
  changeArgType: (type: EArgumentBodyType) => void;
}
const Body = ({
  autoFocus = false,
  activeArgIndex,
  emitter: plgEmitter,
  changeArgType,
}: IBody) => {
  const [isBodyTypeDDOpen, toggleBodyTypeDD] = useState(false);
  const { payload, name } = plgEmitter;
  console.log(activeArgIndex, 'activeArgIndex...')
  const argument = payload[activeArgIndex];

  const activeArgType = useMemo(() => {
    return (
      ArgTypes.find((t) => t.id === argument.__meta.type) || {
        id: EArgumentBodyType.Text,
        name: 'Text',
      }
    );
  }, [argument.__meta.type]);

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
      bodyType === EArgumentBodyType.Boolean &&
      typeof argument.body !== 'boolean'
    ) {
      argument.body = true;
    }

    switch (bodyType) {
      case EArgumentBodyType.Text:
      case EArgumentBodyType.Json:
      case EArgumentBodyType.ArrayBuffer:
      case EArgumentBodyType.ArrayBufferView:
        const value = !isNaN(argument.body) ? argument.body.toString() : argument.body;
        if (typeof value === 'string') {
          return (
            <Editor
              autoFocus={autoFocus}
              /* key={`${tabId}-${
                type.id
              }-${activeArgIndex}-${playgroundBody.length || 0}`}*/
              language={
                bodyType === EArgumentBodyType.Json ? 'json' : 'ife-text'
              }
              value={value || ''}
              onChange={({ target: { _value } }) => {
                if (value !== _value) {
                  // setEmitterBody(_value);
                  // updateEmitterBody(_value);
                }
              }}
              // controlsConfig={{
              //   show:
              //     bodyType !== EArgumentBodyType.noBody &&
              //     typeof playgroundBody === 'string' &&
              //     bodyType !== EArgumentBodyType.file,
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
      // case EArgumentBodyType.File:
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
      case EArgumentBodyType.Boolean:
        return (
          <div className="flex p-2">
            <Checkbox
              isChecked={argument.body === true}
              label="True"
              onToggleCheck={(_) => {
                // updateEmitterBody(true);
              }}
            />
            <Checkbox
              isChecked={argument.body === false}
              label="False"
              onToggleCheck={(_) => {
                // updateEmitterBody(false);
              }}
            />
          </div>
        );
      case EArgumentBodyType.Number:
        return (
          <Input
            autoFocus={true}
            type={'number'}
            value={argument.body.toString()}
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
      {activeArgType.id === EArgumentBodyType.NoBody ? (
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
            <Dropdown.Options
              options={ArgTypes}
              onSelect={(argType) => changeArgType(argType.id)}
            />
          </Dropdown>
          {_renderActiveBody(activeArgType.id)}
        </div>
      )}
    </Container.Body>
  );
};

export default Body;
