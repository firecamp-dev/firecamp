//@ts-nocheck
import { FC } from "react";
import Column from './Column';
import Row from './Row';

import { IContainer, IHeader, IBody, IFooter, IEmpty } from "./interfaces/Container.interfaces"

const Container: FC<IContainer> & {
  Header: FC<IHeader>,
  Body: FC<IBody>,
  Footer: FC<IFooter>,
  Empty: FC<IEmpty>
} = ({
  children = [],
  className = '',
  overflow = 'visible'
}) => {
    return (
      <Row
        className={`flex-nowrap flex-col h-full w-full ` + className}
        overflow={overflow}
        maxWidth="100%"
      >
        {children}
      </Row>
    );
  };

const Header: FC<IHeader> = ({ children, className, flex = 'none', height = '' }) => {
  return (
    <Column className={className} height={height} flex={flex} overflow="visible">
      {children}
    </Column>
  );
};

const Body: FC<IBody> = ({
  children = [],
  className = '',
  overflow = 'auto',
  minHeight = '',
  height = ''
}) => {
  return (
    <Column
      className={className}
      flex={1}
      overflow={overflow}
      minHeight={minHeight}
      height={height}
    >
      {children}
    </Column>
  );
};

const Footer: FC<IFooter> = ({ children = [], className = '', flex='none' }) => {
  return <Column className={className} flex={flex} >{children}</Column>;
};

const Empty: FC<IEmpty> = ({ children = [], className, flex }) => {
  return (
    <Column flex={flex} className={className + ` fc-empty`}>
      {children}
    </Column>
  );
};

Container.Header = Header
Container.Body = Body
Container.Footer = Footer
Container.Empty = Empty

export default Container;
