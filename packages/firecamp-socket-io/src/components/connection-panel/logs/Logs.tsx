import {
  Container,
  TabHeader,
  CopyButton,
  Column,
  Row,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import LogTable from './log-table/LogTable';
import Listeners from './listeners/Listeners';
import { useSocketStore } from '../../../store';
import { ISocketStore } from '../../../store/store.type';

const Logs = ({
  visiblePanel = '',
  setVisiblePanel = (type) => {},
  eventsList = [],
}) => {
  const { socketId, activePlayground, clearLogs } = useSocketStore(
    (s: ISocketStore) => ({
      socketId: s.playgrounds[s.runtime.activePlayground]?.socketId,
      activePlayground: s.runtime.activePlayground,
      clearLogs: s.clearLogs,
    }),
    shallow
  );
  const handleFS = useFullScreenHandle();
  // const _setVisiblePanel = (e) => {
  //   if (e) e.preventDefault;
  //   if (visiblePanel === EPanel.Response) {
  //     setVisiblePanel(EPanel.All);
  //   } else {
  //     setVisiblePanel(EPanel.Response);
  //   }
  // };

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS} className="h-full">
        <Row className="with-divider h-full" flex={1}>
          <Column overflow="auto" className="h-full">
            <Container>
              <Container.Header className="with-divider">
                <TabHeader className="height-small ">
                  <TabHeader.Left>
                    <div className="fc-tab-panel-info whitespace-pre">
                      {socketId ? (
                        [
                          <label key={`res-body-label-${activePlayground}`}>
                            Connection id:
                          </label>,
                          <span key={`res-body-socket-id-${activePlayground}`}>
                            {socketId || '-'}
                          </span>,
                          !!socketId ? (
                            <CopyButton
                              id={activePlayground}
                              key={`copy-socketID-${activePlayground}`}
                              text={socketId || ''}
                            />
                          ) : (
                            <></>
                          ),
                        ]
                      ) : (
                        <></>
                      )}
                    </div>
                  </TabHeader.Left>
                  <TabHeader.Right>
                    <div className="flex">
                      <span
                        id={`socket-io-clear-response-log-${activePlayground}`}
                        className="iconv2-clear-icon"
                        onClick={() => clearLogs(activePlayground)}
                        data-tip={'Clear all logs'}
                      />
                    </div>
                  </TabHeader.Right>
                </TabHeader>
              </Container.Header>
              <Container.Body>
                <LogTable
                  selectedConnection={activePlayground}
                  onLoad={(logTable) => {}}
                  eventsList={eventsList}
                />
              </Container.Body>
            </Container>
          </Column>
          <Listeners />
        </Row>
      </FullScreen>
    </Column>
  );
};

export default Logs;
