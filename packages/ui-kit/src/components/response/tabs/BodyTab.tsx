import { FC, useEffect, useState } from 'react';
import {
  SecondaryTab,
  Container,
  Editor,
  StatusBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

const BodyTab: FC<IBodyTab> = ({ data, headers }) => {
  let initialTabs = [
    { name: 'JSON', id: 'json' },
    /* { name: "XML", id: "xml" },
     { name: "HTML", id: "html" },*/
    { name: 'TEXT', id: 'text' },
  ];

  let ContentType = `content-type`;

  if (headers) {
    if (Object.keys(headers).includes(`content-type`)) {
      ContentType = `content-type`;
    } else if (Object.keys(headers).includes(`Content-Type`)) {
      ContentType = `Content-Type`;
    } else {
      ContentType = `content-type`;
    }
  }

  let _getResponseType = (type: string) => {
    // console.log({ type });

    if (!type) {
      type = 'text';
    }

    let contentType = type;

    let responseType = 'json';
    if (contentType.includes('json')) responseType = 'json';
    else if (contentType.includes('xml')) responseType = 'xml';
    else if (contentType.includes('html')) responseType = 'html';
    else if (contentType.includes('binary')) responseType = 'binary';
    else if (contentType === 'text/plain') responseType = 'text';
    else if (contentType.includes('image')) responseType = 'image';
    else responseType = 'text';
    // console.log({ responseType });

    return responseType;
  };
  let [tabs, setTabs] = useState(initialTabs);
  let [responseType, setResponseType] = useState(
    headers ? _getResponseType(headers[ContentType]) : 'JSON'
  );
  let [activeTab, setActiveTab] = useState(
    responseType ? responseType.toLocaleLowerCase() : 'json'
  );
  let [editorDOM, setEditorDOM] = useState<any>(null);

  // Set response type by updated response headers. (by content type)
  useEffect(() => {
    _setResponseType(headers);
  }, [headers]);

  let _setResponseType = (headers: any) => {
    // console.log("responsePayload", responsePayload);
    let type = _misc.isJSON(data)
      ? 'json'
      : headers && headers[ContentType]
      ? _getResponseType(headers[ContentType])
      : 'text';
    setResponseType(type);
    type === 'html' ? setActiveTab('preview') : setActiveTab(type);
    // console.log("type detected", type);
    let newTabs = [];
    if (['json', 'xml', 'binary', 'html', 'text', 'image'].includes(type)) {
      if (type === 'html' /*&& isHTML(data)*/) {
        newTabs = [
          { name: 'Preview', id: 'preview' },
          { name: 'HTML', id: 'html' },
        ];
      } else if (['json', 'xml', 'binary'].includes(type)) {
        if (type === 'json') {
          newTabs = [{ name: 'JSON', id: 'json' }];
        } else {
          newTabs = [
            { name: type.toUpperCase(), id: type },
            { name: 'TEXT', id: 'text' },
          ];
        }
      } else {
        newTabs = [{ name: type.toUpperCase(), id: type }];
      }
    } else {
      newTabs = [{ name: type.toUpperCase(), id: type }];
    }
    setTabs(newTabs);
  };
  // console.log({ responseType, activeTab, tabs });

  let _renderTabBody = (tab: string) => {
    // setTimeout(this._editorFoldAll, 2000)
    // console.log("tab", tab);
    tab === 'octet_stream' ? 'json' : tab;

    switch (tab) {
      case 'xml':
      case 'json':
      case 'text':
        try {
          if (tab === 'json') {
            // data = DataConverter.prettify.json(data);
            data = JSON.stringify(JSON.parse(data), null, 4)
          }
          if (tab === 'xml') {
            // data = DataConverter.prettify.xml(data);
          }
        } catch (e) {
          console.log(`e`, e);
        }

        let cursorStart = 1;

        return (
          <Editor
            language={tab}
            value={data}
            onLoad={(editor) => {
              setEditorDOM(editor);
              // editor.resize(true);
              editor.revealLine(1);
              editor.setPosition({ column: 1, lineNumber: 10 });
            }}
            controlsConfig={{
              show: activeTab !== 'preview',
            }}
            disabled={true}
            monacoOptions={{
              name: `response`,
            }}
          />
        );
      case 'html':
        /**
         * Allow to show HTML response without checking data HTML valid or not
         */
        return (
          <Editor
            disabled={true}
            language={tab}
            value={data}
            onLoad={(editor) => {
              setEditorDOM(editor);
            }}
            monacoOptions={{
              name: `response`,
            }}
          />
        );

        break;
      case 'preview':
        /**
         * Allow to show preview for HTML response without checking HTML data valid or not
         */

        return (
          <iframe
            src={`data:text/html, ${encodeURIComponent(data)}`}
            style={{ height: '100%', width: '100%' }}
          />
        );
        break;
      default:
        return (
          <Editor
            disabled={true}
            language={tab}
            value={data}
            onLoad={(editor) => {
              setEditorDOM(editor);
            }}
            monacoOptions={{
              name: `response`,
            }}
          />
        );
    }
  };

  // console.log("editorDOM: ", editorDOM);
  if (editorDOM && editorDOM.editor) {
    editorDOM.$onChangeWrapMode();
  }

  let contentType = '';
  if (headers) {
    if (Object.keys(headers).includes(`content-type`))
      contentType = headers[`content-type`];
    else if (Object.keys(headers).includes(`Content-Type`))
      contentType = headers[`Content-Type`];
    else contentType = headers[`content-type`];

    if (contentType && contentType.includes(';')) {
      let newContentType = contentType.split(';');
      if (newContentType && newContentType.length)
        contentType = newContentType[0];
    }
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
              onSelect={(tab) => setActiveTab(tab)}
              additionalComponent={
                contentType && contentType.length ? (
                  <div
                    className="fc-response-header-stats-type"
                    style={{ fontSize: '11px' }}
                  >
                    {contentType}
                  </div>
                ) : (
                  ''
                )
              }
            />
          </StatusBar.PrimaryRegion>
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
  data?: string;
  headers: any;
}
