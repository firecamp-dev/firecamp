import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import _compact from 'lodash/compact';
import {
  FileInput,
  Container,
  QuickSelection,
  TabHeader,
  // DocButton,
  Button,
  Dropdown,
  Editor,
  Input,
  // ConfirmationPopover,
  Popover,
  // EPopoverPosition,
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { _object } from '@firecamp/utils';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import shallow from 'zustand/shallow';

import { WebsocketContext } from '../../../WebSocket.context';

import { EMessagePayloadTypes } from '../../../../types';

import {
  useWebsocketStore,
  initialPlaygroundMessage,
  IWebsocketStore,
} from '../../../../store';

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

const MessagePlayground = ({
  // message = {},
  // runtimeActiveConnection = '',
  // collection: propCollection = {},
  messageTypes = [],
  envelopeList = [],
  meta = {},
  tabData = {},
  selectedMessageId = '',
}) => {
  const {
    activePlayground,
    collection: propCollection,
    playground,
    playgroundTabs,

    changePlaygroundMessage,
    setSelectedCollectionMessage,
    sendMessage,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      collection: s.collection,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundTabs: s.runtime.playgroundTabs,

      changePlaygroundMessage: s.changePlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      sendMessage: s.sendMessage,
    }),
    shallow
  );

  const {
    ctx_playgroundMessageFns,
    ctx_commonFns,

    // store update fns
    ctx_updateCollectionFns,
  } = useContext(WebsocketContext);

  const {
    onSave: saveUpdatedPlaygroundMessage,
    addNewMessage,
    setToOriginal: setPlaygroundMessageAsOriginal,
  } = ctx_playgroundMessageFns;

  const { onUpdateRequest } = ctx_commonFns;

  let message = useMemo(
    () => playground?.message || initialPlaygroundMessage,
    [playground, activePlayground]
  );
  let playgroundTab = useMemo(
    () => playgroundTabs.find((tab) => tab.id === activePlayground),
    [activePlayground, playgroundTabs]
  );

  if (
    !activePlayground ||
    !message ||
    !Object.keys(message).includes('body') ||
    !Object.keys(message).includes('meta')
  ) {
    return <span />;
  }

  // Implement with useMemo insted create on every render
  const collection = []; /*  { collection } = useMemo(
    () =>
      prepare(
        propCollection.directories || [],
        propCollection.messages || [],
        meta
      ) || [],
    [propCollection.directories, propCollection.messages, meta]
  ); */

  /* let { collection } =
    prepare(
      propCollection.directories || [],
      propCollection.messages || [],
      meta
    ) || []; */

  const [activeType, setActiveType] = useState(
    messageTypes.find((t) => t.id === message.meta.type) || {
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

  const envelopeDD = envelopeList.map((e) => {
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
      message.meta.envelope &&
      message.meta.envelope !== selectedEnvelope.id
    ) {
      setSelectedEnvelope(
        envelopeDD.find((e) => e.id === message.meta.envelope)
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

    if (message?.meta.type && message?.meta.type !== activeType.id) {
      setActiveType(messageTypes.find((t) => t.id === message?.meta.type));
    }
  }, [message, activePlayground]);

  let quickSelectionMenus = [];
  quickSelectionMenus[0] = Object.assign(
    {},
    {
      title: 'Quick Payload',
      items: messageTypes
        ? _compact(
            messageTypes.map((item) => {
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
      active_item: messageTypes && activeType ? activeType.id : '',
    }
  );

  const _onSelectBodyType = (type) => {
    if (!type || !type.id) return;
    setActiveType((ps) => {
      prevType_ref.current = ps.id;
      return type;
    });
    toggleSelectTypeDD(false);
    if (type.id === EMessagePayloadTypes.noBody) {
      _updateMessage(
        Object.assign({}, initialPlaygroundMessage, {
          meta: Object.assign({}, initialPlaygroundMessage.meta, {
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
        meta: Object.assign({}, initialPlaygroundMessage.meta, {
          type: EMessagePayloadTypes.file,
        }),
      });
      setMessageBody('');
    } else if (
      message &&
      message.meta.envelope === '' &&
      (type.id === EMessagePayloadTypes.arraybufferview ||
        type.id === EMessagePayloadTypes.arraybuffer)
    ) {
      _updateMessage({
        meta: {
          envelope: selectedEnvelope.id,
          type: type.id,
        },
      }); //TODO: check
    } else if (
      type.id !== EMessagePayloadTypes.arraybufferview &&
      type.id !== EMessagePayloadTypes.arraybuffer
    ) {
      _updateMessage({
        meta: {
          envelope: '',
          type: type.id,
        },
      });
    }
  };

  const _onSelectEnvelope = (env) => {
    if (env && env.id) {
      setSelectedEnvelope(env);
      _updateMessage({
        meta: {
          ...message.meta,
          envelope: env.id,
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
    saveUpdatedPlaygroundMessage(
      selectedMessageId_Ref?.current || selectedMessageId
    );
    onUpdateRequest();
  };

  const _onAddMesage = (data) => {
    // console.log(`data add message`, data);
    ctx_updateCollectionFns.addMessage(_object.omit(data, ['path']));

    if (data.path) {
      _updateMessage({ meta: { ...message.meta }, path: data.path || '' });
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

  const _onSaveMessgaeFromPlygnd = () => {
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
          _onSaveMessgaeFromPlygnd();
          break;

        case EDITOR_COMMANDS.SEND_AND_SAVE.command:
          await _onSendMessage();
          _onSaveMessgaeFromPlygnd();
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
         _onSaveMessgaeFromPlygnd();
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
      _onSaveMessgaeFromPlygnd();
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
      _onSaveMessgaeFromPlygnd();
    },
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
                !playgroundTab?.meta?.isSaved && !playgroundTab?.meta?.hasChange
              ) ? (
                <SaveMessage
                  isPopoverOpen={isSaveMessagePopoverOpen}
                  collection={collection || []}
                  id={`push-message-${tabData.id || ''}`}
                  hasChange={playgroundTab?.meta?.hasChange || false}
                  isSaved={playgroundTab?.meta?.isSaved || false}
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
            <Dropdown
              isOpen={isSelectTypeDDOpen}
              selected={activeType?.name || ''}
              onToggle={() => toggleSelectTypeDD(!isSelectTypeDDOpen)}
            >
              <Dropdown.Handler>
                <div className="flex text-sm items-center">
                  {' '}
                  Message as
                  <Button
                    text={activeType?.name || ''}
                    withCaret
                    primary
                    transparent
                    ghost
                    xs
                    className="ml-1"
                  />
                </div>
              </Dropdown.Handler>
              <Dropdown.Options
                options={messageTypes || []}
                onSelect={_onSelectBodyType}
              />
            </Dropdown>
            {activeType &&
            (activeType.id === EMessagePayloadTypes.arraybuffer ||
              activeType.id === EMessagePayloadTypes.arraybufferview) ? (
              <Dropdown
                isOpen={isSelectedEnvelopeOpen}
                selected={selectedEnvelope?.name || ''}
                onToggle={() =>
                  toggleSelectedEnvelopeOpen(!isSelectedEnvelopeOpen)
                }
              >
                <Dropdown.Handler>
                  <Button
                    text={selectedEnvelope?.name || ''}
                    transparent
                    withCaret
                    primary
                    sm
                    ghost
                  />
                </Dropdown.Handler>
                <Dropdown.Options
                  options={envelopeDD || []}
                  onSelect={_onSelectEnvelope}
                />
              </Dropdown>
            ) : (
              ''
            )}
          </TabHeader.Left>
          <TabHeader.Right>
            <Button
              icon={<VscFile size={12} className="ml-1" />}
              onClick={() => {}}
              secondary
              iconCenter
              xs
              text="Save"
              iconRight
            />
            <SendButton onSend={_onSendMessage} />
          </TabHeader.Right>
        </TabHeader>
      </Container.Header>
      <Container.Body className="with-divider !m-2 !mt-0 border border-appBorder">
        {activeType.id === EMessagePayloadTypes.noBody ? (
          <Container.Empty>
            <QuickSelection menus={quickSelectionMenus} />
          </Container.Empty>
        ) : (
          _renderActiveBody(activeType)
        )}
      </Container.Body>
      {/* <Container.Footer>
        <TabHeader className="padding-small height-small invisible-scrollbar">
          <TabHeader.Left>
            {selectedMessageId &&
            selectedMessageId.length &&
            playgroundTab?.meta?.hasChange === true ? (
              <Button
                key="original_button"
                text={'Set original'}
                onClick={_setToOriginal}
                secondary
                sm
              />
            ) : (
              <DocButton
                key="doc_button"
                className={
                  'fc-button transparent without-border with-icon-left small'
                }
                text={'Help'}
                link={
                  'https://firecamp.io/docs/clients/websocket/connecting-ws-endpoint'
                }
                iconClassName={'iconv2-info-icon font-base'}
              />
            )}
          </TabHeader.Left>
          <TabHeader.Right>
            <SendButton onSend={_onSendMessage} />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer> */}
    </Container>
  );
};
export default MessagePlayground;

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
  let [messageName, set_message_name] = useState('');
  // let [is_popover_open, toggle_popover] = useState(false);
  let [focusedNode, setFocusedNode] = useState({
    _meta: { _relative_path: './' },
  });

  let _handleChangeName = (e) => {
    e.preventDefault();

    let { value } = e.target;
    set_message_name(value);
  };

  let _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      // e.preventDefault();
      _onSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleOpenPopover(false);
    }
  };

  let _onSubmit = (e) => {
    // if (!messageName.length) return;
    if (e) {
      e.preventDefault();
    }

    // console.log(`focusedNode`, focusedNode);

    let msgPayload = { name: messageName };
    let path = '';

    if (focusedNode && focusedNode._meta.id) {
      path =
        focusedNode._meta && focusedNode._meta._relative_path
          ? focusedNode._meta._relative_path + `/${messageName}`
          : '';
      msgPayload = Object.assign({}, msgPayload, {
        parent_id: focusedNode._meta.id,
        path,
      });
    } else {
      path =
        focusedNode._meta && focusedNode._meta._relative_path
          ? focusedNode._meta._relative_path + `${messageName}`
          : '';
      msgPayload = Object.assign({}, msgPayload, {
        path,
      });
    }

    onSubmit(msgPayload);
    toggleOpenPopover(!isPopoverOpen);
    set_message_name('');
    setFocusedNode({
      _meta: { _relative_path: './' },
    });
  };

  let _onClickSaveMessage = () => {
    if (hasChange) {
      onUpdate();
    }
  };

  let _addDirectory = (dir) => {
    onAddDirectory(dir);
    // setActiveDir({path: "./", id: ""});
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
                    <span>({focusedNode._meta._relative_path})</span>
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

const SendButton = ({ onSend = () => {} }) => {
  return (
    <Button
      icon={<IoSendSharp size={12} className="ml-1" />}
      onClick={onSend}
      primary
      iconCenter
      xs
      text="Send"
      iconRight
    />
  );
};
