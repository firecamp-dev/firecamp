// @ts-nocheck
import { FC, useState, useEffect, useRef } from 'react';
import { Container, Column, Row, Resizable } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { ERequestTypes } from '@firecamp/types';
import './MarkdownTab.sass';
import MDConvertor from './MDConverter';
import Copy from '../../../services/copy-to-text';
import * as cacheTabsFactory from '../../../services/cache-tabs-factory';
import MarkdownTabService from './MarkdownTabService';
import Source from './source/Source';
import Target from './target/Target';

import { ITab, ITabFns } from '../types/tab';

const demoMD = `### Firecamp    
###### Release note: **v0.1.1-beta**
------------------

#### **1. New features:**

###### App added:
- **WebSocket** Support added, 
    > \`Firecamp + WebSocket = Fire-WS\` .

#### **2. Feature enhancement:**
    
- SocketApp Right bar UI improved
- UI change when creating Module & Request with name validation.

#### **3. Bug Fixes:**

**  Fire-SocketIO app:**

- Reflect opend emitter when new body saved from chatFooter.
- Emit & Save event on keyPress Ctrl + Alt + Enter
- Manage unsaved request when add/ delete emitter body.  
- Active Saved Emitter screen UI not reflecting on add/delete body 
        `;

const MarkdownTab: FC<IMarkdownTab> = ({ tab: propTab = {}, tabFns = {} }) => {
  let { current: markdownTabService } = useRef(new MarkdownTabService(propTab));

  let cacheTabsFactoryFns = cacheTabsFactory;

  let _updateCacheTab = (state) => {
    let syncState = markdownTabService.getCurrentState() || {};
    let reactState = Object.assign({}, state);
    cacheTabsFactoryFns.setTab(propTab.id, {
      request: reactState,
      sync: syncState,
    });
  };

  let [state, setState] = useState({
    panel: {
      source: {
        body: '',
        type: 'md',
      },
      target: {
        body: '',
        type: 'html',
        controls: {
          preview: {
            name: 'Preview',
            key: 'preview',
          },
          html: {
            name: 'HTML',
            key: 'html',
          },
        },
        activeControl: 'preview',
      },
    },
    revision:
      propTab.__meta && Object.keys(propTab.__meta).includes('revision')
        ? propTab.__meta.revision
        : 1,
    ...(propTab?.session?.request || {}),
  });

  let stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    _updateCacheTab(state);
  }, [state]);

  useEffect(() => {
    // F?.reactGA?.pageview?.('markdown');

    if (propTab?.request?.data) {
      _onSourceUpdate(propTab?.request?.data);
    }
  }, []);

  useEffect(() => {
    let statePayload = {};

    if (
      Object.keys(propTab.__meta).includes('revision') &&
      !equal(propTab.__meta.revision, state.revision) &&
      (!equal(state.panel.source.body, propTab.request.data) ||
        !equal(state.panel.source.type, propTab.request.__meta.data_type))
    ) {
      if (state.panel && state.panel.source && state.panel.source.body) {
        statePayload = Object.assign({}, state, {
          panel: Object.assign({}, state.panel, {
            source: Object.assign({}, state.panel.source, {
              body: propTab.request.data,
              type: propTab.request.__meta.data_type || 'md',
            }),
          }),
          revision: propTab.__meta.revision || 1,
        });
      }
    }

    if (Object.keys(statePayload).length) {
      setState(statePayload);
    }

    markdownTabService.setProps(propTab);
  }, [propTab]);

  let _onSourceUpdate = async (code) => {
    // console.log("code", code);

    if (!code || !code.length) {
      _onClearPanel();
      return;
    }

    let htmlCode = await MDConvertor._toHTML(code);

    setState((ps) => {
      return {
        ...ps,
        panel: {
          ...ps.panel,
          source: {
            ...ps.panel.source,
            body: code,
          },
          target: {
            ...ps.panel.target,
            body: htmlCode,
          },
        },
      };
    });
    markdownTabService.action.update(code, 'md');
  };

  let _onSelectTargetControl = async (control) => {
    let {
      panel: {
        source: { body: MDCode },
      },
    } = state;

    if (!MDCode) return;

    setState((ps) => {
      return {
        ...ps,
        panel: {
          ...ps.panel,
          target: {
            ...ps.panel.target,
            activeControl: control,
          },
        },
      };
    });
  };

  let _onClearPanel = () => {
    setState((ps) => {
      return {
        ...ps,
        panel: {
          source: {
            body: '',
            type: 'md',
          },
          target: {
            body: '',
            type: 'html',
            controls: {
              preview: {
                name: 'Preview',
                key: 'preview',
              },
              html: {
                name: 'HTML',
                key: 'html',
              },
            },
            activeControl: 'preview',
          },
        },
      };
    });
  };

  let _onCopy = (code) => {
    if (!code) return;
    Copy(code);
  };

  let _onSaveRequest = async ({
    name,
    description,
    project: collectionId,
    module: folderId,
  }) => {
    let {
      panel: {
        source: { body, type },
      },
    } = state;

    let tabRequest = {
      data: body,
      __meta: {
        name,
        description,
        type: ERequestTypes.File,
        data_type: type,
      },
      __ref: {
        collectionId,
        folderId,
      },
    }; //TODO: version

    await markdownTabService.db.addRequest(tabRequest);
    return Promise.resolve(tabRequest);
  };

  let _onDemoMDRequest = () => {
    let {
      panel: {
        source: { body },
      },
    } = state;
    if (body) {
      return;
    } else {
      _onSourceUpdate(demoMD);
    }
  };

  let _onUpdateRequest = async () => {
    markdownTabService.db.updateRequest(stateRef.current);
  };

  return (
    <Container className="rest-propTab fc-h-full w-full with-divider">
      <Container.Body>
        <Row
          className="with-divider fc-h-full w-full"
          height="100%"
          overflow="hidden"
        >
          <Column
            height={'100%'}
            flex={1}
            minWidth="20%"
            maxWidth={'80%'}
            overflow="visible"
            width={'50%'}
          >
            <Source
              source={state?.panel?.source || ''}
              tabMeta={propTab.__meta}
              tabId={propTab.id}
              requestMeta={propTab?.request?.__meta || {}}
              tabFns={tabFns}
              onSourceUpdate={_onSourceUpdate}
              onCopy={_onCopy}
              onSaveRequest={_onSaveRequest}
              onUpdateRequest={_onUpdateRequest}
              onDemoMDRequest={_onDemoMDRequest}
              onClearPanel={_onClearPanel}
            />
          </Column>
          <Resizable
            left={true}
            minWidth={400}
            maxWidth={'80%'}
            height={'100%'}
            width={'50%'}
          >
            <Column height="100%" width="100%">
              <Target
                sourceBody={state?.panel?.source?.body || ''}
                target={state?.panel?.target || {}}
                tabFns={tabFns}
                onSelectTargetControl={_onSelectTargetControl}
                onCopy={_onCopy}
              />
            </Column>
          </Resizable>
        </Row>
      </Container.Body>
    </Container>
  );
};

export default MarkdownTab;

interface IMarkdownTab {
  tab: ITab;
  tabFns: ITabFns;
}
