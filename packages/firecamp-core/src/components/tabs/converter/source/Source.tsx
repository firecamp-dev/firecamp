import { FC } from 'react';
import { Container, TabHeader } from '@firecamp/ui-kit';

import { ITabMeta, ITabFns } from '../../types/tab';
import { ISourceState } from '../types';

import Header from './Header';
import Body from './Body';
import Controls from './Controls';

const Source: FC<ISource> = ({
  source,
  tabMeta,
  tabId,
  tabFns,
  requestMeta = { name: '' },

  onSourceUpdate = (_) => {},
  onDemoJsonRequest = () => {},
  onClearPanel = () => {},
  onPrettify = () => {},
  onSaveRequest = () => {},
  onUpdateRequest = () => {},
}) => {
  return (
    <Container className="with-divider">
      <Container.Header className="bg-appBackground2">
        <TabHeader className="converter-left-header">
          <Header source={source} requestMeta={requestMeta} />
        </TabHeader>
      </Container.Header>
      <Container.Header>
        <TabHeader>
          <Controls
            source={source}
            tabMeta={tabMeta}
            tabId={tabId}
            onDemoJsonRequest={onDemoJsonRequest}
            onClearPanel={onClearPanel}
            onPrettify={onPrettify}
            onSaveRequest={onSaveRequest}
            onUpdateRequest={onUpdateRequest}
          />
        </TabHeader>
      </Container.Header>
      <Container.Body overflow="hidden">
        <Body source={source} onSourceUpdate={onSourceUpdate} tabFns={tabFns} />
      </Container.Body>
    </Container>
  );
};

export default Source;

interface ISource {
  /**
   * Converter tab source data
   */
  source: ISourceState;

  /**
   * Reqeust tab meta
   */
  tabMeta: ITabMeta;

  /**
   * Request tab unique identification
   */
  tabId: string;

  /**
   * Request tab functions
   */
  tabFns: ITabFns;

  /**
   * Request tab meta
   */
  requestMeta: { name: string };

  /**
   * Update source data/ string value from editor to request state
   */
  onSourceUpdate: (value: string) => void;

  /**
   * Set demo json payload to editor
   */
  onDemoJsonRequest?: () => void;

  /**
   * Clear editor
   */
  onClearPanel?: () => void;

  /**
   * Prettify serialize data from editor
   */
  onPrettify?: () => void;

  /**
   * Save request tab
   */
  onSaveRequest?: (saveRequestData: object) => void;

  /**
   * Update request tab
   */
  onUpdateRequest?: () => void;
}
