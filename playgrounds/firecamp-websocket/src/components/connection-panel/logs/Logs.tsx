import { memo, useEffect, useRef, useState } from 'react';
import { VscCircleSlash } from '@react-icons/all-files/vsc/VscCircleSlash';
import shallow from 'zustand/shallow';
import {
  Container,
  Column,
  TabHeader,
  Button,
  Resizable,
  DropdownMenu,
} from '@firecamp/ui';
import LogTable from './LogTable';
import LogPreview from './LogPreview';
import { ELogTypes } from '../../../types';
import { IStore, useStore } from '../../../store';

const logTypes = {
  System: ELogTypes.System,
  Send: ELogTypes.Send,
  Receive: ELogTypes.Receive,
};

const Logs = () => {
  const { tabId, typeFilter, logs, changePlaygroundLogFilters, clearLogs } =
    useStore(
      (s: IStore) => ({
        tabId: s.runtime.tabId,
        typeFilter: s.playground.logFilters?.type || '',
        logs: s.logs || [],
        changePlaygroundLogFilters: s.changePlaygroundLogFilters,
        clearLogs: s.clearLogs,
      }),
      shallow
    );

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
    // console.log(filteredLogs, 'filteredLogs');
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
   * on Filter connection log, update dropdown value and store for connection
   */
  const _onFilter = (filter = '') => {
    if (typeFilter !== filter) {
      changePlaygroundLogFilters({ type: filter });
    }
  };

  // console.log('selectedRow', selectedRow);
  return (
    <Column
      flex={1}
      className="h-full bg-app-background-secondary"
      overflow="auto"
    >
      <Container>
        <Container.Header>
          <TabHeader className="height-small border-b border-app-border">
            <TabHeader.Left>
              <label className="m-0 text-sm font-bold whitespace-pre">
                Event Logs
              </label>
            </TabHeader.Left>
            <TabHeader.Right>
              {logs?.length ? (
                <>
                  <label className="m-0 text-sm font-bold whitespace-pre">
                    Filter:
                  </label>
                  <div className="flex items-center">
                    <DropdownMenu
                      handleRenderer={() => (
                        <Button
                          text={typeFilter || 'select log type'}
                          tooltip={
                            typeFilter ? `Log type: ${typeFilter || ''}` : ''
                          }
                          transparent
                          withCaret
                          ghost
                          sm
                        />
                      )}
                      options={Object.keys(logTypes).map((o) => ({
                        name: o,
                      }))}
                      onSelect={(type) => _onFilter(type?.name)}
                      selected={typeFilter || 'select log type'}
                      classNames={{
                        dropdown: 'border-focusBorder -mt-2',
                      }}
                      width={144}
                      sm
                    />
                  </div>
                </>
              ) : (
                <></>
              )}

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
        </Container.Header>

        {logs?.length ? (
          <Container.Body overflow="hidden" className="flex flex-col">
            <LogTable
              onLoad={(tApi) => {
                logTableApiRef.current = tApi;
              }}
              onFocusRow={(r) => {
                setSelectedRow(r);
              }}
            />
            <Resizable
              top={true}
              height="250px"
              width="100%"
              maxHeight={400}
              minHeight={100}
              onResizeStop={_onResizeStop}
              className="bg-focus-3"
            >
              <LogPreview row={selectedRow} />
            </Resizable>
          </Container.Body>
        ) : (
          <></>
        )}
      </Container>
    </Column>
  );
};

export default memo(Logs);
