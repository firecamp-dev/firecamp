import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import _compact from 'lodash/compact';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import {
  Container,
  Input,
  Button,
  TabHeader,
  Checkbox
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { _object } from '@firecamp/utils';

// import Header from './Header';
import Footer from './Footer';
import BodyControls from './BodyControls';
import EmitterArgMeta from './EmitterArgMeta';
import EmitterArgTabs from './EmitterArgTabs';
import Body from './Body';
import { SocketContext } from '../../../Socket.context';
import { EEmitterPayloadTypes } from '../../../../types';
import {
  InitArg,
  EditorCommands,
  ArgTypes,
  TypedArrayViews,
  InitPlayground,
} from '../../../../constants';
import { ISocketStore, useSocketStore } from '../../../../store';

const EmitterPlayground = ({ tabData = {} }) => {
  const {
    activePlayground,
    playground,
    playgroundTabs,
    changePlaygroundEmitter,
    setSelectedCollectionEmitter,
    sendMessage,
  } = useSocketStore(
    (s: ISocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      // collection: s.collection,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundTabs: s.runtime.playgroundTabs,
      __meta: s.request.__meta,

      changePlaygroundEmitter: s.changePlaygroundEmitter,
      setSelectedCollectionEmitter: s.setSelectedCollectionEmitter,
      sendMessage: s.sendMessage,
    }),
    shallow
  );

  // Prevent updating actual prop element
  const _playground = _cloneDeep(playground);

  const selectedCollectionEmitter = _playground.selectedCollectionEmitter;
  const playgroundTab = useMemo(
    () => playgroundTabs.find((tab) => tab.id === activePlayground),
    [activePlayground, playgroundTabs]
  );
  const playgroundEmitter = useMemo(
    () => _playground?.emitter || InitPlayground,
    [_playground, activePlayground]
  );

  const {
    ctx_firecampFunctions,
    ctx_updateCollectionFns,
    ctx_playgroundEmitterFns,
  } = useContext(SocketContext);

  const { addEmitter } = ctx_updateCollectionFns;

  const {
    update: updateCacheEmitter,
    onSave: onSaveUpdatedCacheEmitter,
    addNewEmitter,
    setToOriginal: setCacheEmitterToOriginal,
  } = ctx_playgroundEmitterFns;

  const onUpdateRequest = () => {};

  const activeEmitterRef = useRef(selectedCollectionEmitter);

  const useStateWithPromise = (initialState) => {
    const [state, setState] = useState(initialState);
    const resolverRef = useRef(null);

    useEffect(() => {
      if (resolverRef.current) {
        resolverRef.current(state);
        resolverRef.current = null;
      }
      /**
       * Since a state update could be triggered with the exact same state again,
       * it's not enough to specify state as the only dependency of this useEffect.
       * That's why resolverRef.current is also a dependency, because it will guarantee,
       * that handleSetState was called in previous render
       */
    }, [resolverRef.current, state]);

    const handleSetState = useCallback(
      (stateAction) => {
        setState(stateAction);
        return new Promise((resolve) => {
          resolverRef.current = resolve;
        });
      },
      [setState]
    );
    return [state, handleSetState];
  };

  // @bug: on real-time update, can not switch argument except 0
  const [activeArgIndex, setActiveArgIndex] = useStateWithPromise(0);
  const argRef = useRef(activeArgIndex);

  useEffect(() => {
    const _updateIndex = async () => {
      await _playgroundEmitterFns.setIndex(0);
    };
    _updateIndex()
      .then((r) => r)
      .catch((e) => e);
    activeEmitterRef.current = selectedCollectionEmitter;
  }, [selectedCollectionEmitter]);

  if (!activePlayground || !playgroundEmitter) {
    return <span />;
  } else if (
    playgroundEmitter &&
    (!playgroundEmitter.body ||
      (playgroundEmitter.body &&
        (!playgroundEmitter.body[argRef.current] ||
          !playgroundEmitter.body[argRef.current].__meta ||
          (playgroundEmitter.body[argRef.current].__meta &&
            (!Object.hasOwnProperty.call(
              playgroundEmitter.body[argRef.current],
              'payload'
            ) ||
              !Object.hasOwnProperty.call(
                playgroundEmitter.body[argRef.current].__meta,
                'typedArrayView'
              ) ||
              !Object.hasOwnProperty.call(
                playgroundEmitter.body[argRef.current].__meta,
                'type'
              ))))))
  ) {
    playgroundEmitter.body[argRef.current] = _merge(
      _cloneDeep(InitArg),
      _cloneDeep(playgroundEmitter.body[argRef.current])
    );

    // argRef.current = 0;
  }

  const { collection } = [];
  // prepare(
  //   propCollection.directories || [],
  //   propCollection.emitters || [],
  //   __meta
  // ) || [];

  const [activeArgType, setActiveArgType] = useState(
    () =>
      ArgTypes.find(
        (t) => t.id === playgroundEmitter.body[argRef.current].__meta.type
      ) || {
        id: EEmitterPayloadTypes.noBody,
        name: 'No body',
      }
  );

  const [prevType, setPrevType] = useState(EEmitterPayloadTypes.noBody);
  const [isSelectTypeDDOpen, toggleSelectArgTypeDD] = useState(false);
  const [emitterBody, setEmitterBody] = useState('');
  // const [isMessageDirty, toggleMessageDirty] = useState(false);
  const [isSaveEmitterPopoverOpen, toggleSaveEmitterPopover] = useState(false);
  const [saveButtonHandler, updateSaveButtonHandler] = useState({
    isOpenPopup: false,
    isMessageDirty: false,
  });
  const typedArrayList = TypedArrayViews.map((e) => {
    return {
      id: e,
      name: e,
    };
  });

  //arraybuffer
  const [selectedTypedArray, setSelectedTypedArray] = useState(typedArrayList[0]);

  useEffect(() => {
    if (
      playgroundEmitter.body[argRef.current].__meta.type &&
      playgroundEmitter.body[argRef.current].__meta.type !== activeArgType.id
    ) {
      setActiveArgType(
        ArgTypes.find(
          (t) => t.id === playgroundEmitter.body[argRef.current].__meta.type
        )
      );
    }

    if (
      activeArgType.id !== EEmitterPayloadTypes.file &&
      prevType.id === EEmitterPayloadTypes.file &&
      playgroundEmitter.body[argRef.current].payload !== ''
    ) {
      _playgroundEmitterFns.updateBody({ payload: '' });
      setPrevType(activeArgType.id);
    }

    if (
      playgroundEmitter.body[argRef.current].__meta.typedArrayView &&
      playgroundEmitter.body[argRef.current].__meta.typedArrayView !==
        selectedTypedArray.id
    ) {
      setSelectedTypedArray(
        typedArrayList.find(
          (e) => e.id === playgroundEmitter.body[argRef.current].__meta.typedArrayView
        ) || selectedTypedArray
      );
    }
    if (!equal(emitterBody, playgroundEmitter.body[argRef.current].payload)) {
      setEmitterBody(playgroundEmitter.body[argRef.current].payload);
    } else if (
      activeArgType.id === EEmitterPayloadTypes.file &&
      emitterBody !== playgroundEmitter.body[argRef.current].payload
    ) {
      setEmitterBody(playgroundEmitter.body[argRef.current].payload);
    }
  }, []);

  useEffect(() => {
    if (
      playgroundEmitter?.body?.[argRef.current]?.__meta.type !==
      activeArgType.id
    ) {
      setActiveArgType(
        ArgTypes.find(
          (t) => t.id === playgroundEmitter.body[argRef.current].__meta.type
        )
      );
    }
    if (
      playgroundEmitter?.body?.[argRef.current]?.__meta.typedArrayView !==
      selectedTypedArray.id
    ) {
      setSelectedTypedArray(
        typedArrayList.find(
          (e) => e.id === playgroundEmitter.body[argRef.current].__meta.typedArrayView
        ) || selectedTypedArray
      );
    }
  }, [argRef.current, playgroundEmitter]);

  const quickSelectionMenus = [];
  quickSelectionMenus[0] = Object.assign(
    {},
    {
      title: 'Quick Payload',
      items: ArgTypes
        ? _compact(
            ArgTypes.map((item) => {
              if (item.id !== EEmitterPayloadTypes.noBody) {
                return Object.assign({}, item, {
                  onClick: () => {
                    // setActiveArgType(item || "");
                    _onSelectArgType(item);
                  },
                });
              }
            })
          )
        : [],
      active_item: ArgTypes && activeArgType ? activeArgType.id : '',
    }
  );
  /**
   * On select argument type noBody
   * check if last argument or not. If last argument then ask confirmation. else set argument type noBody.
   * Confirmation modal:
   *    on click confirm, remove all next arguments and set current argument type as noBody.
   *    on click cancel, do nothing.
   */
   const _onSelectTypeNoBody = async () => {
    /**
     * on confirm, set argument type as noBody, close dropdown and update emitter
     */
     const _onConfirm = () => {
      setActiveArgType(EEmitterPayloadTypes.noBody);
      toggleSelectArgTypeDD(false);
      _playgroundEmitterFns.updateBody(
        {
          payload: '',
          path: '',
          __meta: {
            typedArrayView: '',
            type: EEmitterPayloadTypes.noBody,
          },
        },
        false,
        true
      );
      setSelectedCollectionEmitter(activePlayground, '');
      setPrevType(activeArgType);
    };

    /**
     * Check if current argument is last argument or not. If last then set argument type as noBody.
     */
    if (playgroundEmitter.body?.length - 1 === argRef.current) {
      _onConfirm();
      return;
    }

    try {
      /**
       * Open confirmation modal if current argument is not last one.
       */
      await ctx_firecampFunctions.confirmationPopup({
        isOpen: true,
        title: 'Confirmation Required',
        message: `After switching to noBody, all subsequent arguments will be removed (Revert by clicking on the Set Original button)`,
        note: 'Please confirm before switch type',
        _meta: {
          buttons: {
            confirm: {
              text: 'Confirm',
              classname: '',
              color: '',
            },
            cancel: {
              text: 'Cancel',
              classname: '',
              color: '',
            },
          },
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
        },
        onConfirm: () => {
          _onConfirm();
        },
        onCancel: () => {},
      });
    } catch (e) {
      console.log({ e });
    }
  };

  const _onSelectArgType = (type) => {
    if (!type || !type.id || activeArgType.id === type.id) return;

    if (type.id === EEmitterPayloadTypes.noBody) {
      _onSelectTypeNoBody();
      return;
    } else {
      setActiveArgType(type);
      toggleSelectArgTypeDD(false);
      if (
        playgroundEmitter &&
        // playgroundEmitter.body[argRef.current].__meta.typedArrayView === "" &&
        (type.id === EEmitterPayloadTypes.arraybufferview ||
          type.id === EEmitterPayloadTypes.arraybuffer)
      ) {
        if (playgroundEmitter.body[argRef.current].__meta.typedArrayView !== '') {
          _playgroundEmitterFns.updateBody({
            __meta: { type: type.id },
            payload: '',
          });
        } else {
          _playgroundEmitterFns.updateBody({
            payload: '',
            __meta: { type: type.id, typedArrayView: selectedTypedArray.id },
          });
        }
      } else if (
        type.id !== EEmitterPayloadTypes.arraybufferview &&
        type.id !== EEmitterPayloadTypes.arraybuffer
      ) {
        if (
          type.id !== EEmitterPayloadTypes.file &&
          activeArgType.id === EEmitterPayloadTypes.file &&
          playgroundEmitter.body[argRef.current].payload !== ''
        ) {
          _playgroundEmitterFns.updateBody({
            payload: '',
            __meta: { type: type.id },
            typedArrayView: '',
          });
          setEmitterBody('');
        } else if (
          playgroundEmitter.body[argRef.current].__meta.typedArrayView !== ''
        ) {
          _playgroundEmitterFns.updateBody({
            __meta: { type: type.id, typedArrayView: '' },
          });
        } else {
          _playgroundEmitterFns.updateBody({ __meta: { type: type.id } });
        }
      }
    }
    setPrevType(activeArgType);
    // _playgroundEmitterFns.updateBody({ __meta: { type: type.id } });
  };

  const _onSelectTypedArray = (env) => {
    if (env && env.id) {
      setSelectedTypedArray(env);
      _playgroundEmitterFns.updateBody({ __meta: { typedArrayView: env.id } });
    }
  };

  const _playgroundEmitterFns = {
    update: async (emitter = {}) => {
      const emitterPayload = Object.assign({}, playgroundEmitter, emitter);
      await changePlaygroundEmitter(_object.omit(emitterPayload, ['path']));

      updateCacheEmitter(
        activeEmitterRef.current || selectedCollectionEmitter,
        emitterPayload
      );
    },

    /**
     * Update emitter argument body payload
     * @param {*} payload : Updated body payload
     * @param {*} fromFile : true if body is updated from file
     * @param {*} isNoBody : true if argument type set to noBody
     * @returns
     */
    updateBody: (payload = {}, fromFile = false, isNoBody = false) => {
      let updatedEmitter = {},
        emitterBodyPayload = [];
      if (!fromFile) {
        updatedEmitter = _object.mergeDeep(
          playgroundEmitter.body[argRef.current],
          payload
        );
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, argRef.current),
          Object.assign(
            {},
            playgroundEmitter.body[argRef.current],
            updatedEmitter
          ),
          ...playgroundEmitter.body.slice(argRef.current + 1),
        ];
      } else {
        updatedEmitter = payload;
      }
      // If no body is set as arg type then remove all next args
      if (isNoBody) {
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, argRef.current),
          Object.assign(
            {},
            playgroundEmitter.body[argRef.current],
            updatedEmitter
          ),
        ];
      } else {
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, argRef.current),
          Object.assign(
            {},
            playgroundEmitter.body[argRef.current],
            updatedEmitter
          ),
          ...playgroundEmitter.body.slice(argRef.current + 1),
        ];
      }

      if (!payload) return;
      _playgroundEmitterFns.update({ body: emitterBodyPayload });
    },

    updateMeta: (__meta = {}) => {
      const emitterMeta = Object.assign({}, playgroundEmitter.__meta || {}, __meta);
      _playgroundEmitterFns.update({ __meta: emitterMeta });
    },

    addArg: async () => {
      if (
        playgroundEmitter.body &&
        playgroundEmitter.body.length === 5 &&
        playgroundEmitter.body[argRef.current]?.__meta.type ===
          EEmitterPayloadTypes.noBody
      ) {
        return;
      }

      /**
       * Set new argument type as previous one
       * Set argument typedArrayView type by default if type is arraybuffer or arraybufferview
       */
       const newArg = {
        ...InitArg,
        __meta: {
          ...InitArg.__meta,
          type:
            playgroundEmitter.body[argRef.current]?.__meta.type ||
            EEmitterPayloadTypes.noBody,
          typedArrayView:
            playgroundEmitter.body[argRef.current]?.__meta.type ===
              EEmitterPayloadTypes.arraybuffer ||
            playgroundEmitter.body[argRef.current]?.__meta.type ===
              EEmitterPayloadTypes.arraybufferview
              ? TypedArrayViews[0]
              : '',
        },
      };

      const emitterBodyPayload = [...playgroundEmitter.body, newArg];
      setSelectedTypedArray(typedArrayList[0]);
      _playgroundEmitterFns.update({ body: emitterBodyPayload });
      await _playgroundEmitterFns.setIndex(
        emitterBodyPayload.length > 0 ? emitterBodyPayload.length - 1 : 0
      );
    },

    removeArg: async (index) => {
      if (
        index === undefined ||
        (playgroundEmitter.body && playgroundEmitter.body.length === 1) ||
        !playgroundEmitter.body[index]
      ) {
        // console.log(`in return`);
        return;
      }

      const newActiveArgIndex = index === 0 ? 1 : index - 1;
      /*if (index === argRef.current) {
        newActiveArgIndex = index === 0 ? 1 : index - 1;
      }*/
      await _playgroundEmitterFns.setIndex(newActiveArgIndex);
      await _playgroundEmitterFns.update({
        body: [
          ...playgroundEmitter.body.slice(0, index),
          ...playgroundEmitter.body.slice(index + 1),
        ],
      });
    },

    setIndex: async (index = 0) => {
      if (activeArgIndex !== argRef.current || index !== argRef.current) {
        argRef.current = index;
        await setActiveArgIndex(index);
      }
      return Promise.resolve({});
    },
  };

  const _onSelectFile = (e) => {
    const target = e.target;
    const file = target.files[0];
    setEmitterBody(file);
    _playgroundEmitterFns.updateBody({ payload: file }, true);
  };

  const _onEmit = (e) => {
    if (e) e.preventDefault();

    sendMessage(activePlayground, _object.omit(playgroundEmitter, ['path']));
  };

  const _onUpdateEmitter = () => {
    // TODO: check for reserved emitter name

    onSaveUpdatedCacheEmitter(
      activeEmitterRef.current || selectedCollectionEmitter
    );
    onUpdateRequest();
  };

  const _onAddEmitter = (data) => {
    addEmitter(Object.assign({}, data));
  };

  const _addNewEmitter = async () => {
    await _playgroundEmitterFns.setIndex(0);
    addNewEmitter();
    setActiveArgType(ArgTypes[0]);
    setSelectedCollectionEmitter(activePlayground, '');

    activeEmitterRef.current = '';
  };

  const _setToOriginal = () => {
    setCacheEmitterToOriginal(
      activeEmitterRef.current || selectedCollectionEmitter
    );
  };

  const _onSaveMessageFromPlygnd = () => {
    if (activeEmitterRef.current || selectedCollectionEmitter) {
      _onUpdateEmitter();
    } else {
      // console.log(`new message here!`)
      toggleSaveEmitterPopover(true);
    }
  };

  const shortcutFns = {
    onCtrlS: () => {
      _onSaveMessageFromPlygnd();
    },
    onCtrlEnter: async () => {
      _onEmit();
    },
    onCtrlO: () => {
      _setToOriginal();
    },
    onCtrlK: () => {
      _addNewEmitter();
    },
    onCtrlShiftEnter: async () => {
      await _onEmit();
      _onSaveMessageFromPlygnd();
    },
  };

  return (
    <Container>
      {/* <BodyControls
        emitterName={playgroundEmitter.name || ''}
        isSaveEmitterPopoverOpen={isSaveEmitterPopoverOpen}
        tabData={tabData}
        tabId={tabData.id || ''}
        collection={collection}
        activeType={activeArgType}
        toggleSaveEmitterPopover={toggleSaveEmitterPopover}
        playgroundTabMeta={playgroundTab.__meta}
        onAddEmitter={_onAddEmitter}
        onUpdateEmitter={_onUpdateEmitter}
        path={playgroundEmitter.path || `./`}
        showClearPlaygroundButton={
          !!(emitterBody && emitterBody.length) ||
          !!(
            playgroundEmitter.name &&
            playgroundEmitter.name.trim() &&
            playgroundEmitter.name.trim().length
          )
        }
        addNewEmitter={_addNewEmitter}
        editorCommands={EditorCommands}
      /> */}
      <EmitterName
        name={playgroundEmitter.name || ''}
        onChange={(name) => {
          _playgroundEmitterFns.update({ name });
        }}
        onEmit={_onEmit}
      />
      <div className="px-2 pb-2 flex-1 flex flex-col">
      <TabHeader className="height-small !px-0">
        <TabHeader.Left>
        <span className="text-appForeground text-sm block">add arguments</span>
        </TabHeader.Left>
        <TabHeader.Right>
        <Checkbox
          isChecked={true}
          label="Ack"
        />
        <Button
              icon={<IoSendSharp size={12} className="ml-1" />}
              primary
              iconCenter
              xs
              text="Send"
              iconRight
            />
        </TabHeader.Right>
      </TabHeader>
      <div className="border border-appBorder flex-1 flex flex-col">
        <EmitterArgTabs
          ack={playgroundEmitter.__meta ? playgroundEmitter.__meta.ack : false}
          args={playgroundEmitter.body}
          activeArgIndex={argRef.current}
          onAddArg={() => _playgroundEmitterFns.addArg()}
          onSelectArgTab={(index) =>
            _playgroundEmitterFns.setIndex(index, 'manually')
          }
          onRemoveArg={(index) => _playgroundEmitterFns.removeArg(index)}
          toggleAck={(ack) => _playgroundEmitterFns.updateMeta({ ack })}
        />
      <EmitterArgMeta
        activeArgIndex={argRef.current}
        ArgTypes={ArgTypes}
        activeArgType={activeArgType}
        typedArrayList={typedArrayList}
        selectedTypedArray={selectedTypedArray}
        isSelectTypeDDOpen={isSelectTypeDDOpen}
        onSelectArgType={_onSelectArgType}
        toggleSelectArgTypeDD={toggleSelectArgTypeDD}
        onSelectTypedArray={_onSelectTypedArray}
      />
      <Body
        emitterName={playgroundEmitter.name || ''}
        activeArgIndex={argRef.current}
        tabId={tabData.id}
        activeArgType={activeArgType}
        emitterBody={emitterBody}
        playgroundBody={playgroundEmitter.body[argRef.current].payload}
        quickSelectionMenus={quickSelectionMenus}
        setEmitterBody={setEmitterBody}
        updateEmitterBody={(value) =>
          _playgroundEmitterFns.updateBody({ payload: value })
        }
        onSelectFile={_onSelectFile}
        shortcutFns={shortcutFns}
      />
      </div>
      </div>
      {/* <Footer
        emitterName={playgroundEmitter.name || ''}
        activeEmitter={selectedCollectionEmitter}
        saveButtonHandler={saveButtonHandler}
        showEmitButton={
          true /* activeArgType.id !== EEmitterPayloadTypes.noBody */
        }
        {/* onEmit={_onEmit}
        setToOriginal={_setToOriginal}
      /> */} 
    </Container>
  );
};

export default EmitterPlayground;

const EmitterName = ({ name = '', onChange = (val) => {}, onEmit = () => {} }) => {
  const _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { value } = e.target;
    onChange(value);
  };

  return (
    <Container.Header className="!px-2 !py-2">
      <Input
        autoFocus={true}
        placeholder="Type emitter name"
        label='Type emitter name'
        className="border-0"
        value={name}
        onChange={_handleInputChange}
        wrapperClassName="!mb-0"
        // postComponents={[
        //   <Button
        //     icon={<IoSendSharp className="toggle-arrow" size={12} />}
        //     onClick={onEmit}
        //     disabled={!name}
        //     className="!rounded-none"
        //     primary
        //     sm
        //     iconLeft
        //   />,
        // ]}
      />
    </Container.Header>
  );
};
