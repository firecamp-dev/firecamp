import _compact from 'lodash/compact';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { Container, Input, Button, TabHeader, Checkbox } from '@firecamp/ui';
import { _object } from '@firecamp/utils';
import BodyControls from './playground/BodyControls';
import EmitterArgTabs from './playground/EmitterArgTabs';
import EmitterBody from './playground/EmitterBody';
import { IStore, useStore } from '../../../store';

const EmitterPlayground = () => {
  const {
    playground,
    __manualUpdates,
    changePlgArgType,
    selectPlgArgTab,
    addPlgArgTab,
    removePlgArgTab,
    changePlgArgValue,
    changePlgEmitterName,
    changePlgEmitterAck,
    emit,
  } = useStore(
    (s: IStore) => ({
      playground: s.playgrounds[s.runtime.activePlayground],
      __meta: s.request.__meta,
      __manualUpdates: s.__manualUpdates,
      changePlgArgType: s.changePlgArgType,
      selectPlgArgTab: s.selectPlgArgTab,
      addPlgArgTab: s.addPlgArgTab,
      removePlgArgTab: s.removePlgArgTab,
      changePlgArgValue: s.changePlgArgValue,
      changePlgEmitterName: s.changePlgEmitterName,
      changePlgEmitterAck: s.changePlgEmitterAck,
      emit: s.emit,
    }),
    shallow
  );
  const { emitter: plgEmitter, activeArgIndex = 0 } = playground;

  console.log('this is the payground');

  return (
    <Container>
      <BodyControls
        // emitter={plgEmitter}
        // isSaveEmitterPopoverOpen={true}
        // tabData={{ id: 123 }}
        // activeType={{ id: 'text' }}
        // editorCommands={EditorCommands}
      />
      <Container.Header className="!px-2 !py-2">
        <Input
          value={plgEmitter.name}
          autoFocus={true}
          placeholder="Type emitter name"
          label="Type Emitter Name"
          className="border-0"
          wrapperClassName="!mb-0"
          // ref={}
          onChange={(e) => {
            if (e) e.preventDefault();
            changePlgEmitterName(e.target.value);
          }}
        />
      </Container.Header>
      <div className="px-2 pb-2 flex-1 flex flex-col">
        <TabHeader className="height-small !px-0">
          <TabHeader.Left>
            <span className="text-appForeground text-sm block">
              Add Arguments
            </span>
          </TabHeader.Left>
          <TabHeader.Right>
            <Checkbox
              isChecked={plgEmitter.__meta.ack}
              label="Ack"
              onToggleCheck={(label, val) => changePlgEmitterAck(val)}
            />
            <Button
              text="Send"
              icon={<IoSendSharp size={12} className="ml-1" />}
              onClick={() => emit(plgEmitter)}
              iconRight
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
        <div className="border border-appBorder flex-1 flex flex-col">
          <EmitterArgTabs
            activeArgIndex={activeArgIndex}
            totalTabs={plgEmitter.value?.length}
            selectArgTab={selectPlgArgTab}
            addArgTab={addPlgArgTab}
            removeArgTab={removePlgArgTab}
          />
          <EmitterBody
            activeArgIndex={activeArgIndex}
            autoFocus={!!plgEmitter.name}
            emitter={plgEmitter}
            changeArgType={changePlgArgType}
            changeArgValue={changePlgArgValue}
          />
        </div>
      </div>
    </Container>
  );
};

export default EmitterPlayground;
