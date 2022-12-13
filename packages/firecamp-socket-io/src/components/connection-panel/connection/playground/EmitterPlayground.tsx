import {
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
  Checkbox,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { _object } from '@firecamp/utils';

import EmitterArgMeta from './EmitterArgMeta';
import EmitterArgTabs from './EmitterArgTabs';
import Body from './Body';
import { EEmitterPayloadTypes } from '../../../../types';
import {
  InitArg,
  EditorCommands,
  ArgTypes,
  TypedArrayViews,
  InitPlayground,
} from '../../../../constants';
import { useSocketStore } from '../../../../store';
import { ISocketStore } from '../../../../store/store.type';

const EmitterPlayground = ({ tabData = {} }) => {
  const {
    activePlayground,
    playground,
    playgroundTabs,
  } = useSocketStore(
    (s: ISocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      // collection: s.collection,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundTabs: s.runtime.playgroundTabs,
      __meta: s.request.__meta,
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
  const ctx_firecampFunctions = {
    confirmationPopup:  (obj)=> {
    
    }
  }
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
  const [isSaveEmitterPopoverOpen, toggleSaveEmitterPopover] = useState(false);

  const typedArrayList = TypedArrayViews.map((e) => {
    return {
      id: e,
      name: e,
    };
  });

  //arraybuffer
  const [selectedTypedArray, setSelectedTypedArray] = useState(
    typedArrayList[0]
  );

  const quickSelectionMenus = [];

  /**
   * On select argument type noBody
   * check if last argument or not. If last argument then ask confirmation. else set argument type noBody.
   * Confirmation modal:
   *    on click confirm, remove all next arguments and set current argument type as noBody.
   *    on click cancel, do nothing.
   */
  const _onSelectTypeNoBody = async () => {

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
        },
        onCancel: () => {},
      });
    } catch (e) {
      console.log({ e });
    }
  };

  const _onSelectArgType = (type) => {
    if (!type || !type.id || activeArgType.id === type.id) return;
  };

  const _onSelectTypedArray = (ta) => {};

  const _onSelectFile = (e) => {
    const target = e.target;
    const file = target.files[0];
    setEmitterBody(file);
  };

  const _onEmit = (e) => {
  };

  const shortcutFns = {
    onCtrlS: () => {
      // _onSaveMessageFromPlygnd();
    },
    onCtrlEnter: async () => {
      _onEmit();
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
        onChange={(name) => {}}
        onEmit={_onEmit}
      />
      <div className="px-2 pb-2 flex-1 flex flex-col">
        <TabHeader className="height-small !px-0">
          <TabHeader.Left>
            <span className="text-appForeground text-sm block">
              Add Arguments
            </span>
          </TabHeader.Left>
          <TabHeader.Right>
            <Checkbox isChecked={true} label="Ack" />
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
            args={playgroundEmitter.body}
            activeArgIndex={argRef.current}
            onAddTab={() => {}}
            onSelectTab={(index) => {}}
            onRemoveTab={(index) => {}}
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
            updateEmitterBody={(value) =>{}}
            onSelectFile={_onSelectFile}
            shortcutFns={shortcutFns}
          />
        </div>
      </div>
    </Container>
  );
};

export default EmitterPlayground;

const EmitterName = ({
  name = '',
  onChange = (val) => {},
  onEmit = () => {},
}) => {
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
        label="Type Emitter Name"
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
