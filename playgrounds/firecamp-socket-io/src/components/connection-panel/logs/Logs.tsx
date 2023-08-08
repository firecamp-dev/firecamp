import { useEffect, useRef, useState } from 'react';
import { Ban } from 'lucide-react';
import shallow from 'zustand/shallow';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import {
  Container,
  TabHeader,
  CopyButton,
  Column,
  Row,
  Button,
  Resizable,
  DropdownMenu,
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

  const logTableApiRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(465);
  const [selectedRow, setSelectedRow] = useState();
  const [isDropDownOpen, toggleDropDown] = useState(false);

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
    <Column
      flex={1}
      className="h-full bg-app-background-secondary"
      overflow="auto"
    >
      <Row className="with-divider h-full" flex={1}>
        <Column overflow="auto" className="h-full">
          <Container>
            <Container.Header className="with-divider">
              <TabHeader className="height-small border-b border-app-border">
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
                      <DropdownMenu
                        onOpenChange={(v) => toggleDropDown(v)}
                        handler={() => (
                          <Button
                            text={typeFilter || 'select log type'}
                            title={
                              typeFilter ? `Log type: ${typeFilter || ''}` : ''
                            }
                            rightIcon={
                              <VscTriangleDown
                                size={12}
                                className={cx({
                                  'transform rotate-180': isDropDownOpen,
                                })}
                              />
                            }
                            ghost
                            compact
                            xs
                          />
                        )}
                        options={Object.keys(logTypes)?.map((o) => ({
                          name: o,
                        }))}
                        onSelect={(type) => _onFilter(type?.name)}
                        selected={typeFilter || 'select log type'}
                        classNames={{
                          dropdown: '-mt-2',
                        }}
                        width={144}
                        sm
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex">
                    {logs?.length ? (
                      <Ban
                        size={16}
                        className="cursor-pointer"
                        // title="clear logs"
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
    </Column>
  );
};

export default Logs;
