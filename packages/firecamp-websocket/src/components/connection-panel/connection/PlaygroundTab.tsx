import { useState, useEffect, useRef, useMemo } from 'react';
import _compact from 'lodash/compact';
import {
  FileInput,
  Container,
  QuickSelection,
  TabHeader,
  Button,
  Editor,
  Input,
  // ConfirmationPopover,
  Popover,
  EPopoverPosition,
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
  useWebsocketStore,
  initialPlaygroundMessage,
  IWebsocketStore,
} from '../../../store';
import { MessageTypeDropDownList } from '../../../constants';
import MessageTypeDropDown from './playground/MessageTypeDropDown';
import TypedArrayViewDropDown from './playground/TypedArrayViewDropDown';

const EDITOR_COMMANDS = {
  SAVE: {
    command: 'SAVE',
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
  SEND: {
    command: 'SEND',
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
  SEND_AND_SAVE: {
    command: 'SEND_AND_SAVE',
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
  SET_TO_ORIGINAL: {
    command: 'SET_TO_ORIGINAL',
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
  CLEAR_PLAYGROUND: {
    command: 'CLEAR_PLAYGROUND',
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

const PlaygroundTab = () => {
  const {
    context,
    activePlayground,
    collection,
    playground,
    playgroundTabs,
    __meta,

    changePlaygroundMessage,
    setSelectedCollectionMessage,
    sendMessage,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      context: s.context,
      activePlayground: s.runtime.activePlayground,
      collection: s.collection,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundTabs: s.runtime.playgroundTabs,
      __meta: s.request.__meta,

      changePlaygroundMessage: s.changePlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      sendMessage: s.sendMessage,
    }),
    shallow
  );
  const { folders } = collection;

  const [selectedMessageId] = useState('');

  // const {
  //   onSave: saveUpdatedPlaygroundMessage,
  //   addNewMessage,
  //   setToOriginal: setPlaygroundMessageAsOriginal,
  // } = ctx_playgroundMessageFns;

  const tabData = { id: 123 };

  const message = useMemo(
    () => playground?.message || initialPlaygroundMessage,
    [playground, activePlayground]
  );
  const playgroundTab = useMemo(
    () => playgroundTabs.find((tab) => tab.id === activePlayground),
    [activePlayground, playgroundTabs]
  );

  // console.log(activePlayground, message, 4569564);

  if (!activePlayground || !message.__meta) {
    return <span />;
  }

  const [activeType, setActiveType] = useState(
    MessageTypeDropDownList.find((t) => t.id === message.__meta.type) || {
      id: EMessagePayloadTypes.noBody,
      name: 'No body',
    }
  );
  const [isSelectTypeDDOpen, toggleSelectTypeDD] = useState(false);
  const [messageBody, setMessageBody] = useState(message.body);
  const [editorDOM, setEditorDOM] = useState({});
  const [isSaveMessagePopoverOpen, toggleSaveMessagePopover] = useState(false);
  const [saveButtonHandler, updateSaveButtonHandler] = useState({
    isOpenPopup: false,
    isMessageDirty: false,
    show: true,
  });

  const envelopeDD = (
    Object.keys(ETypedArrayView) as Array<keyof typeof ETypedArrayView>
  ).map((e) => {
    return {
      id: e,
      name: e,
    };
  });

  //arraybuffer
  const [selectedEnvelope, setSelectedEnvelope] = useState(envelopeDD[0]);
  const [isSelectedEnvelopeOpen, toggleSelectedEnvelopeOpen] = useState(false);

  const prevType_ref = useRef(EMessagePayloadTypes.noBody);

  const selectedMessageId_Ref = useRef(selectedMessageId);

  useEffect(() => {
    if (
      activeType.id !== EMessagePayloadTypes.file &&
      prevType_ref.current === EMessagePayloadTypes.file &&
      message.body !== ''
    ) {
      _updateMessage({ body: '' });
      setMessageBody('');
      prevType_ref.current = activeType.id;
    }

    if (
      message.__meta.typedArrayView &&
      message.__meta.typedArrayView !== selectedEnvelope.id
    ) {
      setSelectedEnvelope(
        envelopeDD.find((e) => e.id === message.__meta.typedArrayView)
      );
    }

    if (!equal(messageBody, message.body)) {
      setMessageBody(message.body);
    } else if (
      activeType.id === EMessagePayloadTypes.file &&
      messageBody !== message.body
    ) {
      setMessageBody(message.body);
    }

    if (message?.__meta.type && message?.__meta.type !== activeType.id) {
      setActiveType(
        MessageTypeDropDownList.find((t) => t.id === message?.__meta.type)
      );
    }
  }, [message, activePlayground]);

  const quickSelectionMenus = [];
  quickSelectionMenus[0] = Object.assign(
    {},
    {
      title: 'Quick Payload',
      items: MessageTypeDropDownList
        ? _compact(
            MessageTypeDropDownList.map((item) => {
              if (item.id !== EMessagePayloadTypes.noBody) {
                return Object.assign({}, item, {
                  onClick: () => {
                    // setActiveType(item || "");
                    _onSelectBodyType(item);
                  },
                });
              }
            })
          )
        : [],
      active_item: MessageTypeDropDownList && activeType ? activeType.id : '',
    }
  );

  const _onSelectBodyType = (type) => {
    console.log(type, 'type...');
    if (!type?.id) return;
    setActiveType((ps) => {
      prevType_ref.current = ps.id;
      return type;
    });
    toggleSelectTypeDD(false);
    if (type.id === EMessagePayloadTypes.noBody) {
      _updateMessage(
        Object.assign({}, initialPlaygroundMessage, {
          __meta: Object.assign({}, initialPlaygroundMessage.__meta, {
            type: EMessagePayloadTypes.noBody,
          }),
        })
      );
      setSelectedCollectionMessage(activePlayground, '');
      return;
    }

    if (
      type.id !== EMessagePayloadTypes.file &&
      prevType_ref.current === EMessagePayloadTypes.file &&
      message.body !== ''
    ) {
      _updateMessage({
        body: '',
        __meta: Object.assign({}, initialPlaygroundMessage.__meta, {
          type: EMessagePayloadTypes.file,
        }),
      });
      setMessageBody('');
    } else if (
      message &&
      message.__meta.typedArrayView === '' &&
      (type.id === EMessagePayloadTypes.arraybufferview ||
        type.id === EMessagePayloadTypes.arraybuffer)
    ) {
      _updateMessage({
        __meta: {
          typedArrayView: selectedEnvelope.id,
          type: type.id,
        },
      }); //TODO: check
    } else if (
      type.id !== EMessagePayloadTypes.arraybufferview &&
      type.id !== EMessagePayloadTypes.arraybuffer
    ) {
      _updateMessage({
        __meta: {
          typedArrayView: '',
          type: type.id,
        },
      });
    }
  };

  const _onSelectEnvelope = (env) => {
    if (env && env.id) {
      setSelectedEnvelope(env);
      _updateMessage({
        __meta: {
          ...message.__meta,
          typedArrayView: env.id,
        },
      });
    }
  };

  const _updateMessage = (payload) => {
    if (!payload) return;

    // console.log({ payload });

    changePlaygroundMessage(activePlayground, payload);
  };

  const _onSelectFile = (e) => {
    let target = e.target;

    let file = target.files[0];
    // console.log(`file`, file);
    _updateMessage({ body: file });
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
            key={tabData.id}
            language={
              type.id === EMessagePayloadTypes.json ? 'json' : 'ife-text'
            }
            value={messageBody || ''}
            controlsConfig={{
              show:
                activeType.id !== EMessagePayloadTypes.noBody &&
                activeType.id !== EMessagePayloadTypes.file &&
                typeof messageBody === 'string',
              position: 'down',
              collapsed: true,
            }}
            onLoad={(editor) => {
              setEditorDOM(editor);
            }}
            onChange={(e) => {
              if (message.body !== e.target.value) {
                setMessageBody(e.target.value);
                _updateMessage({ body: e.target.value });
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
        let file_name = '';
        if (messageBody && typeof messageBody !== 'string') {
          file_name = messageBody.name || '';
        }

        // console.log(`file_name`, file_name);

        return (
          <div className="fc-center-aligned">
            <FileInput
              ButtonText="Select file"
              path={''}
              name={file_name}
              onSelectFile={_onSelectFile}
            />
          </div>
        );
        break;

      default:
        return <QuickSelection menus={quickSelectionMenus} />;
        break;
    }
  };

  const _onSendMessage = (e?: any) => {
    if (e) e.preventDefault();

    sendMessage(activePlayground, message);
  };

  const _onUpdateMessage = () => {
    // saveUpdatedPlaygroundMessage(
    //   selectedMessageId_Ref?.current || selectedMessageId
    // );
    // onUpdateRequest();
  };

  const _onAddMesage = (data) => {
    // console.log(`data add message`, data);
    // ctx_updateCollectionFns.addMessage(_object.omit(data, ['path']));

    if (data.path) {
      _updateMessage({ __meta: { ...message.__meta }, path: data.path || '' });
    }
  };

  const _addNewMessage = () => {
    addNewMessage();
    setSelectedCollectionMessage(activePlayground, '');
    selectedMessageId_Ref.current = '';
  };

  const _setToOriginal = () => {
    setPlaygroundMessageAsOriginal(
      selectedMessageId_Ref.current || selectedMessageId
    );
  };

  const _onSaveMessageFromPlygnd = () => {
    if (selectedMessageId_Ref.current || selectedMessageId) {
      _onUpdateMessage();
    } else {
      toggleSaveMessagePopover(true);
    }
  };

  const _editorShortcut_fns = async (command) => {
    if (!command) return;
    // console.log(`command`, command)

    try {
      switch (command) {
        case EDITOR_COMMANDS.SEND.command:
          _onSendMessage();
          break;

        case EDITOR_COMMANDS.SAVE.command:
          _onSaveMessageFromPlygnd();
          break;

        case EDITOR_COMMANDS.SEND_AND_SAVE.command:
          await _onSendMessage();
          _onSaveMessageFromPlygnd();
          break;

        case EDITOR_COMMANDS.SET_TO_ORIGINAL.command:
          _setToOriginal();
          break;

        case EDITOR_COMMANDS.CLEAR_PLAYGROUND.command:
          _addNewMessage();
          break;

        default:
          return;
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  useEffect(() => {
    // console.log(`editorDOM`, editorDOM)

    if (editorDOM && editorDOM.commands) {
      // console.log(`hellloooooo`)
      try {
        for (let cmd in EDITOR_COMMANDS) {
          editorDOM.commands.addCommand({
            name: cmd,
            bindKey: EDITOR_COMMANDS[cmd].key,
            exec: (editor) => {
              _editorShortcut_fns(EDITOR_COMMANDS[cmd].command);
            },
            readOnly: true, // false if this command should not apply in readOnly mode
          });
        }
        /*
         editorDOM.commands.addCommand({
         name: "SaveMessage",
         bindKey: {win: "Ctrl-S", mac: "Command-S"},
         exec: editor => {
         _onSaveMessageFromPlygnd();
         },
         readOnly: true // false if this command should not apply in readOnly mode
         });*/
      } catch (e) {
        console.log(`e`, e);
      }
    }
  }, [editorDOM, selectedMessageId]);

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
              {Object.values(EDITOR_COMMANDS).map((val, i) => {
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

          break;

        case 'MacOS':
          return (
            <div className="pb-2">
              {Object.values(EDITOR_COMMANDS).map((val, i) => {
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
        items: folders,
        onError: (e) => {
          context.app.notify.alert(e?.response?.data?.message || e.message);
        },
      })
      .then((res) => {
        // console.log(res, 1111);
      });
  };

  /* const _onClickPrettify = e => {
    if (e) {
      e.preventDefault();
    }
    if (activeType.id === EMessagePayloadTypes.json) {
      try {
        let parsed = JSON.parse(messageBody);
        let strigified = JSON.stringify(parsed, null, 4);
       if (message.body !== strigified) {
          setMessageBody(strigified);
          _updateMessage({ body: strigified });
        }
      } catch (e) {
        //do nothing
      }
    }
  }; */
  return (
    <Container className="h-full">
      {/* <Container.Header>
        <TabHeader className="height-small collection-path-wrapper with-border-top !px-2">
          <TabHeader.Left>
            <div className="collection-path">{message.path || `./`}</div>
          </TabHeader.Left>
          <TabHeader.Right>
            <Button
              text={'Save'}
              primary
              transparent
              ghost
              xs
              className="mr-1 hover:!bg-focus2"
            />
            {
              //activeType.id !== EMessagePayloadTypes.noBody &&
              // activeType.id !== EMessagePayloadTypes.file &&
              !(
                !playgroundTab?.__meta?.isSaved && !playgroundTab?.__meta?.hasChange
              ) ? (
                <SaveMessage
                  isPopoverOpen={isSaveMessagePopoverOpen}
                  collection={collection || []}
                  id={`push-message-${tabData.id || ''}`}
                  hasChange={playgroundTab?.__meta?.hasChange || false}
                  isSaved={playgroundTab?.__meta?.isSaved || false}
                  onSubmit={_onAddMesage}
                  onUpdate={_onUpdateMessage}
                  toggleOpenPopover={(val) => toggleSaveMessagePopover(val)}
                />
              ) : (
                ''
              )
            }
            {messageBody && selectedMessageId && selectedMessageId.length ? (
              <ConfirmationPopover
                id={tabData.id}
                handler={
                  <Button
                    id={`confirm-popover-handler-${tabData.id}`}
                    key="new_msg_button"
                    text={'+ New Message'}
                    sm
                    ghost
                  />
                }
                title="Are you sure to reset playground and add new message?"
                _meta={{
                  showDeleteIcon: false,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No',
                }}
                onConfirm={_addNewMessage}
              />
            ) : (
              ''
            )}
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
              <Popover.Handler id={`info-popover-${tabData.id}`}>
                <i className="iconv2-info-icon font-base"></i>
              </Popover.Handler>
            </Popover>
          </TabHeader.Right>
        </TabHeader>
      </Container.Header> */}
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
                isOpen={isSelectedEnvelopeOpen}
                options={envelopeDD}
                selectedOption={selectedEnvelope}
                onSelect={_onSelectEnvelope}
                onToggle={() =>
                  toggleSelectedEnvelopeOpen(!isSelectedEnvelopeOpen)
                }
              />
            ) : (
              <></>
            )}
          </TabHeader.Left>
          <TabHeader.Right>
            <Button
              text="Save"
              icon={<VscFile size={12} className="ml-1" />}
              onClick={() => promptSave()}
              xs
              secondary
              iconRight
            />
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
            <QuickSelection menus={quickSelectionMenus} />
          </Container.Empty>
        ) : (
          _renderActiveBody(activeType)
        )}
      </Container.Body>
    </Container>
  );
};
export default PlaygroundTab;

const SaveMessage = ({
  isPopoverOpen = false,
  collection = [],
  id = '',
  hasChange = false,
  isSaved = false,
  // fromCollection = false,

  onSubmit = (msg) => {},
  onUpdate = () => {},
  onAddDirectory = (dir) => {},
  toggleOpenPopover = (bool) => {},
}) => {
  const [messageName, set_message_name] = useState('');
  // let [is_popover_open, toggle_popover] = useState(false);
  const [focusedNode, setFocusedNode] = useState({
    __ref: { _relative_path: './' },
  });

  const _handleChangeName = (e) => {
    e.preventDefault();

    let { value } = e.target;
    set_message_name(value);
  };

  const _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      // e.preventDefault();
      _onSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleOpenPopover(false);
    }
  };

  const _onSubmit = (e) => {
    // if (!messageName.length) return;
    if (e) {
      e.preventDefault();
    }

    // console.log(`focusedNode`, focusedNode);

    let msgPayload = { name: messageName };
    let path = '';

    if (focusedNode && focusedNode.__ref.id) {
      path =
        focusedNode.__ref && focusedNode.__ref._relative_path
          ? focusedNode.__ref._relative_path + `/${messageName}`
          : '';
      msgPayload = Object.assign({}, msgPayload, {
        parent_id: focusedNode.__ref.id,
        path,
      });
    } else {
      path =
        focusedNode.__ref && focusedNode.__ref._relative_path
          ? focusedNode.__ref._relative_path + `${messageName}`
          : '';
      msgPayload = Object.assign({}, msgPayload, {
        path,
      });
    }

    onSubmit(msgPayload);
    toggleOpenPopover(!isPopoverOpen);
    set_message_name('');
    setFocusedNode({
      __ref: { _relative_path: './' },
    });
  };

  const _onClickSaveMessage = () => {
    if (hasChange) {
      onUpdate();
    }
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      detach={false}
      onToggleOpen={() => {
        if (!isSaved && hasChange) toggleOpenPopover(!isPopoverOpen);
      }}
      content={
        hasChange && !isSaved && isPopoverOpen === true ? (
          <div className="fc-popover-v2">
            <div className="fc-push-message">
              {collection && collection.length ? (
                <div className="fc-push-message-collection">
                  <label>
                    Select Folder{' '}
                    <span>({focusedNode.__ref._relative_path})</span>
                  </label>
                  {/*   <Collection
                    className="with-border"
                    onlyDirectory={true}
                    onNodeFocus={setFocusedNode}
                    data={collection}
                    primaryKey={'id'}
                    nodeRenderer={({
                      isDirectory,
                      item,
                      isExpanded,
                      classes,
                      getNodeProps,
                    }) => {
                      if (isDirectory) {
                        return (
                          <CollectionFcNode
                            isOpen={isExpanded}
                            name={item.name}
                            className={classes}
                            icon="folder"
                            {...getNodeProps()}
                          />
                        );
                        // return <div className={classes}> {item.name}</div>;
                      } else {
                        return (
                          <CollectionMsgNode
                            item={item}
                            className={classes}
                            {...getNodeProps()}
                          />
                        );
                      }
                    }}
                    allowDND={false}
                    allowSort={false}
                    onSort={() => {}}
                    onDND={() => {}}
                  /> */}
                </div>
              ) : (
                ''
              )}
              <Input
                autoFocus={true}
                type="text"
                name="status"
                id="status"
                className="fc-input border-alt small"
                placeholder="Message name"
                label="Message Title (Optional)"
                value={messageName}
                onChange={_handleChangeName}
                onKeyDown={_onKeyDown}
              />
              <div className="fc-button-wrapper align-right">
                <Button text={'Save'} onClick={_onSubmit} primary sm />
              </div>
            </div>
          </div>
        ) : (
          ''
        )
      }
    >
      <Popover.Handler id={`SM-${id}`}>
        <Button
          text="Save"
          onClick={_onClickSaveMessage}
          primary
          sm
          ghost
          transparent
        />
      </Popover.Handler>
    </Popover>
  );
};
