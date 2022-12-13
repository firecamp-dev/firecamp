import { useEffect, useState } from 'react';
import { Tabs } from '@firecamp/ui-kit';
import equal from 'react-fast-compare';
import { EEmitterPayloadTypes } from '../../../../types';

interface IEmitterArgTabs {
  args?: { id: string; name?: 'string' }[];
  activeArgIndex?: string;
  onAddTab?: () => void;
  onRemoveTab?: () => void;
  onSelectTab?: () => void;
}
const EmitterArgTabs = ({
  args = [],
  activeArgIndex = '',
  onAddTab = () => {},
  onRemoveTab = () => {},
  onSelectTab = () => {},
}: IEmitterArgTabs) => {
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
          onClick: onRemoveTab,
        }}
        addTabIconMeta={{
          show:
            tabs &&
            tabs.length < 5 &&
            args[activeArgIndex]?.__meta.type !== EEmitterPayloadTypes.noBody,
          onClick: onAddTab,
        }}
        tabBorderMeta={{
          placementForActive: '',
          right: true,
        }}
        onSelect={onSelectTab}
      />
    </div>
  );
};
export default EmitterArgTabs;
