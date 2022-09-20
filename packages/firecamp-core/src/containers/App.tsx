// CSS start- Follow the css orders here...
import 'awesome-notifications/dist/index.var';
import 'awesome-notifications/dist/style.css';
// CSS end

// Todo: put it on above css order after reviewing the @firecamp/ui css implementation
import '../sass/_index.sass';

import { FC, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import shallow from 'zustand/shallow';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Row, RootContainer } from '@firecamp/ui-kit';
import MonacoFirecampLangInit from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

import Crisp from '../components/common/Crisp';
import Analytics from '../components/common/Analytics';

import SidebarContainer from '../components/containers/SidebarContainer';
import TabsContainer from '../components/containers/TabsContainer';
import StatusBarContainer from '../components/status-bar/StatusBarContainer';
import { ModalContainer } from '../components/modals-v3/ModalContainer';
import { EnvSidebar } from '../components/sidebar';
import ErrorPopup from '../components/common/error-boundary/ErrorPopup';

import { IEnvironmentStore, useEnvStore } from '../store/environment';
import useMonacoWorkers from '../components/hooks/useMonacoWorkers';
import AppService from '../services/app';

// Initialise Firecamp languages settings
MonacoFirecampLangInit();

const App: FC<any> = () => {
  let { is_env_sidebar_open } = useEnvStore(
    (s: IEnvironmentStore) => ({
      is_env_sidebar_open: s.is_env_sidebar_open,
    }),
    shallow
  );

  useMonacoWorkers();

  useEffect(() => {
    const init = async () => {
      setTimeout(async () => {
        await AppService.initApp();
        // await initApp();
      }, 100);
    };

    init();

    return () => {
      if (_misc.firecampAgent() === EFirecampAgent.desktop)
        //@ts-ignore
        window.fc.dialog.openErrorDialog();
      else alert('I am unmounting');
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={() => {
        return <ErrorPopup />;
      }}
      onError={(error) => {
        console.log({ error });
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <RootContainer
          flex={1}
          overflow="auto"
          className="h-screen w-screen bg-appBackground text-appForeground"
        >
          <Row flex={1}>
            <SidebarContainer />
            <TabsContainer />
          </Row>

          <ModalContainer />
          {is_env_sidebar_open && <EnvSidebar />}
          <StatusBarContainer className="border-t focus-outer2" />
        </RootContainer>
      </DndProvider>

      <Crisp />
      <Analytics />
    </ErrorBoundary>
  );
};

export default App;
