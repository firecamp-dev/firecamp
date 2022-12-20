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

import EmitterArgTabs from './playground/EmitterArgTabs';
import EmitterBody from './playground/EmitterBody';

import { useSocketStore } from '../../../store';
import { ISocketStore } from '../../../store/store.type';

const EmitterPlayground = () => {
  const { playground, __version } = useSocketStore(
    (s: ISocketStore) => ({
      playground: s.playgrounds[s.runtime.activePlayground],
      __meta: s.request.__meta,
      // @ts-ignore
      __version: s.__version,
    }),
    shallow
  );
  const { emitter: plgEmitter, activeArgIndex = 0 } = playground;

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
      <EmitterName name={plgEmitter.name || ''} onChange={(name) => {}} />
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
              primary
              iconCenter
              iconRight
              xs
            />
          </TabHeader.Right>
        </TabHeader>
        <div className="border border-appBorder flex-1 flex flex-col">
          <EmitterArgTabs totalTabs={plgEmitter.payload?.length || 0} />
          <EmitterBody
            activeArgIndex={activeArgIndex}
            autoFocus={!!plgEmitter.name}
            emitter={plgEmitter}
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
