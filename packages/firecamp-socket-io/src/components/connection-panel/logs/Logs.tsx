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
} from '@firecamp/ui-kit';
import LogTable from './log-table/LogTable';
import Listeners from './listeners/Listeners';
import { useStore, IStore } from '../../../store';
import { ELogTypes } from '../../../types';
import LogPreview from './log-table/LogPreview';

const logTypes = {
  System: ELogTypes.System,
  Send: ELogTypes.Send,
  Receive: ELogTypes.Receive,
};

const Logs = () => {
  const {
    socketId,
    typeFilter,
    logs,
    activePlayground,
    clearLogs,
    changePlaygroundLogFilters,
  } = useStore(
    (s: IStore) => ({
      socketId: s.playgrounds[s.runtime.activePlayground]?.socketId,
      activePlayground: s.runtime.activePlayground,
      typeFilter:
        s.playgrounds?.[s.runtime.activePlayground]?.logFilters?.type || '',
      logs: s.logs?.[s.runtime.activePlayground] || [],
      clearLogs: s.clearLogs,
      changePlaygroundLogFilters: s.changePlaygroundLogFilters,
    }),
    shallow
  );

  const handleFS = useFullScreenHandle();
  const logTableApiRef = useRef({});
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
  }, [logs, typeFilter, activePlayground]);

  const _onClearAllMessages = () => {
    clearLogs(activePlayground);
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
      changePlaygroundLogFilters(activePlayground, { type: filter });
    }
  };

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS}>
        <Row className="with-divider h-full" flex={1}>
          <Column overflow="auto" className="h-full">
            <Container>
              <Container.Header className="with-divider">
                <div className="fc-btn-collapse v2">
                  {/* <VscChevronRight onClick={_setVisiblePanel}/> */}
                </div>
                <TabHeader className="height-small border-b border-appBorder padding-left-extra">
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
                      <span>
                        <Dropdown
                          selected={typeFilter || 'select log type'}
                          className="fc-dropdown-fixwidth"
                        >
                          <Dropdown.Handler
                            id={`websocket-response-log-${activePlayground}-filter-event`}
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
                      </span>

                      {typeFilter ? (
                        <div className="pl-1 w-4">
                          <span
                            className="text-base icv2-remove-icon"
                            onClick={() => _onFilter('')}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex">
                      <VscCircleSlash
                        className="cursor-pointer"
                        title="clear logs"
                        onClick={_onClearAllMessages}
                      />
                    </div>
                  </TabHeader.Right>
                </TabHeader>
                <TabHeader className="height-small">
                  <TabHeader.Left>
                    <div className="fc-tab-panel-info whitespace-pre">
                      {socketId ? (
                        [
                          <label key={`label-${activePlayground}`}>
                            Connection id:
                          </label>,
                          <span key={`socket-id-${activePlayground}`}>
                            {socketId || '-'}
                          </span>,
                          <CopyButton
                            id={activePlayground}
                            key={`copy-socketId-${activePlayground}`}
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
                <LogTable
                  onLoad={(tApi) => {
                    logTableApiRef.current = tApi;
                  }}
                  onFocusRow={(r) => {
                    setSelectedRow(r);
                  }}
                />
                {
                  selectedRow ?
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
                    : <></>
                }

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
