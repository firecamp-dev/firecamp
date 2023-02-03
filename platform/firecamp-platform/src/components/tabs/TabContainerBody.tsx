import { memo } from 'react';
import { Column } from '@firecamp/ui-kit';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './home/Home';
import TabContainerBodyRequest from './TabContainerBodyRequest';
import ErrorPopup from '../common/error-boundary/ErrorPopup';
import { ITabStore, useTabStore } from '../../store/tab';

const TabContainerBody = () => {
  const activeTab = useTabStore((s: ITabStore) => s.activeTab, shallow);
  const { list: tabs, orders } = useTabStore.getState();

  return (
    <Column flex={1} className="invisible-scrollbar">
      <div className={cx('fc-h-full invisible-scrollbar tab-content')}>
        <div
          className={cx('tab-pane', {
            active: activeTab == 'home',
          })}
        >
          <Home />
        </div>
        {orders.map((tabId, i) => (
          <div
            className={cx('tab-pane', {
              active: activeTab == tabId,
            })}
            key={tabId}
          >
            <ErrorBoundary
              FallbackComponent={ErrorPopup}
              // onError={(error, info) => {
              //   console.log({ error, info });
              //   close.byIds([tabObj.id]);
              //   changeActiveTab('home');
              // }}
            >
              <TabContainerBodyRequest tab={tabs[tabId]} key={tabId} />
            </ErrorBoundary>
          </div>
        ))}
      </div>
    </Column>
  );
};

export default memo(TabContainerBody);
