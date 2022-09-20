import { Column } from '@firecamp/ui-kit';
import classnames from 'classnames';
import Home from './home/Home';
import TabBody from './TabBody';

const TabContainerBody = ({ tabs = [], activeTab = '', tabFns = {} }) => {
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
        {tabs.map((t, i) => (
          <div
            className={classnames('tab-pane', {
              active: activeTab == t.id,
            })}
            key={t.id}
          >
            <TabBody
              tabObj={t}
              index={i}
              key={t.id}
              tabFns={tabFns}
              activeTab={activeTab}
            />
          </div>
        ))}
      </div>
    </Column>
  );
};

export default TabContainerBody;
