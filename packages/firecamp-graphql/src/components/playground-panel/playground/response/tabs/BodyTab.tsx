import { useState, useContext, useEffect } from 'react';
import convert from 'xml-js';
import shallow from 'zustand/shallow';
import {
  SecondaryTab,
  Container,
  MultiLineIFE,
  StatusBar,
} from '@firecamp/ui-kit';
import { useGraphQLStore } from '../../../../../store';
import { _misc } from '@firecamp/utils';

const BodyTab = () => {
  let { response } = useGraphQLStore(
    (s) => ({
      response: s.playgrounds?.[s.runtime.activePlayground]?.response,
    }),
    shallow
  );

  let initialTabs = [
    { name: 'JSON', id: 'json' },
    /* { name: "XML", id: "xml" },
     { name: "HTML", id: "html" },*/
    { name: 'TEXT', id: 'text' },
  ];

  let CONTENT_TYPE_KEY = `content-type`;

  if (response && response.headers) {
    if (Object.keys(response.headers).includes(`content-type`)) {
      CONTENT_TYPE_KEY = `content-type`;
    } else if (Object.keys(response.headers).includes(`Content-Type`)) {
      CONTENT_TYPE_KEY = `Content-Type`;
    } else {
      CONTENT_TYPE_KEY = `content-type`;
    }
  }

  let { data } = response;

  let _getResponseType = (type) => {
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

    return responseType;
  };
  let [tabs, setTabs] = useState(initialTabs);
  let [responseType, setResponseType] = useState(
    response && response.headers
      ? _getResponseType(response.headers[CONTENT_TYPE_KEY])
      : 'JSON'
  );
  let [activeTab, setActiveTab] = useState(
    responseType ? responseType.toLocaleLowerCase() : 'text'
  );
  let [editorDOM, setEditorDOM] = useState({});

  let _setResponseType = (responsePayload) => {
    // console.log("responsePayload", responsePayload);
    let type = _misc.isJSON(data)
      ? 'json'
      : responsePayload &&
        responsePayload.headers &&
        responsePayload.headers[CONTENT_TYPE_KEY]
      ? _getResponseType(responsePayload.headers[CONTENT_TYPE_KEY])
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
        newTabs = [
          { name: type.toUpperCase(), id: type },
          { name: 'TEXT', id: 'text' },
        ];
      } else {
        newTabs = [{ name: type.toUpperCase(), id: type }];
      }
    } else {
      newTabs = [{ name: type.toUpper(), id: type }];
    }
    setTabs(newTabs);
  };

  let _renderTabBody = (tab) => {
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
          }
          if (tab === 'xml') {
            // data = DataConverter.prettify.xml(data);
          }
        } catch (e) {
          console.log(`e`, e);
        }

        let cursorStart = 1;

        return (
          <MultiLineIFE
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
          <MultiLineIFE
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
          <MultiLineIFE
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
  if (response && response.headers) {
    if (Object.keys(response.headers).includes(`content-type`))
      contentType = response.headers[`content-type`];
    else if (Object.keys(response.headers).includes(`Content-Type`))
      contentType = response.headers[`Content-Type`];
    else contentType = response.headers[`content-type`];

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
                response && contentType && contentType.length ? (
                  <div
                    className="whitespace-nowrap text-xs text-primaryColor w-fit overflow-hidden ml-4 overflow-ellipsis"
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
      <Container.Body overflow={'visible'}>
        {_renderTabBody(activeTab)}
      </Container.Body>
    </Container>
  );
};

export default BodyTab;
