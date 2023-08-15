import { useState, useEffect, FC } from 'react';
import isEqual from 'react-fast-compare';
import classnames from 'classnames';
import {
  SecondaryTab,
  Container,
  TabHeader,
  Column,
  Editor,
  EditorControlBar,
} from '@firecamp/ui';
import { EArgumentBodyType, EEditorLanguage } from '@firecamp/types';
import AckIcon from './AckIcon';
import {
  ELogColors,
  ELogTypes,
  ILog,
} from '@firecamp/socket.io-executor/dist/esm';

const emptyRow: ILog = {
  title: '',
  value: [
    {
      value: '',
      type: EArgumentBodyType.Text,
    },
  ],
  __meta: {
    ackRef: false,
    event: '',
    type: ELogTypes.System,
    color: ELogColors.Warning,
    timestamp: new Date().valueOf(),
  },
  __ref: { id: '' },
};

const LogPreview = ({ row = emptyRow }) => {
  if (!row) return <></>;
  console.log(row, '...... preview ......');
  const [selectedArgIndex, setSelectedArgIndex] = useState(0);
  const [value, setValue] = useState<string | number | boolean>('');
  const [editor, setEditor] = useState(null);
  const _setArgIndex = (index = 0) => {
    setSelectedArgIndex(index);
    const emitterArg = row?.value?.[index] || null;
    if (!emitterArg) {
      setValue(row?.title || '');
      return;
    }
    if (emitterArg.type !== 'file') {
      setValue(emitterArg.value || '');
    } else {
      //@ts-ignore
      setValue(emitterArg.name || '');
    }
  };
  if (!row?.value && !row.title) row = emptyRow;

  /**
   * On row update, set argument index to zero as row can have number of arguments.
   * If current row is having 2 arguments and 2nd is active. on Row update, new current row is having only one arg.
   * To handle this situation, row arg index is set to 0 on row update.
   */
  useEffect(() => {
    _setArgIndex(0);
  }, [row]);

  const language =
    row.value[selectedArgIndex]?.type === 'json'
      ? EEditorLanguage.Json
      : EEditorLanguage.Text;

  console.log(row, 'in preview...');

  return (
    <Column flex={1} minHeight={100} overflow="auto">
      <Container className="bg-focus2">
        <Container.Header className="bg-focus2">
          <Header
            row={row || {}}
            emitterArg={row?.value?.[selectedArgIndex]}
            postComponent={
              <EditorControlBar editor={editor} language={language} />
            }
          />
        </Container.Header>
        <Container.Body>
          <Editor
            language={language}
            value={value?.toString() || ''}
            disabled={true}
            onLoad={(edt) => setEditor(edt)}
          />
        </Container.Body>
        {Array.isArray(row?.value) ? (
          <Container.Footer>
            <Footer
              args={row.value || []}
              setSelectedArgIndex={_setArgIndex}
              selectedArgIndex={selectedArgIndex}
            />
          </Container.Footer>
        ) : (
          <></>
        )}
      </Container>
    </Column>
  );
};

export default LogPreview;

const Header: FC<any> = ({ row = {}, emitterArg = {}, postComponent }) => {
  const isEventSent = row.__meta.type == ELogTypes.Send;
  const isEventReceived = row.__meta.type == ELogTypes.Receive;
  const isEventFromSystem = row.__meta.type == ELogTypes.System;
  const isEventAck = row.__meta.type == ELogTypes.Ack;
  return (
    <TabHeader
      className={classnames(row.__meta?.color || '', 'height-ex-small')}
    >
      <TabHeader.Left className="font-bold font-base">
        {row && row.__meta ? (
          [
            row.__meta.type !== isEventAck ? (
              <span
                key={'event-icon'}
                className={classnames(
                  'td-icon',
                  { 'icv2-to-server-icon': isEventSent },
                  { 'icv2-from-server-icon': isEventReceived },
                  { 'ic-disk': isEventFromSystem }
                )}
              />
            ) : (
              <AckIcon />
            ),
            <span className="font-sm" key="event-name">
              {row.__meta.event}
            </span>,
            row.__meta.type !== isEventFromSystem ? (
              <div
                className="font-xs text-app-foreground-inactive whitespace-pre"
                key={'event-id'}
              >
                {row.__ref.id || ''}
              </div>
            ) : (
              <></>
            ),
          ]
        ) : (
          <></>
        )}
      </TabHeader.Left>
      <TabHeader.Right className="font-xs text-app-foreground-inactive whitespace-pre">
        {/* <span className="font-sm">
          {emitterArg?.__meta?.length
            ? `Length: ${emitterArg?.__meta.length}`
            : <></>}
        </span> */}

        <div className="font-sm">
          {row?.__meta?.timestamp ? (
            `Time: ${new Date(row?.__meta.timestamp).toLocaleTimeString()}`
          ) : (
            <></>
          )}
        </div>
        {postComponent}
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
    if (!isEqual(tabs, newTabs)) {
      setTabs(newTabs);
    }
  }, [args]);

  return (
    <SecondaryTab
      list={tabs}
      activeTab={selectedArgIndex.toString() || '0'}
      isBgTransparent={true}
      onSelect={setSelectedArgIndex}
    />
  );
};
