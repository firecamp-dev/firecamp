import { useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import {
  Container,
  TabHeader,
  // Collection,
  Column,
  Row,
  Resizable,
  Tabs,
  Editor,
} from '@firecamp/ui-kit';
// import FCSnippet from '@firecamp/code-snippets'
// import MessageNode from './MessageNode';
// import DirectoryNode from './DirectoryNode';

const initConfig = {
  url: 'ws://echo.websocket.org',
  protocols: ['echo', 'echo2'],
  options: {
    headers: { limit: 10 },
    handshakeTimeout: 1,
    protocolVersion: 2,
    origin: 'origin',
  },
  message: {
    name: 'Ws Message',
    value: 'sending the first ws message',
    __meta: {
      type: 'arraybuffer',
      envelop: 'uint8array',
    },
  },
};

const SnippetModal = ({
  collection: prop_collection,
  meta,
  isOpen = false,
  activeMessage = '',
  onClose = (_) => {},
}) => {
  const generateRequestConfig = () => {};

  const [state, setState] = useState({
    tabs: [
      {
        id: 'cpp',
        name: 'C++',
        mode: 'c_cpp',
      },
      {
        id: 'c#',
        name: 'C#',
        mode: 'csharp',
      },
      {
        id: 'dart',
        name: 'Dart',
        mode: 'dart',
      },
      {
        id: 'go',
        name: 'Go',
        mode: 'golang',
      },
      {
        id: 'java',
        name: 'Java',
        mode: 'java',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        mode: 'javascript',
      },
      {
        id: 'node',
        name: 'Node',
        mode: 'javascript',
      },
      {
        id: 'objectivec',
        name: 'Objective-C',
        mode: 'objectivec',
      },
      {
        id: 'python',
        name: 'Python',
        mode: 'python',
      },
      {
        id: 'swift',
        name: 'Swift',
        mode: 'swift',
      },
      {
        id: 'ruby',
        name: 'Ruby',
        mode: 'ruby',
      },
    ],
    activeTab: 'javascript',
    snippet: '',
    activeMessage: null,
    editorMode: 'javascript',
  });
  const [editor, setEditor] = useState();
  const [collection, setCollection] = useState();
  // prepare(
  //   prop_collection.directories || [],
  //   prop_collection.messages || [],
  //   meta
  // ).collection

  useEffect(() => {
    if (
      prop_collection &&
      prop_collection.messages &&
      prop_collection.messages.length
    ) {
      setState({
        ...state,
        activeMessage: prop_collection.messages[0],
      });
    }
  }, []);

  useEffect(() => {
    // console.log(`state.activeTab`, state.activeTab)
    // _getSnippet(state.activeMessage, state.activeTab);
  }, [state.activeTab, state.activeMessage]);

  useEffect(() => {
    // let { collection } = prepare(
    //   prop_collection.directories || [],
    //   prop_collection.messages || [],
    //   meta
    // );
    // console.log("collection change happens", collection)
    // setCollection(collection);
  }, [prop_collection.directories, prop_collection.messages]);

  const _setActiveTab = (tab) => {
    const foundTab = state.tabs.find((t) => t.id === tab);
    let mode = 'typescript';
    if (foundTab) {
      mode = foundTab.mode;
    }
    setState((s) => ({
      ...s,
      activeTab: tab,
      editorMode: mode,
    }));
  };

  const _setActiveMessage = (focusedNode) => {
    // focusedNode._addChild();
    // console.log(focusedNode);
    // return;

    if (focusedNode.children) return;
    setState((s) => ({
      ...state,
      activeMessage: focusedNode,
    }));
  };

  // const _getSnippet = async (message, aTab) => {
  //   if (!message || !aTab) return;

  //   const config = (await generateRequestConfig()) || initConfig;
  //   const fcs = new FCSnippet(
  //     Object.assign({}, config, { message }),
  //     'websocketv2',
  //     aTab.toLowerCase()
  //   );
  //   fcs
  //     .res()
  //     .then(r => {
  //       // console.log(r);
  //       setState({
  //         ...state,
  //         snippet: r
  //       });
  //     })
  //     .catch(er => console.log(er));
  // };

  const { tabs, activeTab, snippet, editorMode } = state;

  return (
    <Modal open={isOpen} onClose={() => onClose(false)}>
      <Container className="fc-modal">
        <Container.Header className="fc-modal-head" key="head">
          WebSocket Code Snippet
        </Container.Header>
        <Row
          className="with-divider fc-h-full fc-modal-body without-padding fc-modal-body-row"
          flex={1}
          overflow="auto"
        >
          <Resizable
            width={'30%'}
            maxWidth={'80%'}
            minWidth={'20%'}
            minHeight={515}
            height={515}
            maxHeight={515}
            right={true}
          >
            <Column width="200px" flex="none" overflow="auto">
              <Container>
                <Container.Header className="with-divider">
                  <TabHeader className={'small'}>Message Collection</TabHeader>
                </Container.Header>
                <Container.Body>
                  {/*  <Collection
                    overflow={'auto'}
                    data={collection}
                    primaryKey={'id'}
                    showTreeLine={true}
                    onNodeFocus={_setActiveMessage}
                    nodeRenderer={({
                      isDirectory,
                      item,
                      isExpanded,
                      classes,
                      getNodeProps
                    }) => {
                      if (isDirectory) {
                        return (
                          <DirectoryNode
                            item={item}
                            isOpen={isExpanded}
                            className={classes}
                            icon="folder"
                            {...getNodeProps()}
                          />
                        );
                        // return <div className={classes}> {item.name}</div>;
                      } else {
                        return (
                          <MessageNode
                            item={item}
                            className={classes}
                            {...getNodeProps()}
                          />
                        );
                      }
                    }}
                  /> */}
                </Container.Body>
              </Container>
            </Column>
          </Resizable>
          <Column flex={1}>
            {prop_collection &&
            prop_collection.messages &&
            prop_collection.messages.length ? (
              <Container>
                <Container.Header className="z-20">
                  <Tabs
                    key="tabs"
                    className="tabs-with-bottom-border nav nav-tabs"
                    list={tabs || []}
                    activeTab={activeTab || ''}
                    onSelect={_setActiveTab}
                    // tabsClassName="tabs-with-bottom-border-left-section"
                  />
                </Container.Header>
                <Container.Body>
                  <Editor
                    value={snippet}
                    language={editorMode || 'typescript'}
                    disabled={true}
                    onLoad={(edt) => setEditor(edt)}
                    monacoOptions={{
                      name: 'message',
                      width: '100%',
                      fontSize: 13,
                      highlightActiveLine: false,
                      showLineNumbers: false,
                      tabSize: 2,
                      cursorStart: 1,
                    }}
                  />
                </Container.Body>
              </Container>
            ) : (
              <Container>
                <Container.Empty className="font-sm center-block fc-h-full">
                  You haven't saved any messages yet! Please save message first.
                </Container.Empty>
              </Container>
            )}
          </Column>
        </Row>
      </Container>
    </Modal>
  );
};

export default SnippetModal;
