import { Column } from '@firecamp/ui-kit';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './home/Home';
import TabContainerBodyRequest from './TabContainerBodyRequest';
import ErrorPopup from '../common/error-boundary/ErrorPopup';
import { ITabStore, useTabStore } from '../../store/tab';

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
    <ErrorBoundary
      FallbackComponent={ErrorPopup}
      // onError={(error, info) => {
      //   console.log({ error, info });
      //   close.byIds([tabObj.id]);
      //   changeActiveTab('home');
      // }}
    >
      <Column flex={1} className="invisible-scrollbar">
        <div className={cx('fc-h-full invisible-scrollbar tab-content')}>
          <div
            className={cx('tab-pane', {
              active: activeTab == 'home',
            })}
          >
            <Home />
          </div>
          {Object.values(tabs).map((t, i) => (
            <div
              className={cx('tab-pane', {
                active: activeTab == t.id,
              })}
              key={t.id}
            >
              <TabContainerBodyRequest
                tab={t}
                index={i}
                key={t.id}
                activeTab={activeTab}
              />
            </div>
          ))}
        </div>
      </Column>
    </ErrorBoundary>
  );
};

export default TabContainerBody;
