import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '@firecamp/ui-kit';
import equal from 'react-fast-compare';
import { EEmitterPayloadTypes } from '../../../../types';

interface IEmitterArgTabs {
  totalTabs: number;
  onAddTab?: () => void;
  onRemoveTab?: () => void;
  onSelectTab?: () => void;
}
const EmitterArgTabs = ({
  totalTabs = 0,
  onAddTab = () => {},
  onRemoveTab = () => {},
  onSelectTab = () => {},
}: IEmitterArgTabs) => {
  const [activeArgIndex, setArgIndex] = useState(0);
  useEffect(() => {
    setArgIndex(totalTabs);
  }, [totalTabs]);
  const tabs = useMemo(() => {
    return Array(totalTabs)
      .fill('')
      .map((a, i) => {
        return {
          id: i.toString(),
          name: `Arg ${i + 1}`,
        };
      });
  }, [totalTabs]);

  return (
    <div className="z-20 relative">
      <Tabs
        list={tabs}
        activeTab={activeArgIndex.toString()}
        // tabsClassName="tabs-with-bottom-border-left-section"
        closeTabIconMeta={{
          show: tabs.length > 0,
          onClick: onRemoveTab,
        }}
        addTabIconMeta={{
          show: tabs && tabs.length < 5,
          onClick: onAddTab,
        }}
        tabBorderMeta={{
          placementForActive: '',
          right: true,
        }}
        onSelect={(id, index) => {
          setArgIndex(index);
        }}
      />
    </div>
  );
};
export default EmitterArgTabs;
