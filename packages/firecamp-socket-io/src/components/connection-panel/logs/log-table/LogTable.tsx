import { useRef, useState, useEffect } from 'react';
import './LogPreview.sass';
import classnames from 'classnames';
import {
  Container,
  TabHeader,
  Column,
  Row,
  Dropdown,
  Resizable,
  Button,
  ReactTable,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { _object } from '@firecamp/utils';

import LogPreview from './LogPreview';
import AckIcon from './AckIcon';
import { useSocketStore } from '../../../../store';

import { ELogTypes } from '../../../../types';

const logTypes = {
  system: ELogTypes.System,
  send: ELogTypes.Send,
  receive: ELogTypes.Receive,
  ack: ELogTypes.Ack,
};

const LogTable = ({
  selectedConnection = '',
  align = 'center',
  eventsList = [],
}) => {
  let logTableAPIRef = useRef();

  let {
    activePlayground,
    logFilters,
    connectionLogs,

    changePlaygroundLogFilters,
  } = useSocketStore(
    (s) => ({
      activePlayground: s.runtime.activePlayground,
      logFilters: s.playgrounds?.[s.runtime.activePlayground]?.logFilters || '',
      connectionLogs: s.connectionsLogs?.[s.runtime.activePlayground] || [],

      changePlaygroundLogFilters: s.changePlaygroundLogFilters,
    }),
    shallow
  );

  let [tableHeight, setTableHeight] = useState(465);
  let [selectedRow, setSelectedRow] = useState({});

  /**
   * Reflect filter updates by eventsList provided as props.
   * Set event filter as empty (reset filter) if selected event is been removed from the list.
   */
  useEffect(() => {
    if (!eventsList?.includes(logFilters?.event)) {
      _onFilter('event', '');
    }
  }, [eventsList]);

  /**
   * Set selected row as empty if no logs.
   */
  useEffect(() => {
    if (!connectionLogs.length && _object.size(selectedRow) !== 0) {
      setSelectedRow({});
    }
  }, [connectionLogs]);

  /**
   * Filter logs by event type and name.
   * Set and Render filtered rows only.
   */
  useEffect(() => {
    /**
     * Filter connection logs
     */
    const getFilteredLogsByMeta = (
      logs = [],
      logFilters = {
        type: '',
        event: '',
      }
    ) => {
      let filteredLogs = logs;

      for (let filterKey in logFilters) {
        if (logFilters[filterKey]) {
          // filter accessor .__meta
          filteredLogs = filteredLogs.filter((log) => {
            if (filterKey === 'type') {
              return (
                log?.__meta.[filterKey] === logTypes[logFilters?.[filterKey]]
              );
            } else {
              return log?.__meta.[filterKey] === logFilters?.[filterKey];
            }
          });
        }
      }

      return filteredLogs;
    };

    let filteredLogs = getFilteredLogsByMeta(connectionLogs, logFilters);

    logTableAPIRef?.current?.setRows(filteredLogs);
  }, [connectionLogs, logFilters, selectedConnection]);

  let _onRowClick = (rtRow) => {
    let originalRowValue = rtRow.original;

    setSelectedRow((ps) => ({
      ...originalRowValue,
      index: rtRow.index,
    }));
  };

  let _onResizeStop = (e, a, b, delta) => {
    setTableHeight((ps) => ps + delta.height);
  };

  const IconColumn = ({ type = '', id = '' }) => {
    return type !== ELogTypes.Ack ? (
      <span
        id={`socket-io-response-log-${selectedConnection}-${id}`}
        data-tip={type !== ELogTypes.System ? id || '' : ''}
        className={classnames(
          { 'iconv2-to-server-icon': type == ELogTypes.Send },
          { 'iconv2-from-server-icon': type == ELogTypes.Receive },
          { 'icon-disk': type == ELogTypes.System }
        )}
      ></span>
    ) : (
      <AckIcon selectedConnection={selectedConnection} toolTip={id} />
    );
  };

  const TimeColumn = ({ value, cell, ...rest }) => {
    return <>{new Date(value).toLocaleTimeString()}</>;
  };

  const renderMessageCellValue = (value, cell) => {
    let row = cell.row.original;

    if (row.__meta.type == ELogTypes.System) {
      return <span dangerouslySetInnerHTML={{ __html: row.title }} />;
    } else {
      return (
        <>
          {value?.__meta.type !== 'file'
            ? '' + value?.payload
            : value?.name || ''}
        </>
      );
    }
  };

  let columns = [
    {
      id: 'iconcolumn',
      Header: 'Type',
      accessor: '__meta.type',
      Cell: (values) => {
        let cellValue = values?.row?.original?.__meta || {};
        return <IconColumn {...cellValue} />;
      },
      minWidth: 35,
      width: 44,
      maxWidth: 44,
    },
    {
      id: 'eventname',
      Header: 'Event',
      accessor: '__meta.event',
      minWidth: 100,
      width: 140,
      maxWidth: 140,
    },
    {
      Header: 'Message',
      accessor: 'message',
      Cell: ({ value, cell, ...rest }) => {
        return renderMessageCellValue(value?.[0], cell);
      },
      // width: 356
    },
    {
      id: 'timecolumn',
      Header: 'Time',
      accessor: '__meta.timestamp',
      Cell: TimeColumn,
      minWidth: 35,
      width: 35,
      maxWidth: 35,
    },
  ];

  /**
   * On Filter connection log, update dropdown value and zustand store for connection
   * @param {*} type : Filter type
   * @param {*} filter : Filter value
   * @returns
   */
  let _onFilter = (type, filter = '') => {
    if (!type) return;

    if (logFilters[type] !== filter) {
      changePlaygroundLogFilters(activePlayground, { type: filter });
    }
  };

  return (
    <Container className="with-divider">
      <TabHeader className="height-small">
        <TabHeader.Right className="flex flex-nowrap invisible-scrollbar overflow-auto">
          <label className="m-0 text-sm font-bold whitespace-pre">
            Filter:
          </label>
          <div className="flex items-center">
            {/* <label className="m-0 text-base font-bold">Type</label> */}
            <span>
              <Dropdown
                selected={logFilters?.type || 'select log type'}
                className="fc-dropdown-fixwidth"
              >
                <Dropdown.Handler
                  id={`socket-io-response-log-${selectedConnection}-filter-type`}
                >
                  <Button
                    text={logFilters?.type || 'select log type'}
                    tooltip={
                      logFilters?.type
                        ? `Log type: ${logFilters?.type || '-'}`
                        : ''
                    }
                    sm
                    withCaret
                    ghost
                    transparent
                  />
                </Dropdown.Handler>
                <Dropdown.Options
                  options={Object.keys(logTypes)?.map((o) => ({ name: o }))}
                  onSelect={(type) => _onFilter('type', type?.name)}
                ></Dropdown.Options>
              </Dropdown>
            </span>

            {logFilters?.type ? (
              <div className="pl-1 w-4">
                <span
                  className="text-base  iconv2-remove-icon"
                  onClick={() => _onFilter('type', '')}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="flex items-center">
            {/* <label className="m-0 text-base font-bold">Event</label> */}
            <span>
              <Dropdown
                selected={logFilters?.event || 'select an event'}
                className="fc-dropdown-fixwidth"
              >
                <Dropdown.Handler
                  id={`socket-io-response-log-${selectedConnection}-filter-event`}
                >
                  <Button
                    text={logFilters?.event || 'select an event'}
                    tooltip={
                      logFilters?.event
                        ? `Event: ${logFilters?.event || '-'}`
                        : ''
                    }
                    sm
                    withCaret
                    ghost
                    transparent
                  />
                </Dropdown.Handler>
                <Dropdown.Options
                  options={eventsList?.map((o) => ({ name: o }))}
                  onSelect={(event) => _onFilter('event', event?.name)}
                  emptyMessage="No events"
                ></Dropdown.Options>
              </Dropdown>
            </span>

            {logFilters?.event ? (
              <div className="pl-1 w-4">
                <span
                  className="text-base  iconv2-remove-icon"
                  onClick={() => _onFilter('event', '')}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </TabHeader.Right>
      </TabHeader>
      <Container.Body overflow="hidden">
        <Row className="with-divider flex flex-col h-full">
          <Resizable
            bottom={true}
            height={tableHeight}
            width="100%"
            maxHeight={500}
            minHeight={100}
            onResizeStop={_onResizeStop}
          >
            <Column flex={1}>
              <ReactTable
                key={selectedConnection}
                virtualListHeight={tableHeight} //  40 is an estimated height of table header
                columns={columns}
                onLoad={(tableAPI) => {
                  logTableAPIRef.current = tableAPI;
                }}
                onRowClick={_onRowClick}
                className="no-border"
              />
            </Column>
          </Resizable>
          <LogPreview
            selectedConnection={selectedConnection}
            row={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </Row>
      </Container.Body>
    </Container>
  );
};

export default LogTable;
