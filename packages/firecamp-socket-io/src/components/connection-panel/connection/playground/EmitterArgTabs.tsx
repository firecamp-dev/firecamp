import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '@firecamp/ui-kit';

interface IEmitterArgTabs {
  totalTabs: number;
  activeArgIndex: number;
  selectArgTab: Function;
  addArgTab: Function;
  removeArgTab;
}
const EmitterArgTabs = ({
  totalTabs = 0,
  activeArgIndex,
  selectArgTab,
  addArgTab,
  removeArgTab,
}: IEmitterArgTabs) => {
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
        closeTabIconMeta={{
          show: tabs.length > 0,
          onClick: removeArgTab,
        }}
        addTabIconMeta={{
          show: tabs && tabs.length < 5,
          onClick: addArgTab,
        }}
        tabBorderMeta={{
          placementForActive: '',
          right: true,
        }}
        onSelect={(id, index) => {
          selectArgTab(index);
        }}
      />
    </div>
  );
};
export default EmitterArgTabs;
