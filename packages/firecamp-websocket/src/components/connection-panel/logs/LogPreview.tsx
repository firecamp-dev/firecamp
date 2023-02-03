import cx from 'classnames';
import {
  Container,
  Column,
  TabHeader,
  Editor,
  EditorControlBar,
} from '@firecamp/ui-kit';
import { ELogTypes } from '../../../types';
import { useState } from 'react';

const emptyRow = {
  title: '',
  message: { name: '', value: '', __meta: { type: '' } },
  __meta: { id: '', event: '', type: '', color: '', timestamp: '' },
};

const LogPreview = ({ row = emptyRow }) => {
  const [editor, setEditor] = useState(null);
  if (!row?.message) row = emptyRow;
  const value =
    row.message?.__meta?.type !== 'file'
      ? row?.message?.value || row.title || ''
      : row?.message?.name || 'Sending File';

  const language = row?.message?.__meta?.type === 'json' ? 'json' : 'text';

  return (
    <Column minHeight={100} className="bg-appBackground2" height={'100%'}>
      <Container className="bg-focus2">
        <Container.Header className="bg-focus2">
          <TabHeader className={cx(row.__meta?.color || '', 'height-ex-small')}>
            <TabHeader.Left className="font-bold font-regular">
              {row?.__meta ? (
                [
                  <span
                    key={'event-icon'}
                    className={cx(
                      'td-icon',
                      {
                        'iconv2-to-server-icon':
                          row.__meta.type == ELogTypes.Send,
                      },
                      {
                        'iconv2-from-server-icon':
                          row.__meta.type == ELogTypes.Receive,
                      },
                      { 'icon-disk': row.__meta.type == ELogTypes.System }
                    )}
                  />,
                  <span className="font-sm" key="event-name">
                    {row.__meta.event}
                  </span>,
                  row.__meta.type !== ELogTypes.System ? (
                    <div
                      className="font-xs  text-appForegroundInActive "
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
            <TabHeader.Right className="font-bold font-regular">
              {row.__meta?.timestamp &&
                new Date(row.__meta?.timestamp).toLocaleTimeString()}

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
