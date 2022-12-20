import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '@firecamp/ui-kit';
import { useSocketStore } from '../../../../store';
import { ISocketStore } from '../../../../store/store.type';

interface IEmitterArgTabs {
  totalTabs: number;
  onAddTab?: () => void;
  onSelectTab?: () => void;
}
const EmitterArgTabs = ({
  totalTabs = 0,
  onSelectTab = () => {},
}: IEmitterArgTabs) => {
  const { addPlgArgTab, removePlgArgTab } = useSocketStore(
    (s: ISocketStore) => ({
      addPlgArgTab: s.addPlgArgTab,
      removePlgArgTab: s.removePlgArgTab,
    })
  );
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
        closeTabIconMeta={{
          show: tabs.length > 0,
          onClick: removePlgArgTab,
        }}
        addTabIconMeta={{
          show: tabs && tabs.length < 5,
          onClick: addPlgArgTab,
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
