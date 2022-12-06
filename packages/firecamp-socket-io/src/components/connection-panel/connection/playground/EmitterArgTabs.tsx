import { useEffect, useState } from 'react';
import { Checkbox, TabHeader, Tabs } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { EEmitterPayloadTypes } from '../../../../types';

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

    <div className="z-20 relative">
      
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
          args[activeArgIndex]?.__meta.type !== EEmitterPayloadTypes.noBody,
        onClick: onAddArg,
      }}
      tabBorderMeta={{
        placementForActive: '',
        right: true,
      }}
      onSelect={onSelectArgTab}
    />
    </div>
  );
};
export default EmitterArgTabs;
