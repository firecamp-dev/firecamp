import {
  Container,
  TabHeader,
  CopyButton,
  Column,
  Row,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import LogTable from './log-table/LogTable';
import Listeners from './listeners/Listeners';

import { ISocketStore, useSocketStore } from '../../../store';

const ResponseBody = ({ eventsList = [] }) => {
  let { socketId, activePlayground, clearAllConnectionLogs } = useSocketStore(
    (s: ISocketStore) => ({
      socketId: s.playgrounds[s.runtime.activePlayground]?.socketId,
      activePlayground: s.runtime.activePlayground,
      clearAllConnectionLogs: s.clearAllConnectionLogs,
    }),
    shallow
  );

  return (
    <Container>
      <Container.Body className="flex">
        <Row className="with-divider" flex={1}>
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
                        onClick={()=>clearAllConnectionLogs(activePlayground)}
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
      </Container.Body>
    </Container>
  );
};

export default ResponseBody;
