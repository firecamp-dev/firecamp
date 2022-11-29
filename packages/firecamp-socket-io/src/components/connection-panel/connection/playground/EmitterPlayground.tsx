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
  EnvelopeTypes,
  InitPlayground,
} from '../../../../constants';
import { ISocketStore, useSocketStore } from '../../../../store';

const EmitterPlayground = ({ tabData = {} }) => {
  let {
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
      meta: s.request.meta,

      changePlaygroundEmitter: s.changePlaygroundEmitter,
      setSelectedCollectionEmitter: s.setSelectedCollectionEmitter,
      sendMessage: s.sendMessage,
    }),
    shallow
  );

  // Prevent updating actual prop element
  playground = _cloneDeep(playground);

  let selectedCollectionEmitter = playground.selectedCollectionEmitter;
  let playgroundTab = useMemo(
    () => playgroundTabs.find((tab) => tab.id === activePlayground),
    [activePlayground, playgroundTabs]
  );

  let playgroundEmitter = useMemo(
    () => playground?.emitter || InitPlayground,
    [playground, activePlayground]
  );

  let {
    ctx_firecampFunctions,
    ctx_updateCollectionFns,
    ctx_playgroundEmitterFns,
  } = useContext(SocketContext);

  let { addEmitter } = ctx_updateCollectionFns;

  let {
    update: updateCacheEmitter,
    onSave: onSaveUpdatedCacheEmitter,
    addNewEmitter,
    setToOriginal: setCacheEmitterToOriginal,
  } = ctx_playgroundEmitterFns;

  let onUpdateRequest = () => {};

  let activeEmitter_Ref = useRef(selectedCollectionEmitter);

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
  let [activeArgIndex, setActiveArgIndex] = useStateWithPromise(0);
  let arg_ref = useRef(activeArgIndex);

  useEffect(() => {
    let _updateIndex = async () => {
      await _playgroundEmitterFns.setIndex(0);
    };
    _updateIndex()
      .then((r) => r)
      .catch((e) => e);
    activeEmitter_Ref.current = selectedCollectionEmitter;
  }, [selectedCollectionEmitter]);

  if (!activePlayground || !playgroundEmitter) {
    return <span />;
  } else if (
    playgroundEmitter &&
    (!playgroundEmitter.body ||
      (playgroundEmitter.body &&
        (!playgroundEmitter.body[arg_ref.current] ||
          !playgroundEmitter.body[arg_ref.current].meta ||
          (playgroundEmitter.body[arg_ref.current].meta &&
            (!Object.hasOwnProperty.call(
              playgroundEmitter.body[arg_ref.current],
              'payload'
            ) ||
              !Object.hasOwnProperty.call(
                playgroundEmitter.body[arg_ref.current].meta,
                'typedArrayView'
              ) ||
              !Object.hasOwnProperty.call(
                playgroundEmitter.body[arg_ref.current].meta,
                'type'
              ))))))
  ) {
    playgroundEmitter.body[arg_ref.current] = _merge(
      _cloneDeep(InitArg),
      _cloneDeep(playgroundEmitter.body[arg_ref.current])
    );

    // arg_ref.current = 0;
  }

  let { collection } = [];
  // prepare(
  //   propCollection.directories || [],
  //   propCollection.emitters || [],
  //   meta
  // ) || [];

  let [activeArgType, setActiveArgType] = useState(
    () =>
      ArgTypes.find(
        (t) => t.id === playgroundEmitter.body[arg_ref.current].meta.type
      ) || {
        id: EEmitterPayloadTypes.noBody,
        name: 'No body',
      }
  );

  let [prevType, setPrevType] = useState(EEmitterPayloadTypes.noBody);
  let [isSelectTypeDDOpen, toggleSelectArgTypeDD] = useState(false);
  let [emitterBody, setEmitterBody] = useState('');
  // let [isMessageDirty, toggleMessageDirty] = useState(false);
  let [isSaveEmitterPopoverOpen, toggleSaveEmitterPopover] = useState(false);
  let [saveButtonHandler, updateSaveButtonHandler] = useState({
    isOpenPopup: false,
    isMessageDirty: false,
  });
  let envelopeList = EnvelopeTypes.map((e) => {
    return {
      id: e,
      name: e,
    };
  });

  //arraybuffer
  let [selectedEnvelope, setSelectedEnvelope] = useState(envelopeList[0]);

  useEffect(() => {
    if (
      playgroundEmitter.body[arg_ref.current].meta.type &&
      playgroundEmitter.body[arg_ref.current].meta.type !== activeArgType.id
    ) {
      setActiveArgType(
        ArgTypes.find(
          (t) => t.id === playgroundEmitter.body[arg_ref.current].meta.type
        )
      );
    }

    if (
      activeArgType.id !== EEmitterPayloadTypes.file &&
      prevType.id === EEmitterPayloadTypes.file &&
      playgroundEmitter.body[arg_ref.current].payload !== ''
    ) {
      _playgroundEmitterFns.updateBody({ payload: '' });
      setPrevType(activeArgType.id);
    }

    if (
      playgroundEmitter.body[arg_ref.current].meta.typedArrayView &&
      playgroundEmitter.body[arg_ref.current].meta.typedArrayView !==
        selectedEnvelope.id
    ) {
      setSelectedEnvelope(
        envelopeList.find(
          (e) => e.id === playgroundEmitter.body[arg_ref.current].meta.typedArrayViewayView
        ) || selectedEnvelope
      );
    }
    if (!equal(emitterBody, playgroundEmitter.body[arg_ref.current].payload)) {
      setEmitterBody(playgroundEmitter.body[arg_ref.current].payload);
    } else if (
      activeArgType.id === EEmitterPayloadTypes.file &&
      emitterBody !== playgroundEmitter.body[arg_ref.current].payload
    ) {
      setEmitterBody(playgroundEmitter.body[arg_ref.current].payload);
    }
  }, []);

  useEffect(() => {
    if (
      playgroundEmitter?.body?.[arg_ref.current]?.meta?.type !==
      activeArgType.id
    ) {
      setActiveArgType(
        ArgTypes.find(
          (t) => t.id === playgroundEmitter.body[arg_ref.current].meta.type
        )
      );
    }
    if (
      playgroundEmitter?.body?.[arg_ref.current]?.meta?.typedArrayView !==
      selectedEnvelope.id
    ) {
      setSelectedEnvelope(
        envelopeList.find(
          (e) => e.id === playgroundEmitter.body[arg_ref.current].meta.typedArrayViewayViewayView
        ) || selectedEnvelope
      );
    }
  }, [arg_ref.current, playgroundEmitter]);

  let quickSelectionMenus = [];
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
  let _onSelectTypeNoBody = async () => {
    /**
     * on confirm, set argument type as noBody, close dropdown and update emitter
     */
    let _onConfirm = () => {
      setActiveArgType(EEmitterPayloadTypes.noBody);
      toggleSelectArgTypeDD(false);
      _playgroundEmitterFns.updateBody(
        {
          payload: '',
          path: '',
          meta: {
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
    if (playgroundEmitter.body?.length - 1 === arg_ref.current) {
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

  let _onSelectArgType = (type) => {
    if (!type || !type.id || activeArgType.id === type.id) return;

    if (type.id === EEmitterPayloadTypes.noBody) {
      _onSelectTypeNoBody();
      return;
    } else {
      setActiveArgType(type);
      toggleSelectArgTypeDD(false);
      if (
        playgroundEmitter &&
        // playgroundEmitter.body[arg_ref.current].meta.typedArrayView === "" &&
        (type.id === EEmitterPayloadTypes.arraybufferview ||
          type.id === EEmitterPayloadTypes.arraybuffer)
      ) {
        if (playgroundEmitter.body[arg_ref.current].meta.typedArrayView !== '') {
          _playgroundEmitterFns.updateBody({
            meta: { type: type.id },
            payload: '',
          });
        } else {
          _playgroundEmitterFns.updateBody({
            payload: '',
            meta: { type: type.id, typedArrayView: selectedEnvelope.id },
          });
        }
      } else if (
        type.id !== EEmitterPayloadTypes.arraybufferview &&
        type.id !== EEmitterPayloadTypes.arraybuffer
      ) {
        if (
          type.id !== EEmitterPayloadTypes.file &&
          activeArgType.id === EEmitterPayloadTypes.file &&
          playgroundEmitter.body[arg_ref.current].payload !== ''
        ) {
          _playgroundEmitterFns.updateBody({
            payload: '',
            meta: { type: type.id },
            typedArrayView: '',
          });
          setEmitterBody('');
        } else if (
          playgroundEmitter.body[arg_ref.current].meta.typedArrayView !== ''
        ) {
          _playgroundEmitterFns.updateBody({
            meta: { type: type.id, typedArrayView: '' },
          });
        } else {
          _playgroundEmitterFns.updateBody({ meta: { type: type.id } });
        }
      }
    }
    setPrevType(activeArgType);
    // _playgroundEmitterFns.updateBody({ meta: { type: type.id } });
  };

  let _onSelectEnvelope = (env) => {
    if (env && env.id) {
      setSelectedEnvelope(env);
      _playgroundEmitterFns.updateBody({ meta: { typedArrayView: env.id } });
    }
  };

  let _playgroundEmitterFns = {
    update: async (emitter = {}) => {
      let emitterPayload = Object.assign({}, playgroundEmitter, emitter);
      await changePlaygroundEmitter(_object.omit(emitterPayload, ['path']));

      updateCacheEmitter(
        activeEmitter_Ref.current || selectedCollectionEmitter,
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
          playgroundEmitter.body[arg_ref.current],
          payload
        );
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, arg_ref.current),
          Object.assign(
            {},
            playgroundEmitter.body[arg_ref.current],
            updatedEmitter
          ),
          ...playgroundEmitter.body.slice(arg_ref.current + 1),
        ];
      } else {
        updatedEmitter = payload;
      }
      // If no body is set as arg type then remove all next args
      if (isNoBody) {
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, arg_ref.current),
          Object.assign(
            {},
            playgroundEmitter.body[arg_ref.current],
            updatedEmitter
          ),
        ];
      } else {
        emitterBodyPayload = [
          ...playgroundEmitter.body.slice(0, arg_ref.current),
          Object.assign(
            {},
            playgroundEmitter.body[arg_ref.current],
            updatedEmitter
          ),
          ...playgroundEmitter.body.slice(arg_ref.current + 1),
        ];
      }

      if (!payload) return;
      _playgroundEmitterFns.update({ body: emitterBodyPayload });
    },

    updateMeta: (meta = {}) => {
      let emitterMeta = Object.assign({}, playgroundEmitter.meta || {}, meta);
      _playgroundEmitterFns.update({ meta: emitterMeta });
    },

    addArg: async () => {
      if (
        playgroundEmitter.body &&
        playgroundEmitter.body.length === 5 &&
        playgroundEmitter.body[arg_ref.current]?.meta?.type ===
          EEmitterPayloadTypes.noBody
      ) {
        return;
      }

      /**
       * Set new argument type as previous one
       * Set argument typedArrayView type by default if type is arraybuffer or arraybufferview
       */
      let newArg = {
        ...InitArg,
        meta: {
          ...InitArg.meta,
          type:
            playgroundEmitter.body[arg_ref.current]?.meta?.type ||
            EEmitterPayloadTypes.noBody,
          typedArrayView:
            playgroundEmitter.body[arg_ref.current]?.meta?.type ===
              EEmitterPayloadTypes.arraybuffer ||
            playgroundEmitter.body[arg_ref.current]?.meta?.type ===
              EEmitterPayloadTypes.arraybufferview
              ? EnvelopeTypes[0]
              : '',
        },
      };

      let emitterBodyPayload = [...playgroundEmitter.body, newArg];
      setSelectedEnvelope(envelopeList[0]);
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

      let newActiveArgIndex = index === 0 ? 1 : index - 1;
      /*if (index === arg_ref.current) {
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
      if (activeArgIndex !== arg_ref.current || index !== arg_ref.current) {
        arg_ref.current = index;
        await setActiveArgIndex(index);
      }
      return Promise.resolve({});
    },
  };

  let _onSelectFile = (e) => {
    let target = e.target;
    let file = target.files[0];
    setEmitterBody(file);
    _playgroundEmitterFns.updateBody({ payload: file }, true);
  };

  let _onEmit = (e) => {
    if (e) e.preventDefault();

    sendMessage(activePlayground, _object.omit(playgroundEmitter, ['path']));
  };

  let _onUpdateEmitter = () => {
    // TODO: check for reserved emitter name

    onSaveUpdatedCacheEmitter(
      activeEmitter_Ref.current || selectedCollectionEmitter
    );
    onUpdateRequest();
  };

  let _onAddEmitter = (data) => {
    addEmitter(Object.assign({}, data));
  };

  let _addNewEmitter = async () => {
    await _playgroundEmitterFns.setIndex(0);
    addNewEmitter();
    setActiveArgType(ArgTypes[0]);
    setSelectedCollectionEmitter(activePlayground, '');

    activeEmitter_Ref.current = '';
  };

  let _setToOriginal = () => {
    setCacheEmitterToOriginal(
      activeEmitter_Ref.current || selectedCollectionEmitter
    );
  };

  let _onSaveMessageFromPlygnd = () => {
    if (activeEmitter_Ref.current || selectedCollectionEmitter) {
      _onUpdateEmitter();
    } else {
      // console.log(`new message here!`)
      toggleSaveEmitterPopover(true);
    }
  };

  let shortcutFns = {
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
      <BodyControls
        emitterName={playgroundEmitter.name || ''}
        isSaveEmitterPopoverOpen={isSaveEmitterPopoverOpen}
        tabData={tabData}
        tabId={tabData.id || ''}
        collection={collection}
        activeType={activeArgType}
        toggleSaveEmitterPopover={toggleSaveEmitterPopover}
        playgroundTabMeta={playgroundTab.meta}
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
      />
      <EmitterName
        name={playgroundEmitter.name || ''}
        onChange={(name) => {
          _playgroundEmitterFns.update({ name });
        }}
        onEmit={_onEmit}
      />
      <div className="z-20 relative">
        <EmitterArgTabs
          ack={playgroundEmitter.meta ? playgroundEmitter.meta.ack : false}
          args={playgroundEmitter.body}
          activeArgIndex={arg_ref.current}
          onAddArg={() => _playgroundEmitterFns.addArg()}
          onSelectArgTab={(index) =>
            _playgroundEmitterFns.setIndex(index, 'manually')
          }
          onRemoveArg={(index) => _playgroundEmitterFns.removeArg(index)}
          toggleAck={(ack) => _playgroundEmitterFns.updateMeta({ ack })}
        />
      </div>
      <EmitterArgMeta
        activeArgIndex={arg_ref.current}
        ArgTypes={ArgTypes}
        activeArgType={activeArgType}
        envelopeList={envelopeList}
        selectedEnvelope={selectedEnvelope}
        isSelectTypeDDOpen={isSelectTypeDDOpen}
        onSelectArgType={_onSelectArgType}
        toggleSelectArgTypeDD={toggleSelectArgTypeDD}
        onSelectEnvelope={_onSelectEnvelope}
      />
      <Body
        emitterName={playgroundEmitter.name || ''}
        activeArgIndex={arg_ref.current}
        tabId={tabData.id}
        activeArgType={activeArgType}
        emitterBody={emitterBody}
        playgroundBody={playgroundEmitter.body[arg_ref.current].payload}
        quickSelectionMenus={quickSelectionMenus}
        setEmitterBody={setEmitterBody}
        updateEmitterBody={(value) =>
          _playgroundEmitterFns.updateBody({ payload: value })
        }
        onSelectFile={_onSelectFile}
        shortcutFns={shortcutFns}
      />
      <Footer
        emitterName={playgroundEmitter.name || ''}
        activeEmitter={selectedCollectionEmitter}
        saveButtonHandler={saveButtonHandler}
        showEmitButton={
          true /* activeArgType.id !== EEmitterPayloadTypes.noBody */
        }
        onEmit={_onEmit}
        setToOriginal={_setToOriginal}
      />
    </Container>
  );
};

export default EmitterPlayground;

const EmitterName = ({ name = '', onChange = () => {}, onEmit = () => {} }) => {
  let _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
    }

    let { value } = e.target;
    onChange(value);
  };

  return (
    <Container.Header className="with-divider">
      <Input
        autoFocus={true}
        placeholder="Type emitter name"
        className="border-0"
        value={name}
        onChange={_handleInputChange}
        wrapperClassName="!mb-0"
        postComponents={[
          <Button
            icon={<IoSendSharp className="toggle-arrow" size={12} />}
            onClick={onEmit}
            disabled={!name}
            className="!rounded-none"
            primary
            sm
            iconLeft
          />,
        ]}
      />
    </Container.Header>
  );
};
