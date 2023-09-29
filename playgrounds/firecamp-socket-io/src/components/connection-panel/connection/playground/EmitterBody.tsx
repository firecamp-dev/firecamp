import { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import {
  Editor,
  FileInput,
  Container,
  QuickSelection,
  Checkbox,
  Button,
  EditorControlBar,
  TabHeader,
  DropdownMenu,
  SingleLineEditor,
} from '@firecamp/ui';
import {
  EArgumentBodyType,
  EEditorLanguage,
  ISocketIOEmitter,
} from '@firecamp/types';
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
  changeArgValue: (value: any) => void;
}
const EmitterBody = ({
  autoFocus = false,
  activeArgIndex,
  emitter: plgEmitter,
  changeArgType,
  changeArgValue,
}: IBody) => {
  const [editor, setEditor] = useState(null);
  const { value, name } = plgEmitter;
  const argument = value[activeArgIndex];
  console.log(value, activeArgIndex, argument, 'argument');

  const activeArgType = useMemo(() => {
    return (
      ArgTypes.find((t) => t.id === argument.__meta.type) || {
        id: EArgumentBodyType.Text,
        name: 'Text',
      }
    );
  }, [argument.__meta.type]);

  /** if Editor is not rendered then remove editor from state */
  useEffect(() => {
    const { Text, Json, ArrayBuffer, ArrayBufferView } = EArgumentBodyType;
    if (
      ![Text, Json, ArrayBuffer, ArrayBufferView].includes(activeArgType.id)
    ) {
      if (editor) setEditor(null);
    }
  }, [activeArgType.id]);

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
        if (typeof argument.body?.toString === 'function') {
          return (
            <Editor
              autoFocus={autoFocus}
              /* key={`${tabId}-${
                type.id
              }-${activeArgIndex}-${playgroundBody.length || 0}`}*/
              language={
                bodyType === EArgumentBodyType.Json
                  ? EEditorLanguage.Json
                  : EEditorLanguage.FcText
              }
              value={argument.body?.toString() || ''}
              onChange={({ target: { value } }) => {
                if (argument.body !== value) changeArgValue(value);
              }}
              onLoad={(edt) => {
                console.log(' Monaco Editor is loaded...');
                setEditor(edt);
              }}
              monacoOptions={{
                name: 'Emitter',
                width: '100%',
                fontSize: 14,
                highlightActiveLine: false,
                showLineNumbers: false,
                tabSize: 2,
                cursorStart: 1,
              }}
            />
          );
        } else return <></>;
      // else {
      //   return (
      //     <QuickSelectionMenus argTypes={ArgTypes} onClick={changeArgType} />
      //   );
      // }
      // case EArgumentBodyType.File:
      //   let fileName = '';
      //   return (
      //     <div className="fc-center-aligned">
      //       <FileInput
      //         placeholder="Select file"
      //         value={{name: fileName}}
      //         onChange={(file) => {}}
      //       />
      //     </div>
      //   );
      case EArgumentBodyType.Boolean:
        return (
          <div className="flex p-2 gap-2">
            <Checkbox
              checked={argument.body === true}
              label="True"
              onToggleCheck={(_) => {
                changeArgValue(true);
              }}
            />
            <Checkbox
              checked={argument.body === false}
              label="False"
              onToggleCheck={(_) => {
                changeArgValue(false);
              }}
            />
          </div>
        );
      case EArgumentBodyType.Number:
        return (
          <div
            className={
              'relative items-center text-input-text text-sm w-full mb-5'
            }
          >
            <div className="!pb-4">
              <SingleLineEditor
                className={'border px-2 py-1 border-input-border'}
                autoFocus={true}
                type={'number'}
                name={'number'}
                value={argument.body.toString()}
                onChange={(e) => {
                  if (e) e.preventDefault();
                  changeArgValue(e.target.value);
                }}
                height="21px"
                language={EEditorLanguage.FcText}
                // min={0}
              />
            </div>
          </div>
        );
      default:
        return <></>;
      // return <QuickSelectionMenus argTypes={ArgTypes} onClick={changeArgType} />
    }
  };

  return (
    <Container.Body>
      <Container className="h-full">
        <Container.Header>
          <TabHeader>
            <TabHeader.Left>
              <ArgTypesDD
                activeArgType={activeArgType}
                changeArgType={changeArgType}
              />
            </TabHeader.Left>
            <TabHeader.Right>
              <EditorControlBar editor={editor} />
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body className="!mt-0">
          {_renderActiveBody(activeArgType.id)}
        </Container.Body>
      </Container>
    </Container.Body>
  );
};

export default EmitterBody;

const ArgTypesDD = ({ activeArgType, changeArgType }) => {
  const [isBodyTypeDDOpen, toggleBodyTypeDD] = useState(false);
  return (
    <DropdownMenu
      handler={() => (
        <Button
          text={activeArgType.name}
          rightSection={
            <VscTriangleDown
              size={12}
              className={cx({ 'transform rotate-180': isBodyTypeDDOpen })}
            />
          }
          size='compact-xs'
          primary
          ghost
        />
      )}
      options={ArgTypes}
      onSelect={(argType) => changeArgType(argType.id)}
      onOpenChange={(v) => toggleBodyTypeDD(v)}
      selected={activeArgType.name}
      classNames={{
        dropdown: '-mt-[10px]',
      }}
      menuProps={{
        position: 'bottom-start',
      }}
      width={144}
      sm
    />
  );
};

const QuickSelectionMenus = ({ argTypes = [], onClick = (id) => {} }) => {
  const menus = useMemo(() => {
    const items = [];
    for (const k in argTypes) {
      if (argTypes[k].id !== EArgumentBodyType.None) {
        items.push({
          id: argTypes[k].id,
          name: argTypes[k].name,
          onClick: () => {
            onClick(argTypes[k].id);
          },
        });
      }
    }
    return [
      {
        title: 'Select Argument Type',
        items,
        activeItem: EArgumentBodyType.None,
      },
    ];
  }, []);

  return <QuickSelection menus={menus} />;
};
