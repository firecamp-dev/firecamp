import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import _compact from 'lodash/compact';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import {
  Container,
  Input,
  Button,
  TabHeader,
  Checkbox,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';

import EmitterArgMeta from './playground/EmitterArgMeta';
import EmitterArgTabs from './playground/EmitterArgTabs';
import Body from './playground/EmitterBody';
import { EEmitterPayloadTypes } from '../../../types';
import {
  InitArg,
  EditorCommands,
  ArgTypes,
  TypedArrayViews,
  InitPlayground,
} from '../../../constants';
import { useSocketStore } from '../../../store';
import { ISocketStore } from '../../../store/store.type';

const EmitterPlayground = () => {
  const { playground, __version, getActivePlayground, addPlaygroundArgTab } =
    useSocketStore(
      (s: ISocketStore) => ({
        playground: s.playgrounds[s.runtime.activePlayground],
        getActivePlayground: s.getActivePlayground,
        addPlaygroundArgTab: s.addPlaygroundArgTab,
        __meta: s.request.__meta,
        // @ts-ignore
        __version: s.__version,
      }),
      shallow
    );
  // const { activePlayground, plgTab } = getActivePlayground();
  const { emitter: plgEmitter } = playground;

  // @bug: on real-time update, can not switch argument except 0
  const [activeArgIndex, setActiveArgIndex] = useState(0);
  const [activeArgType, setActiveArgType] = useState(
    () =>
      ArgTypes.find(
        (t) => t.id === plgEmitter.payload[activeArgIndex].__meta.type
      ) || {
        id: EEmitterPayloadTypes.noBody,
        name: 'No body',
      }
  );

  const _onSelectArgType = (type) => {
    if (!type || !type.id || activeArgType.id === type.id) return;
  };
  const _onSelectTypedArray = (ta) => {};
  const _onEmit = () => {};

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
  console.log(plgEmitter);
  return (
    <Container>
      {/* <BodyControls
        emitterName={plgEmitter.name || ''}
        isSaveEmitterPopoverOpen={isSaveEmitterPopoverOpen}
        tabData={tabData}
        tabId={tabData.id || ''}
        collection={collection}
        activeType={activeArgType}
        toggleSaveEmitterPopover={toggleSaveEmitterPopover}
        playgroundTabMeta={playgroundTab.__meta}
        onAddEmitter={_onAddEmitter}
        onUpdateEmitter={_onUpdateEmitter}
        path={plgEmitter.path || `./`}
        showClearPlaygroundButton={
          !!(emitterBody && emitterBody.length) ||
          !!(
            plgEmitter.name &&
            plgEmitter.name.trim() &&
            plgEmitter.name.trim().length
          )
        }
        addNewEmitter={_addNewEmitter}
        editorCommands={EditorCommands}
      /> */}
      <EmitterName
        name={plgEmitter.name || ''}
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
              text="Send"
              icon={<IoSendSharp size={12} className="ml-1" />}
              xs
              primary
              iconCenter
              iconRight
            />
          </TabHeader.Right>
        </TabHeader>
        <div className="border border-appBorder flex-1 flex flex-col">
          <EmitterArgTabs
            totalTabs={plgEmitter.payload?.length || 0}
            onAddTab={addPlaygroundArgTab}
            onSelectTab={(index) => {}}
            onRemoveTab={(index) => {}}
          />

          <Body
            onSelectArgType={_onSelectArgType}
            activeArgType={activeArgType}
            autoFocus={!!plgEmitter.name}
            tabId={playground.id}
            emitterBody={plgEmitter.payload}
            playgroundBody={plgEmitter.payload[activeArgIndex].payload}
            quickSelectionMenus={[]}
            // setEmitterBody={setEmitterBody}
            updateEmitterBody={(value) => {}}
            onSelectFile={(e) => {
              // setEmitterBody(e.target.files[0]);
            }}
            shortcutFns={shortcutFns}
          />
        </div>
      </div>
    </Container>
  );
};

export default EmitterPlayground;

const EmitterName = ({ name = '', onChange = (val) => {} }) => {
  const _handleInputChange = (e) => {
    if (e) e.preventDefault();
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
      />
    </Container.Header>
  );
};
