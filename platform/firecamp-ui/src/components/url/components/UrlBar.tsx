import { FC } from 'react';
import cx from 'classnames';
import { Pencil } from 'lucide-react';
import {
  CopyButton,
  Column,
  Row,
  RootContainer,
  ToolBar,
  Container,
} from '@firecamp/ui';
import './UrlBar.scss';

const UrlBar: FC<IUrlBar> & {
  Prefix: FC<IPrefix>;
  Body: FC<IBody>;
  Suffix: FC<ISuffix>;
} = ({
  children,
  nodePath = '',
  showEditIcon = false,
  onEditClick = () => {},
}) => {
  return (
    <Container.Header className="urlbar-wrapper">
      <div className="fc-statusbar">
        {!!nodePath ? (
          <div className="fc-urlbar-path flex">
            <span>{nodePath || ''}</span>
            <ToolBar className="ml-4 visible">
              {showEditIcon ? (
                <Pencil size={16} onClick={onEditClick} />
              ) : (
                <></>
              )}
              <CopyButton
                className="hidden"
                id={`copy-button`}
                text={nodePath || ''}
              />
            </ToolBar>
          </div>
        ) : (
          <></>
        )}
      </div>

      <RootContainer className="px-2 h-10 items-center justify-center">
        <Row className="fc-urlbar-container w-full overflow-visible">
          {children}
        </Row>
      </RootContainer>
    </Container.Header>
  );
};

const Prefix: FC<IPrefix> = ({ children, className }) => {
  return (
    <Column
      className={cx(className, `fc-urlbar-container-prefix`)}
      width="fit-content"
    >
      {children}
    </Column>
  );
};

const Body: FC<IBody> = ({ children, className }) => {
  return (
    <Column
      className={cx(className, `flex items-center`)}
      flex={1}
      overflow="hidden"
    >
      <div className="flex-1">{children}</div>
    </Column>
  );
};

const Suffix: FC<ISuffix> = ({ children, className }) => {
  return (
    <Column
      className={cx(className, `fc-urlbar-container-suffix flex flex-nowrap`)}
      width="fit-content"
    >
      {children}
    </Column>
  );
};

UrlBar.Prefix = Prefix;
UrlBar.Body = Body;
UrlBar.Suffix = Suffix;

export default UrlBar;

interface IUrlBar {
  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[];

  /**
   * Request tab node path
   */
  nodePath: string;

  /** callback fn on edit icon click */
  onEditClick?: () => void;

  /** whether show edit icon */
  showEditIcon?: boolean;
}

/**
 * RootContainer pre/ prefix component
 */
interface IPrefix {
  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[];

  /**
   * Extra styling class name
   */
  className?: string;
}

/**
 * RootContainer body component
 */
interface IBody {
  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[];

  /**
   * Extra styling class name
   */
  className?: string;
}

/**
 * RootContainer post/ suffix component
 */
interface ISuffix {
  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[];

  /**
   * Extra styling class name
   */
  className?: string;
}
