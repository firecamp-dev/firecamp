import { useState } from 'react';
import cx from 'classnames';
import {
  Container,
  Column,
  TabHeader,
  Editor,
  EditorControlBar,
} from '@firecamp/ui';
import { ELogTypes } from '../../../types';

const emptyRow = {
  title: '',
  value: { value: '', type: '' },
  __meta: { id: '', event: '', type: '', color: '', timestamp: '' },
};

const LogPreview = ({ row = emptyRow }) => {
  if (!row?.value && !row?.title) row = emptyRow;
  const [editor, setEditor] = useState(null);
  const value =
    row.value?.type !== 'file'
      ? row?.value?.value || row.title || ''
      : 'Sending File';
  const language = row?.value?.type === 'json' ? 'json' : 'text';

  // console.log(row, 'in preview');

  const isEventSent = row.__meta.type == ELogTypes.Send;
  const isEventReceived = row.__meta.type == ELogTypes.Receive;
  const isEventFromSystem = row.__meta.type == ELogTypes.System;
  return (
    <Column minHeight={100} className="bg-appBackground2" height={'100%'}>
      <Container className="bg-focus2">
        <Container.Header className="bg-focus2">
          <TabHeader className={cx(row.__meta?.color || '', 'height-ex-small')}>
            <TabHeader.Left className="font-bold font-regular">
              {row?.__meta ? (
                <>
                  <span
                    key={'event-icon'}
                    className={cx(
                      'td-icon',
                      { 'icv2-to-server-icon': isEventSent },
                      { 'icv2-from-server-icon': isEventReceived },
                      { 'ic-disk': isEventFromSystem }
                    )}
                  />

                  <span className="font-sm" key="event-name">
                    {row.__meta.event}
                  </span>

                  {isEventFromSystem ? (
                    <div
                      className="font-xs  text-appForegroundInActive "
                      key={'event-id'}
                    >
                      {row.__meta.id || ''}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </TabHeader.Left>
            <TabHeader.Right className="font-bold font-regular">
              <span className="mr-5">
                {row.__meta?.timestamp &&
                  new Date(row.__meta?.timestamp).toLocaleTimeString()}
              </span>
              <EditorControlBar editor={editor} language={language} />
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body>
          <Editor
            language={language}
            value={'' + value}
            disabled={true}
            onLoad={(edt) => setEditor(edt)}
          />
        </Container.Body>
      </Container>
    </Column>
  );
};

export default LogPreview;
