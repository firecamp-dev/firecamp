import { useState, useEffect } from 'react';
import _compact from 'lodash/compact';
// import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import shallow from 'zustand/shallow';
import {
  FileInput,
  Container,
  // QuickSelection,
  TabHeader,
  Button,
  Editor,
  StatusBar,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { EEditorLanguage, ETypedArrayView } from '@firecamp/types';
import MessageTypeDropDown from './playground/MessageTypeDropDown';
import TypedArrayViewDropDown from './playground/TypedArrayViewDropDown';
import { EMessagePayloadTypes } from '../../../types';
import { useStore, initialPlaygroundMessage, IStore } from '../../../store';
import { MessageTypeDropDownList } from '../../../constants';
import ShortcutsPopover, {
  EditorCommands,
} from './playground/ShortcutsPopover';

const PlaygroundTab = () => {
  const {
    playgrounds,
    activePlayground,
    playgroundTabs,
    promptSaveItem,
    changePlaygroundMessage,
    sendMessage,
  } = useStore(
    (s: IStore) => ({
      playgrounds: s.playgrounds,
      activePlayground: s.runtime.activePlayground,
      playgroundTabs: s.runtime.playgroundTabs,

      promptSaveItem: s.promptSaveItem,

      // __meta: s.request.__meta,
      changePlaygroundMessage: s.changePlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      sendMessage: s.sendMessage,
    }),
    shallow
  );
  const plgTab = playgroundTabs.find((p) => p.id == activePlayground);
  const playground = playgrounds[activePlayground];
  const { message } = playground;
  const { value } = message;

  console.log(playground, plgTab, 'playground');
  if (!activePlayground || !message.__meta) {
    return <></>;
  }
  const [activeType, setActiveType] = useState(
    MessageTypeDropDownList.find((t) => t.id === message.__meta.type) || {
      id: EMessagePayloadTypes.none,
      name: 'None',
    }
  );
  const [isSelectTypeDDOpen, toggleSelectTypeDD] = useState(false);
  //arraybuffer
  const [isTypedAVDDOpen, toggleSelectedEnvelopeOpen] = useState(false);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    // console.log(`editor`, editor)
    if (editor && editor.commands) {
      // console.log(`hellloooooo`)
      try {
        for (let cmd in EditorCommands) {
          editor.commands.addCommand({
            name: cmd,
            bindKey: EditorCommands[cmd].key,
            exec: (editor) => {
              _editorShortCutsFns(EditorCommands[cmd].command);
            },
            readOnly: true, // false if this command should not apply in readOnly mode
          });
        }
      } catch (e) {
        console.log(`e`, e);
      }
    }
  }, [editor]);

  const envelopeDD = (
    Object.keys(ETypedArrayView) as Array<keyof typeof ETypedArrayView>
  ).map((e) => {
    return {
      id: e,
      name: e,
    };
  });

  const _onSelectBodyType = (type) => {
    console.log(type, 'type...');
    if (!type?.id) return;
    setActiveType((ps) => {
      return type;
    });
    toggleSelectTypeDD(false);
  };
  const _onSendMessage = (e?: any) => {
    if (e) e.preventDefault();
    sendMessage(activePlayground);
  };
  const _addNewMessage = () => {};
  const _setToOriginal = () => {};
  const _onSaveMessageFromPlg = () => {};
  const _editorShortCutsFns = async (command) => {
    if (!command) return;
    try {
      switch (command) {
        case EditorCommands.Send.command:
          _onSendMessage();
          break;

        case EditorCommands.Save.command:
          _onSaveMessageFromPlg();
          break;

        case EditorCommands.SendAndSave.command:
          await _onSendMessage();
          _onSaveMessageFromPlg();
          break;

        case EditorCommands.SetToOriginal.command:
          _setToOriginal();
          break;

        case EditorCommands.ClearPlayground.command:
          _addNewMessage();
          break;

        default:
          return;
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };
  const shortcutFns = {
    onCtrlS: () => {
      _onSaveMessageFromPlg();
    },
    onCtrlEnter: async () => {
      _onSendMessage();
    },
    onCtrlO: () => {
      _setToOriginal();
    },
    onCtrlK: () => {
      _addNewMessage();
    },
    onCtrlShiftEnter: async () => {
      await _onSendMessage();
      _onSaveMessageFromPlg();
    },
  };
  const promptSave = () => {
    promptSaveItem();
  };
  const _renderActiveBody = (type) => {
    if (!type || !type.id) return <span />;

    // console.log(message);
    switch (type.id) {
      case EMessagePayloadTypes.text:
      case EMessagePayloadTypes.json:
      case EMessagePayloadTypes.arraybuffer:
      case EMessagePayloadTypes.arraybufferview:
        return (
          <Editor // TODO: set completion/hover provider on WSTab mount
            autoFocus={true}
            key={playground.id}
            language={
              type.id === EMessagePayloadTypes.json
                ? EEditorLanguage.Json
                : EEditorLanguage.FcText
            }
            value={value}
            onLoad={(editor) => {
              setEditor(editor);
            }}
            onChange={(e) => {
              if (message.value !== e.target.value) {
                changePlaygroundMessage(activePlayground, {
                  value: e.target.value,
                });
              }
            }}
            monacoOptions={{
              name: 'playgroundMsg',
              width: '100%',
              fontSize: 14,
              highlightActiveLine: false,
              showLineNumbers: false,
              tabSize: 2,
              cursorStart: 1,
            }}
            {...shortcutFns}
          />
        );
        break;
      case EMessagePayloadTypes.file:
        let fileName = '';
        if (value && typeof value !== 'string') {
          fileName = value.name || '';
        }
        return (
          <div className="fc-center-aligned">
            {/* <FileInput
              ButtonText="Select file"
              path={''}
              name={fileName}
              onSelectFile={(e) => {
                changePlaygroundMessage(activePlayground, {
                  value: e.target.files[0],
                });
              }}
            /> */}
          </div>
        );
        break;
      default:
        return <></>;
        break;
    }
  };

  return (
    <Container className="h-full">
      <Container.Header>
        <StatusBar className="bg-statusBarBackground2 px-1">
          <StatusBar.PrimaryRegion>
            <div className="collection-path" data-tip={message.path}>
              {message.path || `./`}
            </div>
          </StatusBar.PrimaryRegion>
          <StatusBar.SecondaryRegion>
            {!plgTab.__meta.isSaved ? (
              <Button
                text={'Save'}
                className="mr-1 hover:!bg-focus2"
                onClick={() => promptSave()}
                transparent
                primary
                ghost
                xs
              />
            ) : (
              <></>
            )}
            {plgTab.__meta.isSaved && plgTab.__meta.hasChange ? (
              <Button
                id={`confirm-popover-handler-${playground.id}`}
                key="new_msg_button"
                text={'+ New Message'}
                sm
                ghost
              />
            ) : (
              <></>
            )}
            {/* <ShortcutsPopover id={playground.id} /> */}
          </StatusBar.SecondaryRegion>
        </StatusBar>
      </Container.Header>
      <Container.Header className="message-playground-scrollable top invisible-scrollbar ">
        <TabHeader className="height-small">
          <TabHeader.Left className="invisible-scrollbar">
            <MessageTypeDropDown
              selectedOption={activeType}
              options={MessageTypeDropDownList}
              isOpen={isSelectTypeDDOpen}
              onToggle={() => toggleSelectTypeDD(!isSelectTypeDDOpen)}
              onSelect={_onSelectBodyType}
            />

            {[
              EMessagePayloadTypes.arraybuffer,
              EMessagePayloadTypes.arraybufferview,
            ].includes(activeType.id) ? (
              <TypedArrayViewDropDown
                isOpen={isTypedAVDDOpen}
                options={envelopeDD}
                selectedOption={message.__meta.typedArrayView}
                onSelect={(tav) => {
                  changePlaygroundMessage(activePlayground, {
                    __meta: {
                      ...message.__meta,
                      typedArrayView: tav.id,
                    },
                  });
                }}
                onToggle={() => toggleSelectedEnvelopeOpen(!isTypedAVDDOpen)}
              />
            ) : (
              <></>
            )}
          </TabHeader.Left>
          <TabHeader.Right>
            {/* <Button
              text="Save"
              icon={<VscFile size={12} className="ml-1" />}
              onClick={() => promptSave()}
              secondary
              iconRight
              xs
            /> */}
            <Button
              text="Send"
              icon={<IoSendSharp size={12} className="ml-1" />}
              onClick={_onSendMessage}
              iconCenter
              iconRight
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Header>
      <Container.Body className="!mt-0">
        {activeType.id === EMessagePayloadTypes.none ? (
          <Container.Empty>
            {/* <QuickSelection menus={quickSelectionMenus} /> //TODO: manage it later if feel need */}
          </Container.Empty>
        ) : (
          _renderActiveBody(activeType)
        )}
      </Container.Body>
    </Container>
  );
};
export default PlaygroundTab;
