import { FC, lazy, Suspense, useMemo } from 'react';
import { ERequestTypes } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { ErrorBoundary } from 'react-error-boundary';
import _cloneDeep from 'lodash/cloneDeep';
import {Loader} from '@firecamp/ui-kit';

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
// const WSClient = lazy(() =>
//   import('@firecamp/websocket').then((module) => ({ default: module.WSClient }))
// );
// const SocketIOClient = lazy(() =>
//   import('@firecamp/socket.io').then((module) => ({
//     default: module.SocketIOClient,
//   }))
// );

import EnvironmentWidget from '../common/environment/environment-widget/EnvironmentWidget';
import ErrorPopup from '../common/error-boundary/ErrorPopup';
// import SavePopover from '../common/save/SavePopover';
import { ITabProps } from './types';

import * as platformContext from '../../services/platform-context';

import { IPlatformStore, usePlatformStore } from '../../store/platform';
import AppService from '../../services/app';

const TabBody = ({ tabObj, index, tabFns, activeTab }) => {
  if (!tabObj || index === -1) {
    return <span />;
  }

  const { getFirecampAgent } = usePlatformStore.getState();

  if (
    [
      ERequestTypes.SocketIO,
      ERequestTypes.WebSocket,
      ERequestTypes.Rest,
      ERequestTypes.GraphQL,
    ].includes(tabObj.type)
  ) {
    tabObj = Object.assign({}, tabObj, {
      // ssl_manager: sslList,
      // proxy_manager: proxyList,
    });
  }

  const tabProps: ITabProps = useMemo(() => {
    return {
      index: index,
      tab: tabObj,
      activeTab: activeTab,

      //v3 props
      platformComponents: { EnvironmentWidget },
      platformContext: {
        request: platformContext.request,
        environment: platformContext.environment,
        appService: AppService,
        getFirecampAgent,
      },
    };
  }, [activeTab, tabObj]);

  const _renderRequestTab = (type) => {
    switch (type) {
      case ERequestTypes.Rest:
        return (
          <Suspense fallback={<Loader />}>
            <Rest {...tabProps} />
          </Suspense>
        );
        break;
      case ERequestTypes.GraphQL:
        return (
          <Suspense fallback={<div className="flex w-16 items-center text-appForegroundInActive loader">Loading<span className="wave-loader overflow-hidden">...</span></div>}>
            <GraphQL {...tabProps} />
          </Suspense>
        );
        break;
      // case ERequestTypes.SocketIO:
      //   return (
      //     <Suspense fallback={<div>Loading... </div>}>
      //       {/* <SocketIOClient {...tabProps} /> */}
      //     </Suspense>
      //   );
      //   break;
      // case ERequestTypes.WebSocket:
      //   return (
      //     <Suspense fallback={<div>Loading... </div>}>
      //       {/* <WSClient {...tabProps} /> */}
      //     </Suspense>
      //   );
      //   break;
      default:
        return <span>Default Request Tab</span>;
    }
  };

  // return _renderRequestTab(tabObj.type);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorPopup}
      onError={(error) => {
        console.log({ error });
        tabFns.close(error, tabObj.id);
        tabFns.setActive('home');
      }}
    >
      {_renderRequestTab(tabObj.type)}
    </ErrorBoundary>
  );
};

export default TabBody;
