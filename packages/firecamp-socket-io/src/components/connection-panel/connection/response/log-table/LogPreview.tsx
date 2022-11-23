import { useState, useEffect } from 'react';
import equal from 'deep-equal';
import classnames from 'classnames';

import {
  SecondaryTab,
  Container,
  TabHeader,
  Column,
  Editor,
} from '@firecamp/ui-kit';
import AckIcon from './AckIcon';

const LogPreview = ({
  selectedConnection = '',
  row = {},
  setSelectedRow = (_) => {},
}) => {
  let [selectedArgIndex, setSelectedArgIndex] = useState(0);

  const _setArgIndex = (index = 0) => {
    setSelectedArgIndex(index);
    let emitterArg = row?.message?.[index] || null;

    if (!emitterArg) {
      setValue(row?.title || '');
      return;
    }
    if (emitterArg?.payload && emitterArg?.meta?.type !== 'file') {
      setValue(emitterArg?.payload || '');
    } else {
      setValue(emitterArg?.name || '');
    }
  };

  let [value, setValue] = useState('');

  /**
   * On row update, set argument index to zero as row can have number of arguments.
   * If current row is having 2 arguments and 2nd is active. on Row update, new current row is having only one arg.
   * To handle this situation, row arg index is set to 0 on row update.
   */
  useEffect(() => {
    _setArgIndex(0);
  }, [row]);

  useEffect(() => {
    return () => {
      setSelectedRow({});
    };
  }, []);

  const language =
    row?.message?.[selectedArgIndex]?.meta?.type === 'json' ? 'json' : 'text';

  return (
    <Column flex={1} minHeight={100} overflow="auto">
      <Container className="bg-focus2">
        <Container.Header className="bg-focus2">
          <Header
            row={row || {}}
          emitterArg={row?.message?.[selectedArgIndex]}
          />
        </Container.Header>
        <Container.Body>
          <Editor
            language={language}
            value={value}
            disabled={true}
            // controlsConfig={{ show: true, position: 'horizontal' }}
          />
        </Container.Body>
        {row.message && Array.isArray(row.message) ? (
          <Container.Footer>
            <Footer
              args={row.message || []}
              setSelectedArgIndex={_setArgIndex}
              selectedArgIndex={selectedArgIndex}
            />
          </Container.Footer>
        ) : (
          ''
        )}
      </Container>
    </Column>
  );
};

export default LogPreview;

const Header = ({ row = {}, emitterArg = {} }) => {
  // console.log(`row`, row)
  return (
    <TabHeader
      className={classnames(
        row.meta ? row.meta.color || '' : '',
        'height-ex-small'
      )}
    >
      <TabHeader.Left className="font-bold font-base">
        {row && row.meta
          ? [
              row.meta.type !== 'ACK' ? (
                <span
                  key={'event-icon'}
                  className={classnames(
                    'td-icon',
                    { 'iconv2-to-server-icon': row.meta.type == 'S' },
                    { 'iconv2-from-server-icon': row.meta.type == 'R' },
                    { 'icon-disk': row.meta.type == 'SYS' },
                    { 'icon-disk': row.meta.type == 'SYS' }
                  )}
                ></span>
              ) : (
                <AckIcon />
              ),
              <span className="font-sm" key="event-name">
                {row.meta.event}
              </span>,
              row.meta.type !== 'SYS' ? (
                <div
                  className="font-xs text-appForegroundInActive whitespace-pre"
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
      <TabHeader.Right className="font-xs text-appForegroundInActive whitespace-pre">
        <span className="font-sm">
          {emitterArg?.meta?.length
            ? `Length: ${emitterArg?.meta?.length}`
            : ''}
        </span>

        <div className="font-sm">
          {row?.meta?.timestamp
            ? `Time: ${new Date(row?.meta?.timestamp).toLocaleTimeString()}`
            : ''}
        </div>
      </TabHeader.Right>
    </TabHeader>
  );
};

const Footer = ({
  args = [],
  selectedArgIndex = 0,
  setSelectedArgIndex = () => {},
}) => {
  let [tabs, setTabs] = useState(
    args.map((arg, index) => {
      return {
        id: index,
        name: `Arg ${index + 1}`,
      };
    })
  );

  useEffect(() => {
    let newTabs = args.map((arg, index) => {
      return {
        id: index,
        name: `Arg ${index + 1}`,
      };
    });

    if (!equal(tabs, newTabs)) {
      setTabs(newTabs);
    }
  }, [args]);

  return (
    <SecondaryTab
      list={tabs}
      activeTab={selectedArgIndex.toString() || "0"}
      isBgTransperant={true}
      onSelect={setSelectedArgIndex}
    />
  );
};
