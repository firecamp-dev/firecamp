import { useState, useEffect, useRef, useMemo } from 'react';
import _compact from 'lodash/compact';
import {
  FileInput,
  Container,
  // QuickSelection,
  TabHeader,
  Button,
  Editor,
  Input,
  // ConfirmationPopover,
  Popover,
  EPopoverPosition,
  StatusBar,
  // EPopoverPosition,
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { _object } from '@firecamp/utils';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import shallow from 'zustand/shallow';
import { ETypedArrayView } from '@firecamp/types';

import { EMessagePayloadTypes } from '../../../types';
import {
  useStore,
  initialPlaygroundMessage,
  IStore,
} from '../../../store';
import { MessageTypeDropDownList } from '../../../constants';
import MessageTypeDropDown from './playground/MessageTypeDropDown';
import TypedArrayViewDropDown from './playground/TypedArrayViewDropDown';

const PlaygroundTab = () => {
  const {
    context,
    collection,
    __meta,
    getActivePlayground,
    changePlaygroundMessage,
    sendMessage,
  } = useStore(
    (s: IStore) => ({
      context: s.context,
      collection: s.collection,
      __meta: s.request.__meta,
      getActivePlayground: s.getActivePlayground,
      changePlaygroundMessage: s.changePlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      sendMessage: s.sendMessage,
    }),
    shallow
  );
  const { folders } = collection;
  const { activePlayground, playground, plgTab } = getActivePlayground();
  const { message } = playground;
  const { payload } = message;

  console.log(playground, plgTab, 'playground');
  if (!activePlayground || !message.__meta) {
    return <></>;
  }
  const [activeType, setActiveType] = useState(
    MessageTypeDropDownList.find((t) => t.id === message.__meta.type) || {
      id: EMessagePayloadTypes.noBody,
      name: 'No body',
    }
  );
  const [isSelectTypeDDOpen, toggleSelectTypeDD] = useState(false);
  //arraybuffer
  const [isTypedAVDDOpen, toggleSelectedEnvelopeOpen] = useState(false);
  const [editorDOM, setEditorDOM] = useState({});

  useEffect(() => {
    // console.log(`editorDOM`, editorDOM)
    if (editorDOM && editorDOM.commands) {
      // console.log(`hellloooooo`)
      try {
        for (let cmd in EditorCommands) {
          editorDOM.commands.addCommand({
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
  }, [editorDOM]);

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
    sendMessage(activePlayground, message);
  };
  const _addNewMessage = () => {};
  const _setToOriginal = () => {};
  const _onSaveMessageFromPlygnd = () => {};
  const _editorShortCutsFns = async (command) => {
    if (!command) return;
    try {
      switch (command) {
        case EditorCommands.Send.command:
          _onSendMessage();
          break;

        case EditorCommands.Save.command:
          _onSaveMessageFromPlygnd();
          break;

        case EditorCommands.SendAndSave.command:
          await _onSendMessage();
          _onSaveMessageFromPlygnd();
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
      _onSaveMessageFromPlygnd();
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
      _onSaveMessageFromPlygnd();
    },
  };
  const promptSave = () => {
    context.window
      .promptSaveItem({
        header: 'Save WebSocket Message',
        lable: 'Message Title',
        placeholder: '',
        texts: { btnOk: 'Save', btnOking: 'Saving...' },
        value: '',
        folders,
        onError: (e) => {
          context.app.notify.alert(e?.response?.data?.message || e.message);
        },
      })
      .then((res) => {
        // console.log(res, 1111);
      });
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
              type.id === EMessagePayloadTypes.json ? 'json' : 'ife-text'
            }
            value={payload}
            controlsConfig={{
              show:
                activeType.id !== EMessagePayloadTypes.noBody &&
                activeType.id !== EMessagePayloadTypes.file &&
                typeof payload === 'string',
              position: 'down',
              collapsed: true,
            }}
            onLoad={(editor) => {
              setEditorDOM(editor);
            }}
            onChange={(e) => {
              if (message.payload !== e.target.value) {
                changePlaygroundMessage(activePlayground, {
                  payload: e.target.value,
                });
              }
            }}
            monacoOptions={{
              name: 'message',
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
        break;
      case EMessagePayloadTypes.file:
        let fileName = '';
        if (payload && typeof payload !== 'string') {
          fileName = payload.name || '';
        }
        return (
          <div className="fc-center-aligned">
            {/* <FileInput
              ButtonText="Select file"
              path={''}
              name={fileName}
              onSelectFile={(e) => {
                changePlaygroundMessage(activePlayground, {
                  payload: e.target.files[0],
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
        <div className="collection-path" data-tip={message.path} >{message.path || `./`}</div>
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
        {!plgTab.__meta.isSaved ? (
              <Button
                text={'Save'}
                className="mr-1 hover:!bg-focus2"
                onClick={() => promptSave()}
                primary
                transparent
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
            <ShortcutsPopover id={playground.id} />
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
              xs
              secondary
              iconRight
            /> */}
            <Button
              icon={<IoSendSharp size={12} className="ml-1" />}
              onClick={_onSendMessage}
              primary
              iconCenter
              xs
              text="Send"
              iconRight
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Header>
      <Container.Body className="!mt-0">
        {activeType.id === EMessagePayloadTypes.noBody ? (
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

const EditorCommands = {
  Save: {
    command: 'Save',
    name: 'Save',
    key: {
      win: 'Ctrl-S',
      mac: 'Command-S',
    },
    view: {
      win: `Ctrl + S`,
      mac: `⌘ + S`,
    },
  },
  Send: {
    command: 'Send',
    name: 'Send',
    key: {
      win: 'Ctrl-Enter',
      mac: 'Command-Enter',
    },
    view: {
      win: `Ctrl + Enter`,
      mac: `⌘ + Enter`,
    },
  },
  SendAndSave: {
    command: 'SendAndSave',
    name: 'Send and save',
    key: {
      win: 'Ctrl-Shift-Enter',
      mac: 'Command-Shift-Enter',
    },
    view: {
      win: `Ctrl + Shift + Enter`,
      mac: `⌘ + Shift + Enter`,
    },
  },
  SetToOriginal: {
    command: 'SetToOriginal',
    name: 'Set to original',
    key: {
      win: 'Ctrl-O',
      mac: 'Command-O',
    },
    view: {
      win: `Ctrl + O`,
      mac: `⌘ + O`,
    },
  },
  ClearPlayground: {
    command: 'ClearPlayground',
    name: 'Reset playground',
    key: {
      win: 'Ctrl-K',
      mac: 'Command-K',
    },
    view: {
      win: `Ctrl + K`,
      mac: `⌘ + K`,
    },
  },
};
const ShortcutsPopover = ({ id }) => {
  const _renderKeyboardShortcutInfo = () => {
    try {
      let OSName = '';
      if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
      if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
      if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
      if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

      switch (OSName) {
        case 'Windows':
        case 'UNIX':
        case 'Linux':
          return (
            <div className="pb-2">
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="pl-2 pr-4 flex-1 font-semibold">{`${
                        val.name || ''
                      }`}</div>
                      <div className="ml-auto pr-2">{`${
                        val.view ? val.view['win'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
        case 'MacOS':
          return (
            <div className="pb-2">
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="pl-2 pr-4 flex-1 font-semibold">{`${
                        val.name || ''
                      }`}</div>
                      <div className="ml-auto pr-2">{`${
                        val.view ? val.view['mac'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
          break;
        default:
          return '';
      }
      return 'Body';
    } catch (e) {
      return '';
    }
  };
  return (
    <Popover
      content={
        <div className="w-48">
          <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70 px-2 pt-2 pb-2 border-b border-appBorder">
            Shortcuts
          </div>
          {_renderKeyboardShortcutInfo()}
        </div>
      }
      positions={[EPopoverPosition.Right]}
    >
      <Popover.Handler id={`info-popover-${id}`}>
        <i className="iconv2-info-icon font-base"></i>
      </Popover.Handler>
    </Popover>
  );
};
