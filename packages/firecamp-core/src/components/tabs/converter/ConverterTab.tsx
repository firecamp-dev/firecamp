import { FC, useState, useEffect, useRef } from 'react';
import { Column, Row, RootContainer, Resizable } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import './ConverterTab.sass';
import DataConverter from './DataConverter';
import * as cacheTabsFactory from '../../../services/cache-tabs-factory';
import ConverterTabService from './ConverterTabService';
import Source from './source/Source';
import Target from './target/Target';
import { ERequestTypes } from '@firecamp/types';
import { ITab, ITabFns } from '../types/tab';
import { EConverterLang } from './types';

const { JS, JSON: Json, XML, YAML } = EConverterLang;

const demoJson = `{
  "firecamp": {
    "app": "Firecamp",
    "link": "https://firecamp.io",
    "vision": {
      "short": "Visualizing the invisible side of realtime SocketIO, WS",
      "long": "Making developer life better, everyday."
    }
  }
}`;

const ConverterTab: FC<IConverterTab> = ({ tab: propTab, tabFns }) => {
  let { current: converterTabService } = useRef(
    new ConverterTabService(propTab)
  );

  let cacheTabsFactoryFns = cacheTabsFactory;

  let _updateCacheTab = (state) => {
    let syncState = converterTabService.getCurrentState() || {};
    let reactState = Object.assign({}, state);
    cacheTabsFactoryFns.setTab(propTab.id, {
      request: reactState,
      sync: syncState,
    });
  };

  let [state, setState] = useState({
    startManually: false,
    panel: {
      source: {
        allowedTypes: {
          xml: {
            name: 'XML',
            type: XML,
          },
          json: {
            name: 'JSON',
            type: Json,
          },
          js: {
            name: 'JSObject',
            type: JS,
          },
          yaml: {
            name: 'YAML',
            type: YAML,
          },
          OTHER: {
            //todo remove it later once the other undefined issue solve
            name: 'OTHER',
            type: 'other',
          },
        },
        type: Json,
        body: '',
        isUpdating: false,
        hasTypeDetected: false,
        hasError: false,
      },
      target: {
        allowedTypes: {
          xml: {
            name: 'XML',
            type: XML,
          },
          json: {
            name: 'JSON',
            type: Json,
            controls: {
              xml: ['Compact', 'Non-compact', 'Plain', 'JSObject'],
              json: ['Plain', 'JSObject'],
              yaml: ['Plain', 'JSObject'],
            },
            activeControl: {
              xml: 'Compact',
              json: 'Plain',
              yaml: 'Plain',
            },
            isControlSelected: false,
          },
          yaml: {
            name: 'YAML',
            type: YAML,
          },
        },
        type: XML,
        body: '',
        message: 'mark default view XML',
      },
      isTargetSelected: false,
    },
    revision:
      propTab.meta && Object.keys(propTab.meta).includes('revision')
        ? propTab.meta.revision
        : 1,
    ...(propTab?.session?.request || {}),
  });
  let stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    _updateCacheTab(state);
  }, [state]);

  useEffect(() => {
    // F?.reactGA?.pageview?.('json/xml/yaml');
    // if (propTab?.request?.data) {
    //   _onSourceUpdate(propTab?.request?.data);
    // }
  }, []);

  useEffect(() => {
    let statePayload = {};

    if (
      Object.keys(propTab.meta).includes('revision') &&
      !equal(propTab.meta.revision, state.revision) &&
      (!equal(state.panel.source.body, propTab.request.data) ||
        !equal(state.panel.source.type, propTab.request.meta.data_type))
    ) {
      if (state.panel && state.panel.source && state.panel.source.body) {
        statePayload = Object.assign({}, state, {
          panel: Object.assign({}, state.panel, {
            source: Object.assign({}, state.panel.source, {
              body: propTab.request.data,
              type: propTab.request.meta.data_type || Json,
            }),
          }),
          revision: propTab.meta.revision || 1,
        });
      }
    }
    if (Object.keys(statePayload).length) {
      setState(statePayload);
    }
    converterTabService.setProps(propTab);
  }, [propTab]);

  /**
   * Get source code and set it to sourec body, detect source dataType, check for error,
   * @param sourceCode : Code from source
   * @returns {Promise.<void>}
   * @private
   */
  let _onSourceUpdate = async (sourceCode) => {
    // console.log("sourcecode from func", sourceCode)

    if (!sourceCode || !sourceCode.length) {
      _onClearPanel();
      return;
    }

    let type = DataConverter.detectDataType(sourceCode);
    // console.log("type", type)
    let {
      panel: {
        source: { isUpdating },
        target: { type: tType, allowedTypes: tAllowedTypes },
      },
    } = state;
    if (sourceCode || sourceCode.length) {
      isUpdating = true;
      type = DataConverter.detectDataType(sourceCode);
    }

    let hasTypeDetected = type !== 'OTHER' ? true : false;
    let hasError =
      type !== 'OTHER' ? !DataConverter.validate[type](sourceCode) : true;

    // console.log("detected type: ", type, hasTypeDetected, hasError);
    let targetCode;
    if (isUpdating && hasTypeDetected && !hasError) {
      if (tType !== Json) {
        targetCode = await _convert[type][`to${tType.toUpperCase()}`](
          sourceCode
        );
      } else {
        targetCode = await _convert[type][`to${tType.toUpperCase()}`](
          sourceCode,
          tAllowedTypes[tType].activeControl[type] === 'JSObject'
            ? 'js'
            : tAllowedTypes[tType].activeControl[type]
        );
      }
    } else {
      targetCode = '';
    }

    // console.log("target code", targetCode)
    setState((ps) => {
      return {
        ...ps,
        panel: {
          ...ps.panel,
          source: {
            ...ps.panel.source,
            type: type,
            body: sourceCode,
            hasTypeDetected: hasTypeDetected,
            hasError: hasError,
            isUpdating: true,
          },
          target: {
            ...ps.panel.target,
            body: !hasError ? targetCode : ps.panel.target.body,
          },
        },
      };
    });

    converterTabService.action.update(sourceCode, type);
  };

  /**
   * Prettifies source data
   * @private
   */
  let _onPrettify = () => {
    let {
      panel: {
        source: { type, body },
      },
    } = state;

    if (!body) return;
    let prettybody = DataConverter.prettify[type](body);
    _onSourceUpdate(prettybody);
  };

  /**
   * Get target type and returns code arrording to selected type
   * @param tType = [xml, json, yaml]
   * @param control
   * @returns {Promise.<void>}
   * @private
   */
  let _onSelectTargetType = async (tType = XML, con) => {
    let control = con;
    if (control === 'JSObject') {
      control = 'js';
    }
    let tBody: any;
    let {
      panel: {
        source: { type: sType, body: sBody },
      },
    } = state;
    if (!sBody || sType === 'OTHER') return;

    switch (sType) {
      /*_convert source to target:
       * _convert.sourceType.toTargetType(sourceCode,control)
       * */
      case `${sType}`:
        tBody = await _convert[sType][`to${tType.toUpperCase()}`](
          sBody,
          control
        );
        break;
    }

    setState((ps) => ({
      ...ps,
      panel: {
        ...ps.panel,
        target: {
          ...ps.panel.target,
          body: tBody,
          type: tType,
          allowedTypes:
            tType !== Json
              ? ps.panel.target.allowedTypes
              : {
                  ...ps.panel.target.allowedTypes,
                  [tType]: {
                    ...ps.panel.target.allowedTypes[tType],
                    activeControl: {
                      ...ps.panel.target.allowedTypes[tType].activeControl,
                      [sType]: control === 'js' ? 'JSObject' : control,
                    },
                    isControlSelected: true,
                  },
                },
        },
        isTargetSelected: true,
      },
    }));
  };

  let _onSaveRequest = async ({
    name,
    description,
    project: collection_id,
    module: folder_id,
  }) => {
    let {
      panel: {
        source: { body, type },
      },
    } = state;

    if (!body || type === 'OTHER') return;

    let tabRequest;
    tabRequest = {
      meta: {
        name,
        description,
        type: ERequestTypes.File,
        data_type: type,
      },
      data: body,
      _meta: {
        collection_id,
        folder_id,
      },
    }; //TODO: version

    await converterTabService.db.addRequest(tabRequest);
    _updateCacheTab(state);
    return Promise.resolve(tabRequest);
  };

  let _onDemoJsonRequest = () => {
    let {
      panel: {
        source: { body },
      },
    } = state;
    if (body) {
      return;
    } else {
      _onSourceUpdate(demoJson);
    }
  };

  let _onUpdateRequest = async () => {
    converterTabService.db.updateRequest(stateRef.current);
  };

  let _onClearPanel = () => {
    setState((ps) => {
      return {
        ...ps,
        panel: {
          source: {
            allowedTypes: {
              xml: {
                name: 'XML',
                type: XML,
              },
              json: {
                name: 'JSON',
                type: Json,
              },
              js: {
                name: 'JSObject',
                type: JS,
              },
              yaml: {
                name: 'YAML',
                type: YAML,
              },
              OTHER: {
                //todo remove it later once the other undefined issue solve
                name: 'OTHER',
                type: 'other',
              },
            },
            type: Json,
            body: '',
            isUpdating: false,
            hasTypeDetected: false,
            hasError: false,
          },
          target: {
            allowedTypes: {
              xml: {
                name: 'XML',
                type: XML,
              },
              json: {
                name: 'JSON',
                type: Json,
                controls: {
                  xml: ['Compact', 'Non-compact', 'Plain', 'JSObject'],
                  json: ['Plain', 'JSObject'],
                  yaml: ['Plain', 'JSObject'],
                },
                activeControl: {
                  xml: 'Compact',
                  json: 'Plain',
                  yaml: 'Plain',
                },
                isControlSelected: false,
              },
              yaml: {
                name: 'YAML',
                type: YAML,
              },
            },
            type: XML,
            body: '',
            message: 'mark default view XML',
          },
          isTargetSelected: false,
        },
      };
    });
  };

  let _convert = {
    xml: {
      toXML: (body) => {
        return Promise.resolve(DataConverter.prettify[XML](body));
      },
      toJSON: async (body, control) => {
        let jsonCode = await DataConverter.convert.xml.toJSON(body, control);

        if (control === JS) {
          return jsonCode;
        }
        return DataConverter.prettify[Json](jsonCode);
      },
      toYAML: async (body) => {
        let yamlCode = await DataConverter.convert.xml.toYAML(body);
        return DataConverter.prettify[YAML](yamlCode);
      },
    },
    json: {
      toXML: async (body) => {
        let xmlCode = await DataConverter.convert.json.toXML(body);
        return DataConverter.prettify[XML](xmlCode);
      },
      toJSON: async (body, control) => {
        let jsonCode = await DataConverter.convert.json.toJSON(body, control);
        if (control === JS) {
          return jsonCode;
        }
        return DataConverter.prettify[Json](jsonCode);
      },
      toYAML: async (body) => {
        let yamlCode = await DataConverter.convert.json.toYAML(body);
        return DataConverter.prettify[YAML](yamlCode);
      },
    },
    js: {
      toXML: async (body) => {
        let xmlCode = await DataConverter.convert.js.toXML(body);
        return DataConverter.prettify[XML](xmlCode);
      },
      toJSON: async (body) => {
        let jsonCode = await DataConverter.convert.js.toJSON(body);
        return DataConverter.prettify[Json](jsonCode);
      },
      toYAML: async (body) => {
        let yamlCode = await DataConverter.convert.js.toYAML(body);
        return DataConverter.prettify[YAML](yamlCode);
      },
    },
    yaml: {
      toXML: async (body) => {
        let xmlCode = await DataConverter.convert.yaml.toXML(body);
        return DataConverter.prettify[XML](xmlCode);
      },
      toJSON: async (body, control) => {
        let jsonCode = await DataConverter.convert.yaml.toJSON(body, control);
        if (control === JS) {
          return jsonCode;
        }
        return DataConverter.prettify[Json](jsonCode);
      },
      toYAML: (body) => {
        return Promise.resolve(DataConverter.prettify[YAML](body));
      },
    },
  };

  return (
    <RootContainer className="fc-h-full w-full converter-tab-container">
      <Row className="with-divider fc-h-full w-full" height="100%">
        <Column
          height={'100%'}
          flex={1}
          minWidth="20%"
          maxWidth={'80%'}
          overflow="visible"
          width={'50%'}
        >
          <Source
            source={state?.panel?.source || {}}
            tabMeta={propTab.meta}
            tabId={propTab.id}
            tabFns={tabFns}
            requestMeta={propTab?.request?.meta || {}}
            onSourceUpdate={_onSourceUpdate}
            onDemoJsonRequest={_onDemoJsonRequest}
            onClearPanel={_onClearPanel}
            onPrettify={_onPrettify}
            onSaveRequest={_onSaveRequest}
            onUpdateRequest={_onUpdateRequest}
          />
        </Column>
        <Resizable
          left={true}
          minWidth={'400'}
          maxWidth={'80%'}
          height={'100%'}
          width={'50%'}
        >
          <Column width="100%" height="100%">
            <Target
              target={state?.panel?.target || {}}
              sourceType={state?.panel?.source?.type}
              tabFns={tabFns}
              onSelectTargetType={_onSelectTargetType}
            />
          </Column>
        </Resizable>
      </Row>
    </RootContainer>
  );
};

export default ConverterTab;

/**
 * Data converter tab
 * Sources and target languages: json, xml, text, yaml
 */
interface IConverterTab {
  /**
   * Request tab object
   */
  tab: ITab;

  /**
   * Tab functions
   */
  tabFns: ITabFns;
}
