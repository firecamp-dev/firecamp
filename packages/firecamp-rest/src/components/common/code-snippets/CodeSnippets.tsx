import { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Editor, Container, Tabs, Modal } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import codeSnippet, {
  ESnippetTargets,
  TTargetClients,
} from '../../../services/code-snippet';
import targetsInfo from '../../../services/code-snippet/targets-info';
import { useRestStoreApi, useRestStore, IRestStore } from '../../../store';
// import Modal from 'react-responsive-modal';
import { _env } from '@firecamp/utils';

const CodeSnippets = ({ tabId = '', getPlatformEnvironments }) => {
  let restStoreApi: any = useRestStoreApi();
  let { isCodeSnippetOpen, toggleOpenCodeSnippet } = useRestStore(
    (s: IRestStore) => ({
      isCodeSnippetOpen: s.ui.isCodeSnippetOpen,
      toggleOpenCodeSnippet: s.toggleOpenCodeSnippet,
    }),
    shallow
  );

  /**
   * activeClientTargetMap: Contains map of target and it's active client
   * Reason: To have an active client (persist) for individual target
   * Example: {'javascript': 'axios', 'java': 'okhttp', 'c': 'libcurl', ...}
   */
  let [activeClientTargetMap, setActiveClientTargetMap] = useState({});
  let [activeTarget, setActiveTarget] = useState('');

  // Snippets and generated tabs
  let [tabs] = useMemo(() => {
    tabs = targetsInfo.map((t) => {
      return {
        id: t.target,
        name: t.target,
      };
    });
    return [tabs];
  }, [isCodeSnippetOpen]);

  // active snippet target payload
  let activeSnippetTab = useMemo(() => {
    return targetsInfo.find((s) => s.target === activeTarget);
  }, [activeTarget]);

  useEffect(() => {
    let initTarget: ESnippetTargets = targetsInfo[0].target as ESnippetTargets,
      initClient: TTargetClients = targetsInfo[0].clients[0] as TTargetClients;
    _onSelectTab(initTarget, initClient);
  }, []);

  let [snippetCode, setSnippetCode] = useState('');

  /**
   * Set active tab/ target and client
   * @param tab : active tab/ target
   * @param client : active client
   */
  let _onSelectTab = async (tab: ESnippetTargets, client?: TTargetClients) => {
    // set active tab
    if (tab !== activeTarget) {
      setActiveTarget(tab);
    }

    // set active client to tab
    if (client && activeClientTargetMap[tab] !== client) {
      setActiveClientTargetMap({
        ...activeClientTargetMap,
        [tab]: client,
      });
    } else if (!client && !activeClientTargetMap[tab]) {
      let clientToSetActive = targetsInfo.find((t) => t.target === tab);
      if (clientToSetActive) {
        setActiveClientTargetMap({
          ...activeClientTargetMap,
          [tab]: clientToSetActive.clients[0],
        });
      }
    }

    let request = restStoreApi?.getState().request;
    let envVariables = await getPlatformEnvironments(tabId);

    // Parse variables
    request = _env.applyVariables(request, envVariables.mergedEnvVariables);

    // get code snippet by active target and client
    let newSnippetCode = codeSnippet(request, tab, client);
    if (snippetCode !== newSnippetCode) {
      // set code snippet text
      setSnippetCode(newSnippetCode);
    }
  };

  if (!isCodeSnippetOpen) return <span />;

  return (
    <Modal
      isOpen={isCodeSnippetOpen}
      onClose={() => toggleOpenCodeSnippet()}
      height="80vh"
      width="768px"
    >
      <Modal.Header className="border-appBorder border-b">
        <div className="text-modalActiveForeground text-lg px-6 py-3 ">
          {'Rest code snippet'}
        </div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Container.Header className="z-20">
            <Tabs
              list={tabs}
              activeTab={activeTarget}
              className="tabs-with-bottom-border"
              onSelect={(tab) => _onSelectTab(tab as ESnippetTargets)}
            />
          </Container.Header>
          <Container.Body>
            <div className="tab-content h-full">
              <div className="tab-pane h-full active" id={activeTarget}>
                <div className="p-2">
                  {activeSnippetTab?.clients ? (
                    <div className="keywords-wrapper">
                      <div className="flex text-base items-center flex-1">
                        {activeSnippetTab?.clients?.map((client, index) => {
                          return (
                            <div
                              className={classnames(
                                {
                                  'selected border-primaryColor':
                                    activeClientTargetMap[activeTarget] ==
                                    client,
                                },
                                {
                                  'border-transparent':
                                    activeClientTargetMap[activeTarget] !=
                                    client,
                                },
                                ' mx-2 border-b-2'
                              )}
                              onClick={(_) =>
                                _onSelectTab(
                                  activeTarget as ESnippetTargets,
                                  client as TTargetClients
                                )
                              }
                              key={index}
                            >
                              {client}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}

                  <Editor
                    value={snippetCode || ''}
                    language={
                      activeClientTargetMap[activeTarget] || 'typescript'
                    }
                    disabled={true}
                    controlsConfig={{
                      show: true,
                    }}
                    monacoOptions={{
                      // ref: ref,
                      // name: snippetLabel,
                      height: '500px',
                      width: 'auto',
                      fontSize: 14,
                      showPrintMargin: false,
                      showGutter: true,
                      highlightActiveLine: false,
                      // value: code || "",
                      showLineNumbers: true,
                      tabSize: 2,
                      editorProps: { $blockScrolling: Infinity },
                    }}
                  />
                </div>
              </div>
            </div>
          </Container.Body>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CodeSnippets;
