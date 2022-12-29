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
const emptyRow = {
  message: [
    {
      __meta: {
        type: '',
      },
    },
  ],
  __meta: { id: '', type: '', color: '', timestamp: '' },
};

const LogPreview = ({ row = emptyRow, setSelectedRow = (_) => {} }) => {
  const [selectedArgIndex, setSelectedArgIndex] = useState(0);
  const [value, setValue] = useState('');
  const _setArgIndex = (index = 0) => {
    setSelectedArgIndex(index);
    let emitterArg = row?.message?.[index] || null;

    if (!emitterArg) {
      setValue(row?.title || '');
      return;
    }
    if (emitterArg?.payload && emitterArg?.__meta.type !== 'file') {
      setValue(emitterArg?.payload || '');
    } else {
      setValue(emitterArg?.name || '');
    }
  };
  if (!row?.message) row = emptyRow;

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
    row?.message[selectedArgIndex]?.__meta.type === 'json' ? 'json' : 'text';

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

const Header = ({ row = {}, emitterArg = {} }: any) => {
  // console.log(`row`, row)
  return (
    <TabHeader
      className={classnames(
        row.__meta ? row.__meta.color || '' : '',
        'height-ex-small'
      )}
    >
      <TabHeader.Left className="font-bold font-base">
        {row && row.__meta ? (
          [
            row.__meta.type !== 'ACK' ? (
              <span
                key={'event-icon'}
                className={classnames(
                  'td-icon',
                  { 'iconv2-to-server-icon': row.__meta.type == 'S' },
                  { 'iconv2-from-server-icon': row.__meta.type == 'R' },
                  { 'icon-disk': row.__meta.type == 'SYS' },
                  { 'icon-disk': row.__meta.type == 'SYS' }
                )}
              ></span>
            ) : (
              <AckIcon />
            ),
            <span className="font-sm" key="event-name">
              {row.__meta.event}
            </span>,
            row.__meta.type !== 'SYS' ? (
              <div
                className="font-xs text-appForegroundInActive whitespace-pre"
                key={'event-id'}
              >
                {row.__meta.id || ''}
              </div>
            ) : (
              <></>
            ),
          ]
        ) : (
          <></>
        )}
      </TabHeader.Left>
      <TabHeader.Right className="font-xs text-appForegroundInActive whitespace-pre">
        <span className="font-sm">
          {emitterArg?.__meta?.length
            ? `Length: ${emitterArg?.__meta.length}`
            : ''}
        </span>

        <div className="font-sm">
          {row?.__meta?.timestamp
            ? `Time: ${new Date(row?.__meta.timestamp).toLocaleTimeString()}`
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
  const [tabs, setTabs] = useState(
    args.map((arg, index) => {
      return {
        id: index,
        name: `Arg ${index + 1}`,
      };
    })
  );

  useEffect(() => {
    const newTabs = args.map((arg, index) => {
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
      activeTab={selectedArgIndex.toString() || '0'}
      isBgTransperant={true}
      onSelect={setSelectedArgIndex}
    />
  );
};
