import { useEffect, useState, useMemo } from 'react';
import Modal from 'react-responsive-modal';
import {
  Container,
  TabHeader,
  Column,
  Row,
  Resizable,
  Tabs,
  Editor,
  // Collection,
} from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';
// import FCSnippet from '@firecamp/code-snippets';

const SnippetModal = ({
  collection: prop_collection = {},
  meta,
  isOpen = false,
  activeMessage = '',
  listeners = [],
  onClose = (bool) => {},
}) => {
  const generateRequestConfig = () => {};
  const config = useMemo(() => generateRequestConfig(), []);

  const [state, setState] = useState({
    tabs: [
      {
        id: 'cpp',
        name: 'C++',
        mode: 'c_cpp',
      },
      {
        id: 'dart',
        name: 'Dart',
        mode: 'dart',
      },
      {
        id: 'dotnet',
        name: '.net',
        mode: 'dart',
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
    ],
    activeTab: 'javascript',
    snippet: '',
    activeMessage: null,
    editorMode: 'javascript',
  });

  const [collection, setCollection] =
    useState();
    // prepare(
    //   prop_collection.directories || [],
    //   prop_collection.emitters || [],
    //   meta
    // ).collection

  useEffect(() => {
    // console.log(`prop_collection.emitters `, prop_collection.emitters)
    // let { collection } = prepare(
    //   prop_collection.directories || [],
    //   prop_collection.emitters || [],
    //   meta
    // ).collection;
    // // console.log("collection change happens", collection)
    // setCollection(collection);
  }, [prop_collection.directories, prop_collection.emitters]);

  useEffect(() => {
    if (
      prop_collection &&
      prop_collection.emitters &&
      prop_collection.emitters.length
    ) {
      setState({
        ...state,
        activeMessage: prop_collection.emitters[0],
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
    //   prop_collection.emitters || [],
    //   meta
    // );
    // // console.log("collection change happens", collection)
    // setCollection(collection);
  }, [prop_collection.directories, prop_collection.emitters]);

  const _setActiveTab = (tab) => {
    let foundTab = state.tabs.find((t) => t.id === tab),
      mode = 'typescript';
    if (foundTab) {
      mode = foundTab.mode;
    }

    setState({
      ...state,
      activeTab: tab,
      editorMode: mode,
    });
  };

  const _setActiveMessage = (focusedNode) => {
    // focusedNode._addChild();
    // console.log(focusedNode);
    // return;

    if (focusedNode.children) return;
    setState({
      ...state,
      activeMessage: focusedNode,
    });
  };

  // let _getSnippet = (emitter, aTab) => {
  //   if (!emitter || !aTab) return;
  //   let snippetConfig = _cloneDeep(config);

  //   snippetConfig.options = snippetConfig.config;
  //   delete snippetConfig.config;

  //   console.log(`config`, snippetConfig);
  //   // console.log(`emitter`, emitter);
  //   // console.log(`listeners`, listeners);
  //   let fcs = new FCSnippet(
  //     Object.assign({}, snippetConfig, { emitter, listeners }),
  //     'socketiov2',
  //     aTab.toLowerCase()
  //   );
  //   fcs
  //     .res()
  //     .then((r) => {
  //       // console.log(r);
  //       setState({
  //         ...state,
  //         snippet: r,
  //       });
  //     })
  //     .catch((er) => console.log(er));
  // };

  const { tabs, activeTab, snippet, editorMode } = state;

  return (
    <Modal open={isOpen} onClose={() => onClose(false)}>
      <Container className="fc-modal">
        <Container.Header className="fc-modal-head" key="head">
          Socket Code Snippet
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
                      getNodeProps,
                    }) => {
                      if (isDirectory) {
                        return (
                          <DirectoryNode
                            item={item}
                            isOpen={isExpanded}
                            className={classes}
                            icon="folder"
                            allowControls={false}
                            {...getNodeProps()}
                          />
                        );
                        // return <div className={classes}> {item.name}</div>;
                      } else {
                        return (
                          <EmitterNode
                            item={item}
                            className={classes}
                            allowControls={false}
                            {...getNodeProps()}
                          />
                        );
                      }
                    }}
                  /> */}
                  {/* <Collection
                     data={collection}
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
                     <FcNode
                     isOpen={isExpanded}
                     name={item.name}
                     className={classes}
                     icon="folder"
                     {...getNodeProps()}
                     />
                     );
                     // return <div className={classes}> {item.name}</div>;
                     } else {
                     return (
                     <MessageNode className={classes} {...getNodeProps()} />
                     );
                     }
                     }}
                     />*/}
                </Container.Body>
              </Container>
            </Column>
          </Resizable>
          <Column flex={1}>
            {prop_collection &&
            prop_collection.emitters &&
            prop_collection.emitters.length ? (
              <Container>
                <Container.Header className="z-20">
                  <Tabs
                    key="tabs"
                    list={tabs || []}
                    activeTab={activeTab || ''}
                    onSelect={_setActiveTab}
                    // tabsClassName="tabs-with-bottom-border-left-section"
                  />
                </Container.Header>
                <Container.Body>
                  <Editor
                    language={editorMode || 'typescript'}
                    value={snippet}
                    disabled={true}
                    // controlsConfig={{
                    //   show: true,
                    // }}
                    monacoOptions={{
                      name: 'emitter',
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
                  You haven't saved any emitters yet! Please save emitter first.
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
