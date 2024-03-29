import { FC, useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import {
  SecondaryTab,
  Container,
  Editor,
  StatusBar,
  EditorControlBar,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { IHeader, TId, TPlainObject } from '@firecamp/types';

enum EActiveTab {
  Json = 'json',
  Xml = 'xml',
  Text = 'text',
  Binary = 'binary',
  Image = 'image',
  // html/preview
  Html = 'html',
  Preview = 'preview',
  // none when error exists
  None = '',
}

const getContentTypeFromHeaders = (headers: IHeader[]) => {
  const h = headers.find((h) => {
    return ['content-type', 'Content-Type'].includes(h.key);
  });
  if (!h) return '';
  return h.value.includes(';') ? h.value.split(';')[0] : h.value;
};

const getActiveTabFromHeaders = (contentType: string = '') => {
  if (!contentType) return EActiveTab.None;
  let at = EActiveTab.None;
  if (contentType.includes(EActiveTab.Json)) at = EActiveTab.Json;
  else if (contentType.includes('xml')) at = EActiveTab.Xml;
  else if (contentType.includes('html')) at = EActiveTab.Html;
  else if (contentType.includes('binary')) at = EActiveTab.Binary;
  else if (contentType === 'text/plain') at = EActiveTab.Text;
  else if (contentType.includes(EActiveTab.Image)) at = EActiveTab.Image;
  else at = EActiveTab.None;
  return at;
};

const initialTabs = [
  { name: 'JSON', id: 'json' },
  /* { name: "XML", id: "xml" },*/
  { name: 'HTML', id: 'html' },
  { name: 'TEXT', id: 'text' },
  { name: 'No body found', id: 'nobodyfound' },
];

const BodyTab: FC<IBodyTab> = ({ id, body, headers = {}, error }) => {
  // console.log({ id, body, headers }); //TODO: optimize it for rerendering
  const contentType = getContentTypeFromHeaders(headers);
  const [editor, setEditor] = useState<any>(null);
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState<EActiveTab>();
  useEffect(() => {
    const activeTab = getActiveTabFromHeaders(contentType);
    if (!activeTab) setActiveTab(activeTab);
  }, [contentType]);

  // set response type by updated response headers. (by content type)
  useEffect(() => {
    prepareTabs();
  }, [contentType, body]);

  const prepareTabs = () => {
    const activeTab = _misc.isJSON.strict(body)
      ? EActiveTab.Json
      : getActiveTabFromHeaders(contentType);

    /** 'json', 'xml', 'binary', 'html', 'text', 'image' */
    let newTabs: { name: string; id: EActiveTab }[] = [
      { name: activeTab.toUpperCase(), id: activeTab },
    ];
    if (activeTab === EActiveTab.Html) {
      newTabs = [{ name: 'Preview', id: EActiveTab.Preview }, ...newTabs];
    }
    setTabs(newTabs);
    setActiveTab(activeTab == EActiveTab.Html ? EActiveTab.Preview : activeTab);
  };

  const _renderTabBody = (tab: string) => {
    // setTimeout(this._editorFoldAll, 2000)
    // console.log('tab', tab);
    tab === 'octet_stream' ? 'json' : tab;

    switch (tab) {
      case EActiveTab.Html: /** allow to show HTML response without checking body HTML valid or not */
      case EActiveTab.Xml:
      case EActiveTab.Json:
      case EActiveTab.Text:
      default:
        try {
          if (tab === 'json') {
            body = JSON.stringify(JSON.parse(body), null, 4);
          }
          if (tab === 'xml') {
            // prettify
          }
        } catch (e) {
          console.log(`e`, e);
        }

        return (
          <Editor
            language={tab}
            value={body}
            path={`${id}/response/body`}
            onLoad={(editor) => {
              setEditor(editor);
              // editor.resize(true);
              editor.revealLine(1);
              editor.setPosition({ column: 1, lineNumber: 10 });
            }}
            disabled={true}
            monacoOptions={{
              name: `response`,
            }}
          />
        );
      case EActiveTab.None:
        return <CorsError />;

      case EActiveTab.Preview:
        /** allow to show preview for HTML response without checking HTML data valid or not */
        return (
          <iframe
            src={`data:text/html, ${encodeURIComponent(body)}`}
            style={{ height: '100%', width: '100%' }}
          />
        );
    }
  };
  if (editor && editor.editor) {
    editor.$onChangeWrapMode();
  }

  return (
    <Container>
      <Container.Header>
        <StatusBar className="fc-statusbar">
          <StatusBar.PrimaryRegion>
            <SecondaryTab
              className="flex items-center"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tab: EActiveTab) => setActiveTab(tab)}
              additionalComponent={
                contentType && contentType.length ? (
                  <div style={{ fontSize: '11px' }}>{contentType}</div>
                ) : (
                  <></>
                )
              }
            />
          </StatusBar.PrimaryRegion>
          <StatusBar.SecondaryRegion>
            <EditorControlBar editor={editor} language={activeTab} />
          </StatusBar.SecondaryRegion>
        </StatusBar>
      </Container.Header>
      <Container.Body overflow={'hidden'}>
        {_renderTabBody(activeTab)}
      </Container.Body>
    </Container>
  );
};

export default BodyTab;

interface IBodyTab {
  id: TId;
  headers: any;
  body?: string;
  error?: any;
}

const CorsError = () => {
  return (
    <div className="p-3">
      <div className="text-error flex items-center text-base font-semibold mb-2 mt-1">
        <XCircle className="mr-1" />
        <span>Unable to reach server</span>
      </div>
      <div className="text-base text-app-foreground-inactive">
        <ul className="ml-8 list-decimal">
          <li className="mb-2">
            <span>Server may not be reachable at the provided endpoint.</span>
          </li>
          <li className="mb-2">
            <span>Is the server currently running?</span>
          </li>
          <li className="mb-2">
            <label className="font-semibold block text-app-foreground-active">
              The Server's response may be missing CORS headers
            </label>
            <span>
              To verify open developer tools and check the console for any CORS
              related error message like, "Cors Origin Request Blocked".
              Possible solutions are
            </span>
            <div>
              <ul className="ml-8 list-disc mt-2">
                <li className="mv-2">
                  <span>
                    {`Contact your system administrator and add `}
                    <b className="text-app-foreground contents">
                      https://firecamp.dev
                    </b>
                    {` to your server's allow list.`}
                  </span>
                  <a
                    className="font-semibold block !text-info cursor-pointer"
                    href="https://enable-cors.org/server.html"
                    target="_blank"
                  >
                    Learn more about enabling CORS.
                  </a>
                </li>
                <li className="mb-2">
                  <span>
                    {`Or change Firecamp Agent from Browser agent to `}
                    <a className="font-semibold block !text-info contents">
                      Cloud Agent
                    </a>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
