import { FC } from 'react';
import { Container, TabHeader } from '@firecamp/ui-kit';

import Header from './Header';
import Body from './Body';
import Controls from './Controls';

import { ITabFns } from '../../types/tab';
import { EConverterLang } from '../types';

const Target: FC<ITarget> = ({
  target,
  sourceType = '',
  tabFns,

  onSelectTargetType = (_) => {},
}) => {
  return (
    <Container className="with-divider w-full">
      <Container.Header className="bg-appBackground2">
        <TabHeader className="converter-right-header">
          <Header
            target={target}
            sourceType={sourceType}
            onSelectTargetType={onSelectTargetType}
          />
        </TabHeader>
      </Container.Header>
      <Container.Header>
        <TabHeader>
          <Controls
            target={target}
            sourceType={sourceType}
            onSelectTargetType={onSelectTargetType}
          />
        </TabHeader>
      </Container.Header>
      <Container.Body overflow="hidden">
        <Body target={target} tabFns={tabFns} />
      </Container.Body>
    </Container>
  );
};

export default Target;

interface ITarget {
  target: ITargetState;

  /**
   * Source data type
   */
  sourceType: string;

  tabFns: ITabFns;

  /**
   * Select target type and sub-type
   */
  onSelectTargetType: (type: string, subType: string) => void;
}

export interface ITargetState {
  /**
   * target alowed types/ languages
   */
  allowedTypes: object;

  /**
   * target data type
   */
  type:
    | EConverterLang.JS
    | EConverterLang.JSON
    | EConverterLang.XML
    | EConverterLang.YAML;

  /**
   * target data
   */
  body: string;

  message?: string;
}
