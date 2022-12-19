// @ts-nocheck
import { FC } from 'react';
import { Container } from '@firecamp/ui-kit';
import { ITabFns, ITabMeta } from '../../types/tab';

import Header from './Header';
import Body from './Body';

const Source: FC<ISource> = ({
  source = {},
  tabMeta = {},
  tabId = '',
  requestMeta = {},
  tabFns = {},

  onSourceUpdate = (_) => {},
  onSaveRequest = (_) => {},
  onUpdateRequest = (_) => {},
  onDemoMDRequest = (_) => {},
  onClearPanel = (_) => {},
}) => {
  return (
    <Container className="with-divider">
      <Container.Header>
        <Header
          source={source}
          tabMeta={tabMeta}
          tabId={tabId}
          requestMeta={requestMeta}
          onSaveRequest={onSaveRequest}
          onUpdateRequest={onUpdateRequest}
          onDemoMDRequest={onDemoMDRequest}
          onClearPanel={onClearPanel}
        />
      </Container.Header>
      <Container.Body overflow="visible" className="test123">
        <Body
          body={source?.body || ''}
          tabFns={tabFns}
          onSourceUpdate={onSourceUpdate}
        />
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
  requestMeta: object;

  /**
   * Udpate source data/ string value from editor to request state
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
   * Save request tab
   */
  onSaveRequest?: (saveRequestData: object) => void;

  /**
   * Update request tab
   */
  onUpdateRequest?: () => void;
}

export interface ISourceState {
  body: string;
  type: string;
}
