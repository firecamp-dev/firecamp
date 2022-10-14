import { Column } from '@firecamp/ui-kit';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { ITabStore, useTabStore } from '../../store/tab';
import Home from './home/Home';
import TabBody from './TabBody';

const TabContainerBody = () => {
  const { tabs, activeTab } = useTabStore(
    (s: ITabStore) => ({
      tabs: s.list,
      orders: s.orders,
      activeTab: s.activeTab,
    }),
    shallow
  );

  return (
    <Column flex={1} className="invisible-scrollbar">
      <div
        className={classnames(
          'fc-container fc-h-full invisible-scrollbar tab-content'
        )}
      >
        <div
          className={classnames('tab-pane', {
            active: activeTab == 'home',
          })}
        >
          <Home />
        </div>
        {Object.values(tabs).map((t, i) => (
          <div
            className={classnames('tab-pane', {
              active: activeTab == t.id,
            })}
            key={t.id}
          >
            <TabBody tabObj={t} index={i} key={t.id} activeTab={activeTab} />
          </div>
        ))}
      </div>
    </Column>
  );
};

export default TabContainerBody;
