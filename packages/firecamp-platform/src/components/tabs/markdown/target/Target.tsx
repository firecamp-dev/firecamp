// @ts-nocheck
import { FC } from 'react';
import { Container } from '@firecamp/ui-kit';
import ReactMarkdown from 'react-markdown';

import Header from './Header';
import Body from './Body';

import { ITabFns } from '../../types/tab';

const Target: FC<ITarget> = ({
  sourceBody = '',
  target: { body: targetBody, controls, activeControl },
  tabFns = {},

  onSelectTargetControl = (_) => {},
}) => {
  return (
    <Container className="w-full with-divider">
      <Container.Header>
        <Header
          activeControl={activeControl}
          controls={controls}
          onSelectTargetControl={onSelectTargetControl}
        />
      </Container.Header>
      <Container.Body className="p-3">
        {activeControl === 'preview' ? (
          <ReactMarkdown children={sourceBody} />
        ) : (
          <Body body={targetBody} tabFns={tabFns} />
        )}
      </Container.Body>
    </Container>
  );
};

export default Target;

interface ITarget {
  sourceBody: string;
  target: ITargetState;
  tabFns: ITabFns;

  /**
   * Select target type
   */
  onSelectTargetControl: (type: string) => void;
}

export interface ITargetState {
  body: string;
  type: string;
  controls: object;
  activeControl?: string;
}
