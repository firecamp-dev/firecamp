import { memo, useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { VscCircleSlash } from '@react-icons/all-files/vsc/VscCircleSlash';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import shallow from 'zustand/shallow';
import {
  Container,
  Column,
  TabHeader,
  Dropdown,
  Button,
  Resizable,
} from '@firecamp/ui-kit';

import LogTable from './LogTable';
import { ELogTypes, EPanel } from '../../../types';
import { IWebsocketStore, useWebsocketStore } from '../../../store';
import LogPreview from './LogPreview';

const logTypes = {
  System: ELogTypes.System,
  Send: ELogTypes.Send,
  Receive: ELogTypes.Receive,
};

const Logs = ({ visiblePanel = '', setVisiblePanel = (_) => {} }) => {
  const {
    activePlayground,
    typeFilter,
    logs,
    changePlaygroundLogFilters,
    clearLogs,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      typeFilter:
        s.playgrounds?.[s.runtime.activePlayground]?.logFilters?.type || '',
      logs: s.logs?.[s.runtime.activePlayground] || [],

      changePlaygroundLogFilters: s.changePlaygroundLogFilters,
      clearLogs: s.clearLogs,
    }),
    shallow
  );

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

  const handleFS = useFullScreenHandle();
  const _setVisiblePanel = (e) => {
    if (e) e.preventDefault;
    if (visiblePanel === EPanel.Response) {
      setVisiblePanel(EPanel.All);
    } else {
      setVisiblePanel(EPanel.Response);
    }
  };

  const _onRowClick = (rtRow) => {
    let originalRowValue = rtRow.original;
    setSelectedRow((ps) => ({
      ...originalRowValue,
      index: rtRow.index,
    }));
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
        <Container>
          <Container.Header>
            <TabHeader className="height-small border-b border-appBorder padding-left-extra">
              <div className="fc-btn-collapse v2">
                <VscChevronRight onClick={_setVisiblePanel} />
              </div>
              <TabHeader.Left>
                <label className="m-0 text-sm font-bold whitespace-pre">
                  Event Logs
                </label>
              </TabHeader.Left>
              <TabHeader.Right>
                <label className="m-0 text-sm font-bold whitespace-pre">
                  Filter:
                </label>
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
                          transparent={true}
                          ghost={true}
                          withCaret={true}
                          tooltip={
                            typeFilter ? `Log type: ${typeFilter || ''}` : ''
                          }
                          sm
                        />
                      </Dropdown.Handler>
                      <Dropdown.Options
                        options={Object.keys(logTypes).map((o) => ({
                          name: o,
                        }))}
                        onSelect={(type) => _onFilter(type?.name)}
                      />
                    </Dropdown>
                  </span>

                  {typeFilter ? (
                    <div className="pl-1 w-4">
                      <span
                        className="text-base  iconv2-remove-icon"
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
          </Container.Header>
          <Container.Body overflow="hidden" className="flex flex-col">
            <LogTable
              onLoad={(tApi) => {
                logTableApiRef.current = tApi;
              }}
            />
            <Resizable
              top={true}
              height="100px"
              width="100%"
              maxHeight={400}
              minHeight={100}
              onResizeStop={_onResizeStop}
              className="bg-focus-3"
            >
              <LogPreview row={selectedRow} />
            </Resizable>
          </Container.Body>
        </Container>
      </FullScreen>
    </Column>
  );
};

export default memo(Logs);
