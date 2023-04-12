import { useEffect, useRef, useState } from 'react';
// import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscCircleSlash } from '@react-icons/all-files/vsc/VscCircleSlash';
import shallow from 'zustand/shallow';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import {
  Container,
  TabHeader,
  CopyButton,
  Column,
  Row,
  Dropdown,
  Button,
  Resizable,
} from '@firecamp/ui';
import LogTable from './log-table/LogTable';
import LogPreview from './log-table/LogPreview';
import { useStore, IStore } from '../../../store';
import { ELogTypes } from '../../../types';

const logTypes = {
  System: ELogTypes.System,
  Send: ELogTypes.Send,
  Receive: ELogTypes.Receive,
};

const Logs = () => {
  const {
    tabId,
    socketId,
    typeFilter,
    logs,
    clearLogs,
    changePlaygroundLogFilters,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      socketId: s.playground.socketId,
      typeFilter: s.playground.logFilters?.type || '',
      logs: s.logs || [],
      clearLogs: s.clearLogs,
      changePlaygroundLogFilters: s.changePlaygroundLogFilters,
    }),
    shallow
  );

  const handleFS = useFullScreenHandle();
  const logTableApiRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(465);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    const getFilteredLogsByMeta = (logs = [], filter) => {
      let filteredLogs = logs;
      if (filter) {
        filteredLogs = logs.filter((log) => {
          return log.__meta?.type === logTypes[filter];
        });
      }
      return filteredLogs;
    };

    const filteredLogs = getFilteredLogsByMeta(logs, typeFilter);
    // const newLogs = filteredLogs.map((l) => {
    //   const { __meta, message, title } = l;
    //   return {
    //     message,
    //     title,
    //     ...__meta,
    //   };
    // });
    logTableApiRef.current?.initialize(filteredLogs);
  }, [logs, typeFilter]);

  const _onClearAllMessages = () => {
    clearLogs();
    setSelectedRow(null);
  };

  const _onResizeStop = (e, a, b, delta) => {
    console.log(e, 'event', delta);
    setTableHeight((ps) => ps + delta.height);
  };

  /**
   * On Filter connection log, update dropdown value and store for connection
   */
  const _onFilter = (filter = '') => {
    if (typeFilter !== filter) {
      changePlaygroundLogFilters({ type: filter });
    }
  };

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS}>
        <Row className="with-divider h-full" flex={1}>
          <Column overflow="auto" className="h-full">
            <Container>
              <Container.Header className="with-divider">
                <TabHeader className="height-small border-b border-appBorder">
                  <TabHeader.Left>
                    <label className="m-0 text-sm font-bold whitespace-pre">
                      Event Logs
                    </label>
                  </TabHeader.Left>
                  <TabHeader.Right>
                    {/* <label className="m-0 text-sm font-bold whitespace-pre">
                      Filter:
                    </label> */}
                    <div className="flex items-center">
                      {/* <label className="m-0 text-base font-bold">Type</label> */}
                      {logs?.length ? (
                        <Dropdown
                          selected={typeFilter || 'select log type'}
                          className="fc-dropdown-fixwidth"
                        >
                          <Dropdown.Handler
                            id={`websocket-response-log-${tabId}-filter-event`}
                          >
                            <Button
                              text={typeFilter || 'select log type'}
                              tooltip={
                                typeFilter
                                  ? `Log type: ${typeFilter || ''}`
                                  : ''
                              }
                              transparent
                              withCaret
                              ghost
                              sm
                            />
                          </Dropdown.Handler>
                          <Dropdown.Options
                            options={Object.keys(logTypes)?.map((o) => ({
                              name: o,
                            }))}
                            onSelect={(type) => _onFilter(type?.name)}
                          />
                        </Dropdown>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex">
                      {logs?.length ? (
                        <VscCircleSlash
                          className="cursor-pointer"
                          title="clear logs"
                          onClick={_onClearAllMessages}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </TabHeader.Right>
                </TabHeader>
                <TabHeader className="height-small">
                  <TabHeader.Left>
                    <div className="fc-tab-panel-info whitespace-pre">
                      {socketId ? (
                        [
                          <label key={`label-${tabId}`}>Connection id:</label>,
                          <span key={`socket-id-${tabId}`}>
                            {socketId || '-'}
                          </span>,
                          <CopyButton
                            id={tabId}
                            key={`copy-socketId-${tabId}`}
                            text={socketId || ''}
                          />,
                        ]
                      ) : (
                        <></>
                      )}
                    </div>
                  </TabHeader.Left>
                  <TabHeader.Right></TabHeader.Right>
                </TabHeader>
              </Container.Header>
              <Container.Body overflow="hidden" className="flex flex-col">
                {logs?.length ? (
                  <LogTable
                    onLoad={(tApi) => {
                      logTableApiRef.current = tApi;
                    }}
                    onFocusRow={(r) => {
                      setSelectedRow(r);
                    }}
                  />
                ) : (
                  <></>
                )}

                {selectedRow ? (
                  <Resizable
                    top={true}
                    height="250px"
                    width="100%"
                    maxHeight={400}
                    minHeight={50}
                    onResizeStop={_onResizeStop}
                    className="bg-focus-3"
                  >
                    <LogPreview row={selectedRow} />
                  </Resizable>
                ) : (
                  <></>
                )}
              </Container.Body>
            </Container>
          </Column>
        </Row>
      </FullScreen>
    </Column>
  );
};

export default Logs;
