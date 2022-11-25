import { useRef, useState, useEffect, FC } from 'react';
import {
  Container,
  TabHeader,
  Column,
  Dropdown,
  Resizable,
  Button,
  ReactTable,
  // LogTable as LTable,
  Editor,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import classnames from 'classnames';
import { VscCircleSlash } from '@react-icons/all-files/vsc/VscCircleSlash';

import { IWebsocketStore, useWebsocketStore } from '../../../../store';
import { ELogTypes } from '../../../../types';

const logTypes = {
  System: ELogTypes.System,
  Send: ELogTypes.Send,
  Receive: ELogTypes.Receive,
};

const LogTable = () => {
  let {
    activePlayground,
    typeFilter,
    logs,
    changePlaygroundLogFilters,
    clearAllConnectionLogs,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      typeFilter:
        s.playgrounds?.[s.runtime.activePlayground]?.logFilters?.type || '',
      logs: s.connectionsLogs?.[s.runtime.activePlayground] || [],

      changePlaygroundLogFilters: s.changePlaygroundLogFilters,
      clearAllConnectionLogs: s.clearAllConnectionLogs,
    }),
    shallow
  );

  const logTableAPIRef = useRef({});
  // const lLogTableApiRef = useRef({});

  const [tableHeight, setTableHeight] = useState(465);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    const getFilteredLogsByMeta = (logs = [], filter) => {
      let filteredLogs = logs;
      if (filter) {
        filteredLogs = logs.filter((log) => {
          return log?.meta?.type === logTypes[filter];
        });
      }
      return filteredLogs;
    };

    const filteredLogs = getFilteredLogsByMeta(logs, typeFilter);
    // const newLogs = filteredLogs.map((l) => {
    //   const { meta, message, title } = l;
    //   return {
    //     message,
    //     title,
    //     ...meta,
    //   };
    // });
    // lLogTableApiRef.current?.initialize(newLogs);
    logTableAPIRef?.current?.setRows(filteredLogs);
  }, [logs, typeFilter, activePlayground]);

  const _onClearAllMessages = () => {
    clearAllConnectionLogs(activePlayground);
    setSelectedRow(null);
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

  const IconColumn = ({ type = '', id = '' }) => {
    return (
      <span
        id={`ws-io-response-log-${activePlayground}-${id}`}
        className={classnames(
          'td-icon',
          { 'iconv2-to-server-icon': type == ELogTypes.Send },
          { 'iconv2-from-server-icon': type == ELogTypes.Receive },
          { 'icon-disk': type == ELogTypes.System }
        )}
        data-tip={type !== ELogTypes.System ? id || '' : ''}
      ></span>
    );
  };

  const columns = [
    {
      id: 'iconcolumn',
      Header: 'Type',
      accessor: 'meta.type',
      Cell: (values) => {
        let cellValue = values?.row?.original?.meta || {};
        return <IconColumn {...cellValue} />;
      },
      minWidth: 35,
      width: 44,
      maxWidth: 60,
    },
    {
      id: 'eventname',
      Header: 'Event',
      accessor: 'meta.event',
      disableResizing: true,
      minWidth: 100,
      width: 140,
      maxWidth: 140,
    },
    {
      Header: 'Message',
      accessor: 'message',
      Cell: ({ value, cell, ...rest }) => {
        let row = cell.row.original;
        if (row.meta.type == ELogTypes.System) {
          return <span dangerouslySetInnerHTML={{ __html: row.title }} />;
        } else {
          return (
            <>
              {value?.meta?.type !== 'file'
                ? value?.body || ''
                : value?.name || 'Sending File'}
            </>
          );
        }
      },

      // width: 356
    },
    {
      id: 'length',
      Header: 'Length',
      accessor: 'meta.length',
      minWidth: 35,
      width: 35,
      maxWidth: 100,
    },
    {
      id: 'timecolumn',
      Header: 'Time',
      accessor: 'meta.timestamp',
      Cell: TimeColumn,
      minWidth: 35,
      width: 35,
      maxWidth: 35,
    },
  ];

  /**
   * On Filter connection log, update dropdown value and store for connection
   */
  const _onFilter = (filter = '') => {
    if (typeFilter !== filter) {
      changePlaygroundLogFilters(activePlayground, { type: filter });
    }
  };

  return (
    <Container>
      <Container.Header>
        <TabHeader className="height-small border-b border-appBorder padding-left-extra">
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
                    options={Object.keys(logTypes)?.map((o) => ({ name: o }))}
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
      <Container.Body overflow="hidden">
        <Resizable
          bottom={true}
          height="100%"
          width="100%"
          maxHeight={500}
          minHeight={100}
          onResizeStop={_onResizeStop}
          className="bg-focus-3"
        >
          <Column flex={1} overflow="hidden">
            {/* <LTable
                rows={[]}
                onChange={(rows) => {
                  console.log(rows, 'log table change');
                }}
                onMount={(tApi) => {
                  lLogTableApiRef.current = tApi;
                  console.log(tApi);
                }}
              /> */}
            <div className="h-full overflow-auto">
              <div role="table" className="fc-table-2 h-full !table">
                <div className="table-header-group">
                  <div role="row" className="tr table-row	">
                    <div role="columnheader" className="th table-cell">
                      Type{' '}
                    </div>
                    <div role="columnheader" className="th table-cell">
                      Event
                    </div>
                    <div role="columnheader" className="th table-cell">
                      Message
                    </div>
                    <div role="columnheader" className="th table-cell">
                      Length
                    </div>
                    <div role="columnheader" className="th table-cell">
                      Time
                    </div>
                  </div>
                </div>
                <div className="table-row-group" role="rowgroup">
                  <div role="row" className="tr success open table-row">
                    <div role="cell" className="td success table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-SYS-2"
                        className="td-icon icon-disk"
                        data-tip=""
                      ></span>
                    </div>
                    <div role="cell" className="td success table-cell">
                      open
                    </div>
                    <div role="cell" className="td success table-cell">
                      <span>
                        The connection is open and ready to communicate.
                      </span>
                    </div>
                    <div role="cell" className="td success table-cell">
                      -
                    </div>
                    <div role="cell" className="td success table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                  <div
                    role="row"
                    className="tr Message Received table-row"
                    
                    id="1"
                    tabIndex={0}
                  >
                    <div role="cell" className="td table-cell">
                      <span
                        id="ws-io-response-log-41j5hnR5NkcV0IfATrA7s-R-1"
                        className="td-icon iconv2-from-server-icon table-cell"
                        data-tip="R-1"
                      ></span>
                    </div>
                    <div role="cell" className="td table-cell">
                      Message Received
                    </div>
                    <div role="cell" className="td table-cell">
                      Send new message: 889
                    </div>
                    <div role="cell" className="td table-cell">
                      21
                    </div>
                    <div role="cell" className="td table-cell">
                      12:31:11
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ReactTable
              key={activePlayground}
              virtualListHeight={tableHeight} //  40 is an estimated height of table header
              columns={columns}
              onLoad={(tableAPI) => {
                logTableAPIRef.current = tableAPI;
              }}
              onRowClick={_onRowClick}
            />
          </Column>
        </Resizable>

        <LogPreview activePlayground={activePlayground} row={selectedRow} />
      </Container.Body>
    </Container>
  );
};

