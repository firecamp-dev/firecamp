import { FC } from "react";
import { CopyButton, Column, Row, RootContainer, ToolBar } from '@firecamp/ui-kit';
import cx from 'classnames';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import './UrlBar.scss';

const UrlBar: FC<IUrlBar> & {
  Prefix: FC<IPrefix>,
  Body: FC<IBody>,
  Suffix: FC<ISuffix>
} = ({ children, environmentCard = '', nodePath = '', showEditIcon=false, onEditClick= ()=>{} }) => {
  return (
    <>
      <div className="fc-statusbar">
        {!!nodePath ? (
          <div className="fc-urlbar-path">
            <span>{nodePath || ''}</span>
            <ToolBar className="ml-4 visible">
              { showEditIcon? <VscEdit size={16} onClick={onEditClick}/>: <></> }
              <CopyButton className="hidden" id={`copy-button`} text={nodePath || ''} />
            </ToolBar>
          </div>
        ) : (
          ''
        )}
        {environmentCard || ''}
      </div>

      <RootContainer className="px-2 h-10 items-center justify-center">
        <Row className="fc-urlbar-container w-full overflow-visible">{children}</Row>
      </RootContainer>
    </>
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
    <Column className={cx(className, `flex items-center`)} flex={1} overflow="hidden">
      <div className="flex-1">
      {children}
      </div>
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

UrlBar.Prefix = Prefix
UrlBar.Body = Body
UrlBar.Suffix = Suffix

export default UrlBar;

interface IUrlBar {

  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[]

  /**
   * Environment dropdown supported component
   */
  environmentCard: JSX.Element

  /**
   * Request tab node path 
   */
  nodePath: string,

  /** callback fn on edit icon click */
  onEditClick?: ()=> void;

  /** whether show edit icon */
  showEditIcon?: boolean
}

/**
 * RootContainer pre/ prefix component
 */
interface IPrefix {

  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[]

  /**
   * Extra styling classname
   */
  className?: string
}

/**
 * RootContainer body component
 */
interface IBody {

  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[]

  /**
   * Extra styling classname
   */
  className?: string
}

/**
 * RootContainer post/ suffix component
 */
interface ISuffix {

  /**
   * RootContainer child component
   */
  children: JSX.Element | JSX.Element[]

  /**
   * Extra styling classname
   */
  className?: string
}