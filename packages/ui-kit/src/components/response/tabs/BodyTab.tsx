import { FC, useEffect, useState } from 'react';
import {
  SecondaryTab,
  Container,
  Editor,
  StatusBar,
  EditorControlBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { TId } from '@firecamp/types';

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

const getContentTypeFromHeaders = (headers: { [k: string]: string }) => {
  let ct: string;
  if (headers) {
    if (Object.keys(headers).includes(`content-type`))
      ct = headers[`content-type`];
    else if (Object.keys(headers).includes(`Content-Type`))
      ct = headers[`Content-Type`];
    else ct = headers[`content-type`];

    if (ct?.includes(';')) {
      const newContentType = ct.split(';');
      if (newContentType && newContentType.length) ct = newContentType[0];
    }
  }
  return ct;
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
  /* { name: "XML", id: "xml" },
   { name: "HTML", id: "html" },*/
  { name: 'TEXT', id: 'text' },
  { name: 'No body found', id: 'nobodyfound' },
];

const BodyTab: FC<IBodyTab> = ({ id, data, headers = {}, error }) => {
  // console.log({ id, data, headers }); //TODO: optimize it for rerendering
  const contentType = getContentTypeFromHeaders(headers);

  let contentTypeKey = `content-type`;
  if (headers) {
    if (headers?.['content-type']) {
      contentTypeKey = `content-type`;
    } else if (headers?.['Content-Type']) {
      contentTypeKey = `Content-Type`;
    } else {
      contentTypeKey = `content-type`;
    }
  }
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState<EActiveTab>(
    getActiveTabFromHeaders(contentType)
  );
  const [editor, setEditor] = useState<any>(null);

  // set response type by updated response headers. (by content type)
  useEffect(() => {
    prepareTabs(headers);
  }, [headers]);

  const prepareTabs = (headers: any) => {
    const activeTab = _misc.isJSON(data)
      ? EActiveTab.Json
      : getActiveTabFromHeaders(headers?.[contentTypeKey]);

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
    // console.log("tab", tab);
    tab === 'octet_stream' ? 'json' : tab;

    switch (tab) {
      case EActiveTab.Html: /** allow to show HTML response without checking data HTML valid or not */
      case EActiveTab.Xml:
      case EActiveTab.Json:
      case EActiveTab.Text:
      default:
        try {
          if (tab === 'json') {
            data = JSON.stringify(JSON.parse(data), null, 4);
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
            value={data}
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
        return 'no body found';
      case EActiveTab.Preview:
        /** allow to show preview for HTML response without checking HTML data valid or not */
        return (
          <iframe
            src={`data:text/html, ${encodeURIComponent(data)}`}
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
  data?: string;
  error?: any;
}