export default LogTable;

const TimeColumn = ({ value, cell, ...rest }) => {
  // console.log(rest, 9888)
  return <>{new Date(value).toLocaleTimeString()}</>;
};

const LogPreview: FC<any> = ({ activePlayground = '', row = {} }) => {
  const value =
    row?.message?.meta?.type !== 'file'
      ? row?.message?.payload || row?.title || ''
      : row?.message?.name || 'Sending File';

  const language = row?.message?.meta?.type === 'json' ? 'json' : 'text';

  return (
    <Column
      flex={1}
      minHeight={100}
      height="100%"
      className="bg-appBackground2"
    >
      <Container className="bg-focus2">
        <Container.Header className="bg-focus2">
          <TabHeader
            className={classnames(
              row.meta ? row.meta.color || '' : '',
              'height-ex-small'
            )}
          >
            <TabHeader.Left className="font-bold font-regular">
              {row && row.meta
                ? [
                    <span
                      key={'event-icon'}
                      className={classnames(
                        'td-icon',
                        {
                          'iconv2-to-server-icon':
                            row.meta.type == ELogTypes.Send,
                        },
                        {
                          'iconv2-from-server-icon':
                            row.meta.type == ELogTypes.Receive,
                        },
                        { 'icon-disk': row.meta.type == ELogTypes.System }
                      )}
                    ></span>,
                    <span className="font-sm" key="event-name">
                      {row.meta.event}
                    </span>,
                    row.meta.type !== ELogTypes.System ? (
                      <div
                        className="font-xs  text-appForegroundInActive "
                        key={'event-id'}
                      >
                        {row.meta.id || ''}
                      </div>
                    ) : (
                      <></>
                    ),
                  ]
                : <></>}
            </TabHeader.Left>
            <TabHeader.Right className="font-bold font-regular">
              {row?.meta?.timestamp &&
                new Date(row?.meta?.timestamp).toLocaleTimeString()}
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body>
          <Editor
            language={language}
            value={'' + value}
            disabled={true}
            // controlsConfig={{ show: true, position: 'horizontal' }}
          />
        </Container.Body>
      </Container>
    </Column>
  );
};
