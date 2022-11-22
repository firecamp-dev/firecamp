import { useEffect, useState } from 'react';
import { Checkbox, Tabs } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { EEmitterPayloadTypes } from '../../../../../../types';

const EmitterArgTabs = ({
  ack = false,
  args = [],
  activeArgIndex = '',
  onAddArg = () => {},
  onRemoveArg = () => {},
  toggleAck = (ack) => {},
  onSelectArgTab = () => {},
}) => {
  const [tabs, setTabs] = useState(
    args.map((arg, index) => {
      return {
        id: index.toString(),
        name: `Arg ${index + 1}`,
      };
    })
  );

  useEffect(() => {
    const newTabs = args.map((arg, index) => {
      return {
        id: index.toString(),
        name: `Arg ${index + 1}`,
      };
    });

    if (!equal(tabs, newTabs)) {
      setTabs(newTabs);
    }
  }, [args]);

  console.log(tabs, 'tabs....');
  return (
    <Tabs
      list={tabs || []}
      activeTab={activeArgIndex}
      // tabsClassName="tabs-with-bottom-border-left-section"
      closeTabIconMeta={{
        show: tabs.length > 0,
        onClick: onRemoveArg,
      }}
      addTabIconMeta={{
        show:
          tabs &&
          tabs.length < 5 &&
          args[activeArgIndex]?.meta?.type !== EEmitterPayloadTypes.noBody,
        onClick: onAddArg,
      }}
      tabBorderMeta={{
        placementForActive: '',
        right: true,
      }}
      onSelect={onSelectArgTab}
      postComp={(_) => (
        <Checkbox
          isChecked={ack}
          label="Ack"
          onToggleCheck={(_) => toggleAck(!ack)}
        />
      )}
    />
  );
};
export default EmitterArgTabs;
