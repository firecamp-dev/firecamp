import { FC, lazy, Suspense, useMemo, memo } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import { ERequestTypes } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { Loader } from '@firecamp/ui-kit';
import JsonTab from './requests/json/Request';
import MdTab from './requests/markdown/Request';

// import { Rest } from '@firecamp/rest';
// import { GraphQL } from '@firecamp/graphql';
// import { WSClient } from '@firecamp/websocket';
// import { SocketIOClient } from '@firecamp/socket.io';

const Rest = lazy(() =>
  import('@firecamp/rest').then((module) => ({ default: module.Rest }))
);
const GraphQL = lazy(() =>
  import('@firecamp/graphql').then((module) => ({ default: module.GraphQL }))
);
const WSClient = lazy(() =>
  import('@firecamp/websocket').then((module) => ({ default: module.WSClient }))
);
const SocketIOClient = lazy(() =>
  import('@firecamp/socket.io').then((module) => ({
    default: module.SocketIOClient,
  }))
);

import { IRequestTabProps } from './types';
import pltContext from '../../services/platform-context';
import { usePlatformStore } from '../../store/platform';
import EnvironmentTab from '../common/environment/tabs/Environment';

const TabContainerBodyRequest: FC<any> = ({ tab, index, activeTab }) => {
  if (!tab || index === -1) {
    return <span />;
  }
  const { getFirecampAgent } = usePlatformStore.getState();
  // const { changeActiveTab, close } = useTabStore.getState();

  if (
    [
      ERequestTypes.SocketIO,
      ERequestTypes.WebSocket,
      ERequestTypes.Rest,
      ERequestTypes.GraphQL,
    ].includes(tab.type)
  ) {
    tab = Object.assign({}, tab, {});
  }

  const tabProps: IRequestTabProps = useMemo(() => {
    return {
      tab,
      index: index,
      activeTab: activeTab,

      //v3 props
      platformContext: {
        ...pltContext,
        getFirecampAgent,
      },
    };
  }, [activeTab, tab]);

  const _renderRequestTab = (type) => {
    switch (type) {
      case ERequestTypes.Rest:
        return (
          <Suspense fallback={<Loader />}>
            <Rest {...tabProps} />
          </Suspense>
        );
      case ERequestTypes.GraphQL:
        return (
          <Suspense fallback={<Loader />}>
            <GraphQL {...tabProps} />
          </Suspense>
        );
      case ERequestTypes.SocketIO:
        return (
          <Suspense fallback={<Loader />}>
            <SocketIOClient {...tabProps} />
          </Suspense>
        );
      case ERequestTypes.WebSocket:
        return (
          <Suspense fallback={<Loader />}>
            <WSClient {...tabProps} />
          </Suspense>
        );
      case 'json':
        return <JsonTab {...tabProps} />;
      case 'md':
        return <MdTab {...tabProps} />;
      default:
        return <EnvironmentTab {...tabProps} />;
        return <span>Default Request Tab</span>;
    }
  };

  return _renderRequestTab(tab.type);
};

export default memo(TabContainerBodyRequest, (pp, np) => {
  return isEqual(pp, np);
});
