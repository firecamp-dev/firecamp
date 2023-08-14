import { useState, useEffect, useMemo } from 'react';
import _compact from 'lodash/compact';
import isEqual from 'react-fast-compare';
import { File, SendHorizonal } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import {
  FileInput,
  Container,
  // QuickSelection,
  TabHeader,
  Button,
  Editor,
  StatusBar,
} from '@firecamp/ui';
import { _object } from '@firecamp/utils';
import { EEditorLanguage, ETypedArrayView } from '@firecamp/types';
import MessageTypeDropDown from './playground/MessageTypeDropDown';
import TypedArrayViewDropDown from './playground/TypedArrayViewDropDown';
import { EMessagePayloadTypes } from '../../../types';
import { useStore, IStore } from '../../../store';
import { MessageTypeDropDownList } from '../../../constants';
import ShortcutsPopover, {
  EditorCommands,
} from './playground/ShortcutsPopover';

const PlaygroundTab = () => {
  const {
    getItemPath,
    playground,
    promptSaveItem,
    updateItem,
    changePlaygroundMessage,
    resetPlaygroundMessage,
    sendMessage,
  } = useStore(
    (s: IStore) => ({
      getItemPath: s.getItemPath,
      playground: s.playground,
      promptSaveItem: s.promptSaveItem,
      updateItem: s.updateItem,
      // __meta: s.request.__meta,
      changePlaygroundMessage: s.changePlaygroundMessage,
      resetPlaygroundMessage: s.resetPlaygroundMessage,
      sendMessage: s.sendMessage,
    }),
    shallow
  );

  const { message } = playground;
  const { value } = message;

  // console.log(playground, plgTab, 'playground');
  if (!message.__meta) {
    return <></>;
  }
  const messagePath = useMemo(() => {
    return getItemPath(message.__ref.id);
  }, [message.__ref.id]);

  // manage type dropdown
  const [typedArrayViewOptions] = useState(
    (Object.keys(ETypedArrayView) as Array<keyof typeof ETypedArrayView>).map(
      (e) => {
        return {
          id: e,
          name: e,
        };
      }
    )
  );
  const activeType = MessageTypeDropDownList.find(
    (t) => t.id === message.__meta.type
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

  const _onSendMessage = (e?: any) => {
    if (e) e.preventDefault();
    sendMessage();
  };
  const _addNewMessage = () => {
    resetPlaygroundMessage();
    editor?.focus();
  };
  const _setToOriginal = () => {};
  const _saveMessage = () => {
    const isSaved = !!playground.message.__ref.id;

    if (isSaved) {
      updateItem();
    } else {
      promptSaveItem();
    }
  };

  const _editorShortCutsFns = async (command) => {
    if (!command) return;
    try {
      switch (command) {
        case EditorCommands.Send.command:
          _onSendMessage();
          break;

        case EditorCommands.Save.command:
          _saveMessage();
          break;

        case EditorCommands.SendAndSave.command:
          await _onSendMessage();
          _saveMessage();
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
      _saveMessage();
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
      _saveMessage();
    },
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
              if (!isEqual(value, e.target.value)) {
                changePlaygroundMessage({
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
                changePlaygroundMessage({
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

  const isMsgSaved = !!playground.message.__ref.id;
  const isMsgChanged = false; //plgTab.__meta.hasChange;
  const showSaveButton = playground.playgroundHasChanges;

  return (
    <Container className="h-full">
      <Container.Header>
        <StatusBar className="bg-statusBar-background-active px-1">
          <StatusBar.PrimaryRegion>
            <div className="collection-path" data-tip={messagePath}>
              {`./${messagePath}`}
            </div>
          </StatusBar.PrimaryRegion>
          <StatusBar.SecondaryRegion>
            {/* {!isMsgSaved || isMsgChanged ? (
              <Button
                text={'Save'}
                className="mr-1 hover:!bg-focus2"
                onClick={_saveMessage}
                transparent
                primary
                ghost
                xs
              />
            ) : (
              <></>
            )} */}
            {isMsgSaved ? (
              <Button
                id={`confirm-popover-handler-${playground.id}`}
                key="newMsgButton"
                text={'+ New Message'}
                onClick={_addNewMessage}
                ghost
                compact
                xs
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
              onSelect={(t) => {
                changePlaygroundMessage({
                  __meta: {
                    ...message.__meta,
                    type: t.id,
                  },
                });
              }}
            />

            {[
              EMessagePayloadTypes.arraybuffer,
              EMessagePayloadTypes.arraybufferview,
            ].includes(activeType.id) ? (
              <TypedArrayViewDropDown
                isOpen={isTypedAVDDOpen}
                options={typedArrayViewOptions}
                selectedOption={message.__meta.typedArrayView}
                onSelect={(tav) => {
                  changePlaygroundMessage({
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
            {showSaveButton ? (
              <Button
                text="Save"
                rightIcon={<File size={12} />}
                onClick={_saveMessage}
                secondary
                compact
                xs
              />
            ) : (
              <></>
            )}
            <Button
              text="Send"
              rightIcon={<SendHorizonal size={12} />}
              onClick={_onSendMessage}
              primary
              compact
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Header>
      <Container.Body className="!mt-0">
        {_renderActiveBody(activeType)}
      </Container.Body>
    </Container>
  );
};
export default PlaygroundTab;
